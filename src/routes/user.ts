import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { check, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/user';
require('dotenv').config;

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET ?? 'default_secret';

router.post('/signup', check('Email', 'Email is not valid').isEmail(),
    check('Password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/\d/).withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must be at least 8 characters long and contain at least one number and one special character'),
    check('Name', 'Name is required').exists()
    
    ,async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const formattedErrors = errors.array().map(error => ({
                message: error.msg
            }))
            return res.status(422).json({
                success: false,
                message: "Validation errors occurred",
                errors: formattedErrors
            });
        }

    const { Email, Password, Name } = req.body;
    if (!Email || !Password || !Name) {
        return res.status(400).json({ message: 'Pleas Provide all required fields' });
        }

    try {
        const exisitingUser = await User.findOne({ Email });
        if (exisitingUser) {
            return res.status(400).json({ message: "this Email already exisits" });
        }

        const hashedPassword = await bcrypt.hash(Password, 15);

        const newUser = new User({
            Name: Name,
            Email: Email,
            Password: hashedPassword
        });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    }
    catch  (error){
        res.status(500).json({ message: 'Server error', error });
    }
    })

router.post('/login', async (req, res) => {
    const { Email, Password } = req.body;
    if (!Email || !Password) {
        return res.status(400).json({ message: 'Pleas Provide all required fields' });
    }
    
    try {
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(400).json({ message: 'Invaild Email or password' });
        }
        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invaild Email or password' });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '15m' });

        res.status(200).json({ token, user: { id: user._id, email: user.Email, name: user.Name } });
    }
    catch(error) {
        res.status(500).json({ message: 'Server error', error });
    }
})

router.delete('/:userId', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(201).json({ message: 'user deleted successfully' });
    }
    catch (error){
        res.status(500).json({ message: 'Server error', error });
    }
})

export default router;