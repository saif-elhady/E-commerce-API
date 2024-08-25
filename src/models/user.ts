import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    Name: string;
    Email: string;
    Password: string;
}

const userSchema = new Schema <IUser>({
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

const User = mongoose.model<IUser>('user', userSchema);
export default User;