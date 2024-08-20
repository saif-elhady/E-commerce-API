"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
require('dotenv').config;
const router = express_1.default.Router();
const JWT_SECRET = process.env.JWT_SECRET ?? 'default_secret';
router.post('/signup', (0, express_validator_1.check)('Email', 'Email is not valid').isEmail(), (0, express_validator_1.check)('Password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must be at least 8 characters long and contain at least one number and one special character'), (0, express_validator_1.check)('Name', 'Name is required').exists(), async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(error => ({
            message: error.msg
        }));
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
        const exisitingUser = await user_1.default.findOne({ Email });
        if (exisitingUser) {
            return res.status(400).json({ message: "this Email already exisits" });
        }
        const hashedPassword = await bcrypt_1.default.hash(Password, 15);
        const newUser = new user_1.default({
            Name: Name,
            Email: Email,
            Password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.post('/login', async (req, res) => {
    const { Email, Password } = req.body;
    if (!Email || !Password) {
        return res.status(400).json({ message: 'Pleas Provide all required fields' });
    }
    try {
        const user = await user_1.default.findOne({ Email });
        if (!user) {
            return res.status(400).json({ message: 'Invaild Email or password' });
        }
        const isMatch = await bcrypt_1.default.compare(Password, user.Password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invaild Email or password' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '15m' });
        res.status(200).json({ token, user: { id: user._id, email: user.Email, name: user.Name } });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.delete('/:userId', async (req, res) => {
    try {
        await user_1.default.findByIdAndDelete(req.params.userId);
        res.status(201).json({ message: 'user deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.default = router;
