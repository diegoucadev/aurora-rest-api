import Post from '../model/post.model.js'
import { uploadImage } from '../util/cloudinary.js'

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export async function newPost(req, res) {
    const { _id } = req.payload

    const bookDetails = {
        title: req.body.title,
        author: req.body.author,
        condition: req.body.condition,
        synopsis: req.body.synopsis,
        genre: req.body.genre,
        yearPublished: req.body.yearPublished,
        pages: req.body.pages,
        isbn: req.body.isbn,
        publisher: req.body.publisher,
        language: req.body.language,
        price: req.body.price
    }

    const post = new Post({
        datePublished: req.body.datePublished,
        publishedBy: _id,
        book: bookDetails
    })

    if (req.files?.image) {
        const upload = await uploadImage(req.files.image.tempFilePath)
        post.image = {
            publicId: upload.public_id,
            url: upload.secure_url
        }
    }

    const saved = await post.save()
    res.json(saved)
}