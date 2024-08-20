import express from 'express';
import mongoose from 'mongoose';
require('dotenv').config();

const app = express();

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

