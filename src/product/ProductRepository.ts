import {db} from "../../index";
import {IProductDto} from "./model";

export class ProductRepository {
    async getProducts(): Promise<IProductDto[]> {
        return db('products').select('*', 'inventory_qty as inventoryQty')
    }

    async addProduct(product: IProductDto) {
        return db('products').insert({
            sku: product.sku,
            name: product.name,
            price: product.price,
            inventory_qty: product.inventoryQty,
        });
    }

    async deleteProductBySku(sku: string) {
        return db('products').where({sku}).del();
    }
}