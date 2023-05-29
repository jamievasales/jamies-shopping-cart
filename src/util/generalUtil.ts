import {nanoid} from "nanoid";

export function generateNewId(length = 10): string {
    return nanoid(length);
}