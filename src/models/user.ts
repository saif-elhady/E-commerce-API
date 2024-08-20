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
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    Password: {
        type: String,
        required: true
    }
})

const User = mongoose.model('user', userSchema);
export default User;