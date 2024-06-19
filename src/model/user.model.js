import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    contact: {
        phoneNumber: String,
        whatsapp: String,
        facebook: String,
        instagram: String,
        twitter: String
    },
    rating: Number,
    isActive: Boolean,
    isAdmin: Boolean
})

export default mongoose.model('User', userSchema)