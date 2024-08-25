import express from 'express';
import Order from '../models/order';
import { apiFeatures } from "../utils/apiFeatures";

const orderRouter = express.Router();

orderRouter.get('/', async (req, res) => {
    const features = new apiFeatures(Order.find(), req.query)
    .paginate()
    .sort()
    .filter()
    try {
        const allOrders = await features.query;
        if (!allOrders)
            return res.status(404).json({ message: 'orders not found' });

        res.status(200).json(allOrders);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
})

orderRouter.get('/:orderId', async (req, res) => {
    try {
        const orderById = await Order.findById(req.params.orderId);
        if (!orderById)
            return res.status(404).json({ message: 'order not found' });

        res.status(200).json(orderById);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
})

orderRouter.post('/create', async(req, res) => {
    try {
        const newOrder = new Order({
            UserID: req.body.UserID,
            ProductIDs: req.body.ProductIDs,
            orderDate: req.body.orderDate,
            TotalPrice: req.body.TotalPrice
        })

        await newOrder.save();

        res.status(201).json({ message: 'order added successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
})

orderRouter.patch('/:orderId', async(req, res) => {
    try {
        const orderId = req.params.orderId;
        const updateData = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, { new: true });
        if (!updatedOrder)
            return res.status(404).json({ message: 'order not found' });

        res.status(201).json({ message:'order updated successfully', updatedOrder})
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
})

orderRouter.delete('/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const deleteOrder = await Order.findByIdAndDelete(orderId);

        if (!deleteOrder)
            return res.status(404).json({ message: 'order not found' });

        res.status(201).json({ message: 'order deleted successfully' })
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
})

export default orderRouter;