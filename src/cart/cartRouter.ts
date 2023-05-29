import {Request, Response, Router} from "express";
import {CartService} from "./CartService";
import {ICartItemRequest} from "./model";

export const cartRouter: Router = Router();

const cartService: CartService = new CartService();

const upsertCartItem = async (req: Request, res: Response) => {
    const cartItem: ICartItemRequest = req.body;

    if (!cartItem.sku || !cartItem.quantity || !cartItem.cartId) {
        return res.status(400).send("sku, quantity and cart id is required");
    }
    try {
        await cartService.addCartItem(cartItem);
        const cart = await cartService.getCart(cartItem.cartId as string)
        return res.send(cart);
    } catch (e) {
        return res.status(500).send('Could not add cart item');
    }
}

const getCart = async (req: Request, res: Response) => {
    const {cartId} = req.params;

    if (!cartId) {
        return res.status(400).send("cartId query param is required");
    }

    try {
        const cart = await cartService.getCart(cartId as string);

        return res.send(cart);
    } catch (e) {
        console.error(e)
        return res.status(500).send('Could not get cart for cartId ' + cartId);
    }
}


const removeCartItem = async (req: Request, res: Response) => {
    const cartItem: ICartItemRequest = req.body;

    if (!cartItem.sku || !cartItem.cartId) {
        return res.status(400).send("sku is required");
    }

    try {
        await cartService.deleteCartItem(cartItem);
        const cart = await cartService.getCart(cartItem.cartId as string)

        return res.send(cart);
    } catch (e) {
        console.error(e)
        return res.status(500).send('Could not delete cart item');
    }


}

const removeCartItems = async (req: Request, res: Response) => {
    const {cartId} = req.params;

    if (!cartId) {
        return res.status(400).send("cartId is required");
    }

    try {
        await cartService.deleteCartItems(cartId);
        const cart = await cartService.getCart(cartId)

        return res.send(cart);
    } catch (e) {
        console.error(e)
        return res.status(500).send('Could not delete cart items');
    }
}

const createCart = async (req: Request, res: Response): Promise<Response> => {
    try {
        const cartId = await cartService.createCart();
        return res.send({cartId: cartId});
    } catch (e) {
        console.error(e)
        return res.status(500).send('Could not create cart');
    }
}

cartRouter.post('/', createCart);
cartRouter.post('/item', upsertCartItem);
cartRouter.delete('/item', removeCartItem);
cartRouter.delete('/:cartId', removeCartItems);
cartRouter.get('/:cartId', getCart);