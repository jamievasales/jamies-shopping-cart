import {Request, Response, Router} from "express";
import {ProductService} from "./ProductService";
import {IProductDto} from "./model";

export const productRouter: Router = Router();
const productService: ProductService = new ProductService();

const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await productService.getProducts();
        return res.send(products);
    } catch (e) {
        return res.status(500).send('Could not get products');
    }
}

const getProductBySku = async (req: Request, res: Response) => {
    const {sku} = req.params;

    if (!sku) {
        return res.status(400).send("sku query param is required");
    }

    try {
        const product = await productService.getProductBySku(sku as string);
        return res.send(product);
    } catch (e) {
        return res.status(500).send('Could not get product for sku ' + sku);
    }
}

const addProduct = async (req: Request, res: Response) => {
const product: IProductDto = req.body;

    if (!product.sku || !product.name || !product.price || !product.inventoryQty) {
        return res.status(400).send("sku, name, price and inventoryQty is required");
    }

    try {
        await productService.addProduct(product);
        return res.send(product);
    } catch (e) {
        return res.status(500).send('Could not add product');
    }
}

productRouter.get('/', getProducts);
productRouter.get('/:sku', getProductBySku);
productRouter.post('/', addProduct);