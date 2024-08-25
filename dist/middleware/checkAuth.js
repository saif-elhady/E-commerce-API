"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
require('dotenv').config;
function checkAuth(req, res, next) {
    const jwtSecret = process.env.JWT_SECRET ?? " ";
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader?.split(' ')[1];
    if (token === undefined)
        return res.status(401);
    jsonwebtoken_1.default.verify(token, jwtSecret, async (err, userId) => {
        console.log(err);
        if (err)
            return res.status(403);
        const user = await user_1.default.findById(userId);
        if (user !== null)
            req.user = user;
        next();
    });
}
exports.default = checkAuth;
