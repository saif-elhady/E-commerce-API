import jwt from 'jsonwebtoken';
import express, { NextFunction } from "express";
import User, { IUser } from '../models/user';
require('dotenv').config;

function checkAuth(req: express.Request, res: express.Response, next: NextFunction) {
    const jwtSecret = process.env.JWT_SECRET ?? " ";
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader?.split(' ')[1];

    if (token === undefined)
        return res.status(401);

    jwt.verify(token, jwtSecret, async(err, userId) => {
        console.log(err);
        if (err) return res.status(403);
        const user = await User.findById(userId);
        if (user !== null)
            req.user = user;
        next();
    })
}

export default checkAuth;