import {ICartItemDto, ICartItemRequest} from "./model";
import {CartRepository} from "./CartRepository";
import {PromotionService} from "../promotion/PromotionService";
import {generateNewId} from "../util/generalUtil";
import {Cart} from "./Cart";

export class CartService {
    // Ideally I would have used NestJS for DI or inversifyJS
    private promotionService: PromotionService = new PromotionService();
    private cartRepository: CartRepository = new CartRepository();

    async getCart(cartId: string): Promise<any> {
        let cartItems = await this.cartRepository.getCartItemsByCartId(cartId);
        cartItems = await Promise.all(cartItems.map(async (cartItem: ICartItemDto) => {
            const promotion = await this.promotionService.getPromotion(cartItem.sku);
            if (promotion) {
                cartItem.promotion = promotion;
            }

            return cartItem;
        }));

        const cart: Cart = new Cart(cartId);
        cart.addCartItems(cartItems);

        return cart.getCart();
    }

    async addCartItem(cartItemRequest: ICartItemRequest): Promise<void> {
        try {
            await this.cartRepository.saveCartItem(cartItemRequest);
        } catch (error) {
            console.log(`Could not save cart item to cart: ${cartItemRequest.cartId}`);
            throw error;
        }
    }

    async deleteCartItem(cartItemRequest: ICartItemRequest): Promise<void> {
        try {
            await this.cartRepository.deleteCartItem(cartItemRequest);
        } catch (error) {
            console.log(`Could not delete cart item ${cartItemRequest.sku} from cart: ${cartItemRequest.cartId}`);
            throw error;
        }
    }

    async deleteCartItems(cartId: string): Promise<void> {
        try {
            await this.cartRepository.deleteCartItems(cartId);
        } catch (error) {
            console.log(`Could not delete cart items from cart: ${cartId}`);
            throw error;
        }
    }

    async createCart() {
        try {
            const cartId = generateNewId();
            await this.cartRepository.createCart(cartId);

            return cartId;
        } catch (error) {
            console.log(`Could not create cart`);
            throw error;
        }
    }
}