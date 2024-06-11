import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    userName: String,
    password: String,
    email: String,
    rating: Number,
    isActive: Boolean
})

export default mongoose.model('User', userSchema)