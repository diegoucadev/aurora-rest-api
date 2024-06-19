import mongoose from "mongoose"
import bookSchema from "./book.model.js"

const postSchema = mongoose.Schema({
    datePublished: String, 
    publishedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    book: {
        type: bookSchema,
        required: true
    },
    transactionType: {
        type: String,
        required: true
    },
    image: {
        publicId: String,
        url: String
    }

})


export default mongoose.model('Post', postSchema)