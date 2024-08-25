"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const category_1 = __importDefault(require("./routes/category"));
const product_1 = __importDefault(require("./routes/product"));
const order_1 = __importDefault(require("./routes/order"));
const user_1 = __importDefault(require("./routes/user"));
require('dotenv').config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
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
app.use('/api/categories', category_1.default);
app.use('/api/products', product_1.default);
app.use('/api/orders', order_1.default);
app.use('/api/users', user_1.default);
