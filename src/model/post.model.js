import mongoose from "mongoose"
import User from './user.model.js'


const postSchema = mongoose.Schema({
    datePublished: Date, 
    publishedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

})

export default mongoose.model('Post', postSchema)