"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
require('dotenv').config();
const app = (0, express_1.default)();
const dbURI = process.env.MONGODB || '';
const PORT = process.env.PORT;
mongoose_1.default.connect(dbURI)
    .then(() => {
    app.listen(PORT || 3000);
    console.log('connected to database');
})
    .catch((err) => {
    console.log(err);
});
