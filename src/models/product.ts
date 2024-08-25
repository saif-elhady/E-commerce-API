import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document{
    Name: string;
    Description: string;
    Price: number;
    stockQuantity: number;
    CategoryID: mongoose.Schema.Types.ObjectId;
    images: {
        filename: string,
        contentType: string,
        imageBase64: string
    }[];
}
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
    images: [{
        filename: { type: String, required: true },
        contentType: { type: String, required: true },
        imageBase64: { type: String, required: true }
    }]
})

const Product = mongoose.model('pouduct', productSchema);
export default Product;