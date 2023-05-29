import express, {NextFunction, Request, Response, Router} from 'express';
import {IPromotion, PromotionRule} from "./model";
import {validatePromotion} from "../util/validationUtil";
import {PromotionService} from "./PromotionService";

export const promotionRouter: Router = express.Router();
const promotionService: PromotionService = new PromotionService();

const promotionValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const promotion: PromotionRule = req.body;
        validatePromotion(promotion);
    } catch (e) {
        res.status(400);
        return res.send(e)
    }

    next();
}

const getPromotions = async (req: Request, res: Response): Promise<Response> => {
    try {
        const promotions = await promotionService.getPromotions();
        return res.send(promotions);
    } catch (e) {
        return res.status(500).send('Could not get promotions')
    }
}

const addPromotion = async (req: Request, res: Response): Promise<Response> => {
    try {
        await promotionService.addPromotion(req.body as PromotionRule);
        return res.send(req.body)
    } catch (e) {
        res.status(500);
        return res.send('Could not add promotion')
    }
}

const getPromotion = async (req: Request, res: Response): Promise<Response<IPromotion>> => {
    try {
        return res.send(await promotionService.getPromotion(req.params.sku));
    } catch (e) {
        res.status(500);
        return res.send('Could not get promotion')
    }
}

promotionRouter.get('/', getPromotions);
promotionRouter.post('/',
    promotionValidationMiddleware, addPromotion);
promotionRouter.get('/:sku', getPromotion);