"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_1 = __importDefault(require("../models/order"));
const apiFeatures_1 = require("../utils/apiFeatures");
const checkAuth_1 = __importDefault(require("../middleware/checkAuth"));
const orderRouter = express_1.default.Router();
orderRouter.get('/', async (req, res) => {
    const features = new apiFeatures_1.apiFeatures(order_1.default.find(), req.query)
        .paginate()
        .sort()
        .filter();
    try {
        const allOrders = await features.query;
        if (!allOrders)
            return res.status(404).json({ message: 'orders not found' });
        res.status(200).json(allOrders);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
orderRouter.get('/:orderId', async (req, res) => {
    try {
        const orderById = await order_1.default.findById(req.params.orderId);
        if (!orderById)
            return res.status(404).json({ message: 'order not found' });
        res.status(200).json(orderById);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
orderRouter.post('/create', checkAuth_1.default, async (req, res) => {
    try {
        const newOrder = new order_1.default({
            UserID: req.body.UserID,
            ProductIDs: req.body.ProductIDs,
            orderDate: req.body.orderDate,
            TotalPrice: req.body.TotalPrice
        });
        await newOrder.save();
        res.status(201).json({ message: 'order added successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
orderRouter.patch('/:orderId', checkAuth_1.default, async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const updateData = req.body;
        const updatedOrder = await order_1.default.findByIdAndUpdate(orderId, updateData, { new: true });
        if (!updatedOrder)
            return res.status(404).json({ message: 'order not found' });
        res.status(201).json({ message: 'order updated successfully', updatedOrder });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
orderRouter.delete('/:orderId', checkAuth_1.default, async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const deleteOrder = await order_1.default.findByIdAndDelete(orderId);
        if (!deleteOrder)
            return res.status(404).json({ message: 'order not found' });
        res.status(201).json({ message: 'order deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.default = orderRouter;
