import mongoose, { Document, Schema } from "mongoose";


export interface ICategory extends Document {
    Name: string;
    Description: string;
}

const categorySchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    }
})

const Category = mongoose.model('category', categorySchema);
export default Category;