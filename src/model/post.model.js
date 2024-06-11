import mongoose from "mongoose"
import User from './user.model.js'


const postSchema = mongoose.Schema({
    title: String,
    datePublished: Date, 
    publishedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    //Agrega el libro aqui porfa

})

export default mongoose.model('Post', postSchema)