import mongoose, { Schema } from "mongoose";

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