import {IProductDto} from "./model";
import {db} from "../../index";
import {ProductRepository} from "./ProductRepository";

export class ProductService {
    private productRepository: ProductRepository = new ProductRepository();

    async getProductBySku(sku: string): Promise<IProductDto> {
        try {
            return await db('products')
                .select('*', 'inventory_quantity as inventoryQty')
                .where({sku})
                .first();

        } catch (error) {
            throw error;
        }
    }

    async getProducts(): Promise<IProductDto[]> {
        try {
            const products: IProductDto[] = await this.productRepository.getProducts();
            return products.map((product: IProductDto) => {
                return {
                    sku: product.sku,
                    name: product.name,
                    price: product.price,
                    inventoryQty: product.inventoryQty,
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async addProduct(product: IProductDto): Promise<void> {
        try {
            await this.productRepository.addProduct(product);
        } catch (error) {
            throw error;
        }
    }

    async deleteProductBySku(sku: string) {
        try {
            await this.productRepository.deleteProductBySku(sku);
        } catch (error) {
            console.error(error);
        }
    }
}