import mongoose from "mongoose"
import bookSchema from "./book.model.js"
//import paginate from 'mongoose-paginate-v2'

const postSchema = new mongoose.Schema({
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

//postSchema.plugin(paginate)
export default mongoose.model('Post', postSchema)