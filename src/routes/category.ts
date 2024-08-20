import express from "express";
import Category from "../models/category";

const categoryRouter = express.Router();

categoryRouter.get('/category', async (req, res) => {
    try {
        const allCategories = await Category.find();
        res.status(201).json(allCategories);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
})

categoryRouter.post('/category', async (req, res) => {
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

categoryRouter.patch('/category/:categoryId', async (req, res) => {
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

categoryRouter.delete('/category/:categoryId', async (req, res) => {
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