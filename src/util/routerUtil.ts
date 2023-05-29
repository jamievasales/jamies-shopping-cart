import {NextFunction, Request, Response} from "express";
import {generateNewId} from "./generalUtil";

export const idInjectorMiddleware = (req: Request, res: Response, next: NextFunction) => (label?: string) => {
    if (label) {
        req.body[label].id = generateNewId();
    } else {
        req.body.id = generateNewId();
    }

    next();
}