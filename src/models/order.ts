import mongoose, { Schema } from "mongoose";

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