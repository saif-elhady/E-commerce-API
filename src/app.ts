import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import router from './routes/user';
require('dotenv').config();

const app = express();

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

app.use('/', router);