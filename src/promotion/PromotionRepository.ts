import {
    BuyMoreThanXForYDiscountPromotion,
    BuyNForMPromotion,
    BuyXForPriceOfYPromotion, BuyXGetYFreePromotion,
    PromotionRule
} from "./model";
import {db} from "../../index";

export class PromotionRepository {
    async getPromotions(): Promise<PromotionRule[]> {
        return db.select('*').from('promotionrules');
    }

    async getPromotion(sku: string): Promise<PromotionRule> {
        let basePromotion: PromotionRule = await db.select('*').from('promotionrules').where({sku}).first() as PromotionRule
        if (!basePromotion) {
            throw new Error('Promotion not found');
        }
        switch (basePromotion.type) {
            case 'buyNForM':
                const buyNForM = await db.select('*').from('buynformpromotions').where({sku}).first();
                return {...buyNForM, ...basePromotion} as BuyNForMPromotion;
            case 'buyXForPriceOfY':
                const buyXForPriceOfY = await db.select('*').from('buyxforpriceofypromotions').where({sku}).first();
                return {...buyXForPriceOfY, ...basePromotion} as BuyXForPriceOfYPromotion;
            case 'buyMoreThanXForYDiscount':
                const buyMoreThanXForYDiscount = await db.select('*', 'discounttype as discountType').from('buymorethanxforydiscountpromotions').where({sku}).first();
                return {...buyMoreThanXForYDiscount, ...basePromotion} as BuyMoreThanXForYDiscountPromotion;
            case 'buyXGetYFree':
                const buyXGetYFree = await db.select('*', 'freeitemsku as freeItemSku').from('buyxgetyfreepromotions').where({sku}).first();
                return {...buyXGetYFree, ...basePromotion} as BuyXGetYFreePromotion;
            default:
                console.log(`Invalid promotion type ${basePromotion.type}`);
                throw new Error('Invalid promotion type');
        }
    }

    async addPromotion(promotion: PromotionRule): Promise<void> {
        const {sku, type} = promotion;
        const updated_at = new Date()
        await this.deleteExistingPromotionWithDifType(sku, type);

        await db.insert({sku, type, updated_at}).onConflict('sku').merge().into('promotionrules');
        switch (type) {
            case 'buyNForM':
                const buyNForM = promotion as BuyNForMPromotion;
                await db.insert({...buyNForM, sku}).onConflict('sku').merge().into('buynformpromotions');
                break;
            case 'buyXForPriceOfY':
                const buyXForPriceOfY = promotion as BuyXForPriceOfYPromotion;
                await db.insert({...buyXForPriceOfY, sku}).onConflict('sku').merge().into('buyxforpriceofypromotions');
                break;
            case "buyMoreThanXForYDiscount":
                const buyMoreThanXForYDiscount = promotion as BuyMoreThanXForYDiscountPromotion;
                await db.insert({
                    qty: buyMoreThanXForYDiscount.qty,
                    discount: buyMoreThanXForYDiscount.discount,
                    discounttype: buyMoreThanXForYDiscount.discountType,
                    sku
                })
                    .onConflict('sku').merge().into('buymorethanxforydiscountpromotions');
                break;
            case "buyXGetYFree":
                const buyXGetYFree = promotion as BuyXGetYFreePromotion;
                await db.insert({
                    freeitemsku: buyXGetYFree.freeItemSku,
                    sku,
                    qty: buyXGetYFree.qty
                })
                    .onConflict('sku').merge().into('buyxgetyfreepromotions');
                break;
            default:
                throw new Error('Invalid promotion type');

        }
    }

    private async deleteExistingPromotionWithDifType(sku: string, type: string) {
        const oldPromotion = await db.select('*').from('promotionrules').where({sku}).first();
        if (oldPromotion && oldPromotion.type !== type) {
            await db.delete().from('promotionrules').where({sku});
        }
    }
}