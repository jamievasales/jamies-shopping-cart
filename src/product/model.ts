interface BaseIProduct {
    sku: string;
    name: string;
    price: number;
}
export interface IProduct extends BaseIProduct {
    inventory_quantity: number;
}

export interface ICartProduct extends BaseIProduct {
    qty: number;
    discount: number;
    total: number;
    promotionApplied?: string;
}

export interface IProductDto extends BaseIProduct {
    inventoryQty: number;
}