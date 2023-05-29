import {ICartItemDto} from "./model";
import {ICartProduct} from "../product/model";
import {BuyMoreThanXForYDiscountPromotion, BuyXForPriceOfYPromotion, BuyXGetYFreePromotion} from "../promotion/model";

export class Cart {
    private readonly cartId: string;
    private cartItems: ICartItemDto[] = [];
    private finalisedCartItems: { [sku: string]: ICartProduct } = {};
    private freeItems: string[] = [];
    private total: number = 0;

    constructor(cartId: string) {
        this.cartId = cartId;
    }

    getCart() {
        this.applyFreeItems();
        this.total = this.calculateTotal();
        return {
            id: this.cartId,
            items: this.finalisedCartItems,
            total: this.total.toFixed(2)
        }
    }

    addCartItems(cartItems: ICartItemDto[]) {
        this.cartItems = cartItems;
        this.applyPromotions();
    }

    private applyPromotions() {
        this.freeItems = [];
        this.finalisedCartItems = {};
        this.total = 0;
        this.cartItems.forEach((cartItem: ICartItemDto) => {
            this.finalisedCartItems[cartItem.sku] = this.initialiseCartProduct(cartItem);
            if (cartItem.promotion) {
                switch (cartItem.promotion.type) {
                    case 'buyXGetYFree':
                        this.applyBuyXGetYFreePromotion(cartItem);
                        break;
                    case 'buyXForPriceOfY':
                        this.applyBuyXForPriceOfYPromotion(cartItem);
                        break;
                    case 'buyMoreThanXForYDiscount':
                        this.applyBuyMoreThanXForYDiscountPromotion(cartItem);
                        break;
                }
            }
        })
    }

    private applyBuyXGetYFreePromotion(cartItem: ICartItemDto) {
        const promotion = cartItem.promotion as BuyXGetYFreePromotion;
        const cartProduct = this.finalisedCartItems[cartItem.sku];
        if (cartItem.quantity >= promotion.qty) {
            const freeItem = this.cartItems.find((item: ICartItemDto) => {
                return item.sku === promotion.freeItemSku;
            });

            if (freeItem) {
                this.freeItems.push(freeItem.sku);
                const freeItemName = freeItem.product.name;
                cartProduct.promotionApplied = `Free ${freeItemName} with ${promotion.qty} or more ${cartItem.product.name}`;
            }
        }
    }

    private applyBuyXForPriceOfYPromotion(cartItem: ICartItemDto) {
        const promotion = cartItem.promotion as BuyXForPriceOfYPromotion;
        const cartProduct = this.finalisedCartItems[cartItem.sku];

        if (cartItem.quantity >= promotion.x) {
            const freeMultiplier = Math.floor(cartItem.quantity / promotion.x);
            const freeY = (promotion.x * freeMultiplier) - (promotion.y * freeMultiplier);
            cartProduct.discount += this.toDecimalPlaces(freeY * cartItem.product.price);

            cartProduct.promotionApplied = `Buy ${promotion.x} ${cartProduct.name} for the price of ${promotion.y} (Stackable)`;
        }
    }

    private applyBuyMoreThanXForYDiscountPromotion(cartItem: ICartItemDto) {
        const promotion = cartItem.promotion as BuyMoreThanXForYDiscountPromotion;
        const cartProduct = this.finalisedCartItems[cartItem.sku];
        if (cartItem.quantity >= promotion.qty) {
            let discount = 0;
            if (promotion.discountType === 'percentage') {
                const baseTotal = (cartProduct.price * cartItem.quantity)
                discount = baseTotal - (baseTotal * (1 - (promotion.discount / 100)));
            }
            if (promotion.discountType === 'fixed') {
                discount = Number(promotion.discount);
            }

            cartProduct.discount += this.toDecimalPlaces(discount);

            const discountTypeText = promotion.discountType === 'percentage' ? `${promotion.discount}%` : `$${promotion.discount}`;

            cartProduct.promotionApplied = `Buy ${promotion.qty} or more of ${cartItem.product.name} and save ${discountTypeText}`;
        }
    }

    private initialiseCartProduct(cartItem: ICartItemDto): ICartProduct {
        return {
            sku: cartItem.sku,
            name: cartItem.product.name,
            qty: cartItem.quantity,
            price: cartItem.product.price,
            discount: 0,
            total: 0,
        }
    }

    private applyFreeItems() {
        this.freeItems.forEach((sku: string) => {
            const cartProduct = this.finalisedCartItems[sku];
            if (!cartProduct) {
                // Do nothing if the free item isn't scanned
                return;
            }

            cartProduct.discount += this.toDecimalPlaces(cartProduct.price);
        });
    }

    private calculateTotal() {
        let total = 0;
        Object.keys(this.finalisedCartItems).forEach((sku: string) => {
            const cartProduct = this.finalisedCartItems[sku];
            cartProduct.total = this.toDecimalPlaces((cartProduct.price * cartProduct.qty) - cartProduct.discount);
            total += (cartProduct.price * cartProduct.qty) - cartProduct.discount;
        });
        return total;
    }

    private toDecimalPlaces(value: number, decimalPlaces = 2) {
        return Number(value.toFixed(decimalPlaces));
    }
}