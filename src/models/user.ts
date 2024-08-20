import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String, 
        required: true, 
        unique: true,
    },
    Password: {
        type: String,
        required: true
    }
})

const User = mongoose.model('user', userSchema);
export default User;