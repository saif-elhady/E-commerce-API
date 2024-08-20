import mongoose, { Schema } from "mongoose";
const productSchema = new Schema({
    Name: {
        type: String,
        required: true,
    },
    Description: {
        type: String,
        required: true,
    },
    Price: {
        type: Number,
        required: true,
    },
    stockQuantity: {
        type: Number,
        required: true,
    },
    CategoryID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    images: {
        type: [String],
    }
})

const Product = mongoose.model('pouduct', productSchema);
export default Product;