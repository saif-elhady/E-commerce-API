"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_1 = __importDefault(require("../models/product"));
const apiFeatures_1 = require("../utils/apiFeatures");
const checkAuth_1 = __importDefault(require("../middleware/checkAuth"));
const multer_1 = __importDefault(require("multer"));
const productRouter = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
productRouter.get('/', async (req, res) => {
    const features = new apiFeatures_1.apiFeatures(product_1.default.find(), req.query)
        .paginate()
        .sort()
        .filter();
    try {
        const allProducts = await features.query;
        if (!allProducts) {
            return res.status(404).json({ message: 'Products not found' });
        }
        res.status(200).json(allProducts);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
productRouter.get('/:productId', async (req, res) => {
    try {
        const productByID = await product_1.default.findById(req.params.productId);
        if (!productByID) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(productByID);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
productRouter.post('/create', checkAuth_1.default, upload.array('images', 5), async (req, res) => {
    if (!Array.isArray(req.files))
        return res.status(500);
    try {
        const images = req.files.map((file) => ({
            filename: Date.now() + file.originalname,
            contentType: file.mimetype,
            imageBase64: file.buffer.toString('base64')
        }));
        const product = new product_1.default({
            Name: req.body.name,
            Description: req.body.description,
            Price: req.body.price,
            stockQuantity: req.body.stockQuantity,
            CategoryID: req.body.categoryID,
            images: images
        });
        await product.save();
        res.status(201).json({ message: 'product successfully added', productID: product._id });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
productRouter.patch('/:productId', checkAuth_1.default, async (req, res) => {
    try {
        const productID = req.params.productId;
        const updateData = req.body;
        const updatedProduct = await product_1.default.findByIdAndUpdate(productID, updateData, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(201).json({ message: 'product updated successfully', product: updatedProduct });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
productRouter.delete('/:productId', checkAuth_1.default, async (req, res) => {
    try {
        const productID = req.params.productId;
        const deletedProduct = await product_1.default.findByIdAndDelete(productID);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(201).json({ message: 'product deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.default = productRouter;
