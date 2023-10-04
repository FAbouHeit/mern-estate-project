import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type : String,
        required: true,
        unique: true,
    },
    email: {
        type : String,
        required: true,
        unique: true,
    },
    password: {
        type : String,
        required: true
    },
    avatar: {
        type: String,
        default: "https://icon-library.com/images/profile-picture-icon/profile-picture-icon-0.jpg"
    },
}, { timestamps: true }); //records the time of creation and updation of user

const User = mongoose.model('User', userSchema);

export default User;