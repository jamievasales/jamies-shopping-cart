import express, {Application} from 'express';
import {promotionRouter} from "./src/promotion/promotionRouter";
import {cartRouter} from "./src/cart/cartRouter";
import knex from 'knex';
import {knexfile} from "./knexfile";
import {productRouter} from "./src/product/productRouter";

export const db = knex(knexfile);
const app: Application = express();
app.use(express.json());

app.listen(8080, () => {
    console.log('Server is running on port 8080');
})

app.use('/api/promotions', promotionRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);