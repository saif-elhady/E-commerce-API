"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const user_1 = __importDefault(require("./routes/user"));
const category_1 = __importDefault(require("./routes/category"));
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
app.use('/api', category_1.default); // Use the category router with a base path of /api/categories
app.use('/', user_1.default);
