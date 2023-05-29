import typia from "typia";
import {
    BuyMoreThanXForYDiscountPromotion,
    BuyNForMPromotion,
    BuyXForPriceOfYPromotion,
    BuyXGetYFreePromotion,
    PromotionRule,
    PromotionType
} from "../promotion/model";

export const validatePromotion = (promotion: PromotionRule) => {
    const {type} = promotion;
    try {
        if (type === "buyXForPriceOfY") {
            typia.assertEquals<BuyXForPriceOfYPromotion>(promotion);
        }

        if (type === "buyMoreThanXForYDiscount") {
            typia.assertEquals<BuyMoreThanXForYDiscountPromotion>(promotion);
        }

        if (type === "buyNForM") {
            typia.assertEquals<BuyNForMPromotion>(promotion);
        }

        if (type === "buyXGetYFree") {
            typia.assertEquals<BuyXGetYFreePromotion>(promotion);
        }

        typia.assertEquals<PromotionType>(type)
    } catch (e) {
        console.log(e)
        throw `Invalid promotion ${promotion.type}. Please check the inputs and promotion`
    }
}