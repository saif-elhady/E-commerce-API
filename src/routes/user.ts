import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { check, validationResult } from 'express-validator';
import User from '../models/user';

const router = express.Router();

router.post('/signup', check('Email', 'Email is not valid').isEmail(),
check('Password')
.isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
.matches(/\d/).withMessage('Password must contain at least one number')
.matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must be at least 8 characters long and contain at least one number and one special character'),
    check('Name', 'Name is required').not().isEmpty()
    
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

export default router;