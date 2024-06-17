import mongoose from "mongoose"


const postSchema = mongoose.Schema({
    datePublished: String, 
    publishedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    //imageUrl: 

})

export default mongoose.model('Post', postSchema)