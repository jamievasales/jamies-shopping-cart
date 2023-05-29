export type PromotionType = 'buyNForM' | 'buyXGetYFree' | 'buyXForPriceOfY' | 'buyMoreThanXForYDiscount';

export type DiscountType = 'percentage' | 'fixed';

export interface IPromotion {
    sku: string;
    type: PromotionType;
    ruleId: number;
}

export interface PromotionRule {
    sku: string;
    type: PromotionType
}

export interface BuyNForMPromotion extends PromotionRule {
    n: number;
    m: number;
}

export interface BuyXGetYFreePromotion extends PromotionRule {
    freeItemSku: string;
    qty: number;
}

export interface BuyXForPriceOfYPromotion extends PromotionRule {
    x: number;
    y: number;
}

export interface BuyMoreThanXForYDiscountPromotion extends PromotionRule {
    qty: number;
    discountType: DiscountType;
    discount: number;
}