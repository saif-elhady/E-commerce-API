import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document {
    UserID: mongoose.Schema.Types.ObjectId;
    ProductIDs: mongoose.Schema.Types.ObjectId[];
    orderDate: Date;
    TotalPrice: number;
}

const orderSchema = new Schema({
    UserID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    ProductIDs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }],
    orderDate: {
        type: Date,
        default: Date.now
    },
    TotalPrice: {
        type: Number,
        required: true
    }
})
const Order = mongoose.model("Order", orderSchema);

export default Order;