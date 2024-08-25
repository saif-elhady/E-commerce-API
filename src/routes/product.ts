import express, { Router,Request,Response } from 'express';
import Product from '../models/product';
import { apiFeatures } from "../utils/apiFeatures";
import checkAuth from '../middleware/checkAuth';
import multer from 'multer';

const productRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

productRouter.get('/', async (req, res) => {
    const features = new apiFeatures(Product.find(), req.query)
    .paginate()
    .sort()
    .filter()
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
})

productRouter.get('/:productId', async (req, res) => {
    try {
        const productByID = await Product.findById(req.params.productId);
        if (!productByID) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(productByID);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
    
})

productRouter.post('/create', checkAuth ,upload.array('images', 5), async (req, res) => {
    if (!Array.isArray(req.files))
        return res.status(500);
    try {
        const images = req.files.map((file: Express.Multer.File) => ({
            filename: Date.now() + file.originalname,
            contentType: file.mimetype,
            imageBase64: file.buffer.toString('base64')
        }))
        const product = new Product({
            Name: req.body.name,
            Description:req.body.description,
            Price: req.body.price,
            stockQuantity: req.body.stockQuantity,
            CategoryID: req.body.categoryID,
            images: images
        })
        await product.save();
        res.status(201).json({message: 'product successfully added',productID: product._id})
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
})

productRouter.patch('/:productId', checkAuth ,async (req, res) => {
    try {
        const productID = req.params.productId;
        const updateData = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(productID, updateData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(201).json({ message: 'product updated successfully', product: updatedProduct });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
})

productRouter.delete('/:productId', checkAuth ,async (req, res) => {
    try {
        const productID = req.params.productId;
        const deletedProduct = await Product.findByIdAndDelete(productID);
        
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(201).json({ message: 'product deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
})
export default productRouter;