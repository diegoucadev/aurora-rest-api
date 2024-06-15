import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    rating: Number,
    isActive: Boolean,
    isAdmin: Boolean
})

export default mongoose.model('User', userSchema)