import mongoose from "mongoose"

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    
    author: {
        type: String,
        required: true
    },
    condition: {
        type: String,
        required: true
    },
    synopsis: String,
    genre: String,
    yearPublished: String,
    pages: Number,
    isbn: String,
    publisher: String,
    language: String,
    price: Number
})

export default mongoose.model('Book', bookSchema)