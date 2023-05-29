import {ICartItemDto, ICartItemRequest} from "./model";
import {db} from "../../index";

export class CartRepository {
    async getCartItemsByCartId(cartId: string): Promise<ICartItemDto[]> {
        return db<ICartItemDto[]>('cart_items')
            .select('sku', 'quantity', 'cart_id')
            .select(db.raw('(SELECT ROW_TO_JSON(products.*) FROM products WHERE products.sku = cart_items.sku) AS product'))
            .where('cart_items.cart_id', cartId)
    }

    async saveCartItem(cartItem: ICartItemRequest): Promise<void> {
        try {
            await this.deleteCartItem(cartItem);
        } catch (error) {
            console.log('Cart item does not exist. Creating new cart item.');
        }

        await db('cart_items')
            .insert({
                cart_id: cartItem.cartId,
                sku: cartItem.sku,
                quantity: cartItem.quantity,
            });
    }

    async createCart(cartId: string) {
        await db('carts')
            .insert({
                id: cartId,
            });
    }

    async deleteCartItem(cartItem: ICartItemRequest): Promise<void> {
        await db('cart_items')
            .where('sku', cartItem.sku)
            .andWhere('cart_id', cartItem.cartId)
            .delete();
    }

    async deleteCartItems(cartId: string): Promise<void> {
        await db('cart_items')
            .where('cart_id', cartId)
            .delete();
    }
}