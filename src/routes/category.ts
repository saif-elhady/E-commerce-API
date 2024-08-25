import express from "express";
import Category from "../models/category";
import { apiFeatures } from "../utils/apiFeatures";
import checkAuth from "../middleware/checkAuth";

const categoryRouter = express.Router();

categoryRouter.get('/', async (req, res) => {
    const features = new apiFeatures(Category.find(), req.query)
        .paginate()
        .sort()
        .filter()
    try {
        const allCategories = await features.query;
        res.status(201).json(allCategories);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
})

categoryRouter.get('/:categoryId', async (req, res) => {
    const features = new apiFeatures(Category.find({ CategoryID: req.params.categoryId }), req.query)
    .paginate()
    .sort()
    .filter()
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
})

categoryRouter.post('/', checkAuth,async (req, res) => {
    const { Name, Description } = req.body;
    if (!Name || !Description) {
        return res.status(400).json({ message: 'Name and Description are required' });
    }
    try {
        const newCategory = new Category({
            Name: Name,
            Description: Description
        });
        await newCategory.save();
        res.status(201).json({ message: 'Category added successfully' });
    } catch (error) {return res.status(500).json({ message: 'Server error', error });
}
});

categoryRouter.patch('/:categoryId', checkAuth ,async (req, res) => {
const { Name, Description } = req.body;
try {
    const updatedCategory = await Category.findByIdAndUpdate(req.params.categoryId, { Name, Description }, { new: true, runValidators: true });
    if (!updatedCategory) {
        return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category updated successfully', updatedCategory });
} catch (error) {
    return res.status(500).json({ message: 'Server error', error });
}
});

categoryRouter.delete('/:categoryId', checkAuth, async(req, res) => {
try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.categoryId);
    if (!deletedCategory) {
        return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
} catch (error) {
    return res.status(500).json({ message: 'Server error', error });
}
});

export default categoryRouter;