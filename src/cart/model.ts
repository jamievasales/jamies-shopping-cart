import {IProduct} from "../product/model";
import {PromotionRule} from "../promotion/model";

export interface ICartDto {
    id: string;
    items: ICartItemDto[];
    total: number;
}

export interface ICartItemDto {
    sku: string;
    cartId: string;
    product: IProduct;
    quantity: number;
    promotion?: PromotionRule;
}

interface BaseICartItem {
    sku: string;
    quantity: number;
}

export interface ICartItem extends BaseICartItem {
    cart_id: string;
}

export interface ICartItemRequest extends BaseICartItem {
    cartId: string;
}