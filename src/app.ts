import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import categoryRouter from './routes/category';
import productRouter from './routes/product';
import orderRouter from './routes/order';
import userRouter from './routes/user';
import { IUser } from './models/user';

require('dotenv').config();

const app = express();

declare module 'express' {
    export interface Request {
        user?: IUser
    }
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const dbURI = process.env.MONGODB || '';
const PORT = process.env.PORT;

mongoose.connect(dbURI)
    .then(() => {
        app.listen(PORT || 3000);
        console.log('connected to database');
    })
    .catch((err: Error) => {
        console.log(err);
})
app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/users', userRouter);