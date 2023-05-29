import {PromotionRepository} from "./PromotionRepository";
import {PromotionRule} from "./model";

export class PromotionService {
    private promotionRepository: PromotionRepository = new PromotionRepository();
    constructor() {
    }
    async getPromotions() {
        return await this.promotionRepository.getPromotions()
    }

    async getPromotion(sku: string): Promise<PromotionRule | undefined> {
        try {
            return await this.promotionRepository.getPromotion(sku)
        } catch (e) {
            return undefined;
        }
    }

    async addPromotion(body: PromotionRule) {
        return await this.promotionRepository.addPromotion(body)
    }
}