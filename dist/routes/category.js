"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_1 = __importDefault(require("../models/category"));
const apiFeatures_1 = require("../utils/apiFeatures");
const checkAuth_1 = __importDefault(require("../middleware/checkAuth"));
const categoryRouter = express_1.default.Router();
categoryRouter.get('/', async (req, res) => {
    const features = new apiFeatures_1.apiFeatures(category_1.default.find(), req.query)
        .paginate()
        .sort()
        .filter();
    try {
        const allCategories = await features.query;
        res.status(201).json(allCategories);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
categoryRouter.get('/:categoryId', async (req, res) => {
    const features = new apiFeatures_1.apiFeatures(category_1.default.find({ CategoryID: req.params.categoryId }), req.query)
        .paginate()
        .sort()
        .filter();
    try {
        const productsByCategory = await features.query;
        if (!productsByCategory) {
            return res.status(404).json({ message: 'Products not found' });
        }
        res.status(200).json(productsByCategory);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
categoryRouter.post('/', checkAuth_1.default, async (req, res) => {
    const { Name, Description } = req.body;
    if (!Name || !Description) {
        return res.status(400).json({ message: 'Name and Description are required' });
    }
    try {
        const newCategory = new category_1.default({
            Name: Name,
            Description: Description
        });
        await newCategory.save();
        res.status(201).json({ message: 'Category added successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});
categoryRouter.patch('/:categoryId', checkAuth_1.default, async (req, res) => {
    const { Name, Description } = req.body;
    try {
        const updatedCategory = await category_1.default.findByIdAndUpdate(req.params.categoryId, { Name, Description }, { new: true, runValidators: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category updated successfully', updatedCategory });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});
categoryRouter.delete('/:categoryId', checkAuth_1.default, async (req, res) => {
    try {
        const deletedCategory = await category_1.default.findByIdAndDelete(req.params.categoryId);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});
exports.default = categoryRouter;
