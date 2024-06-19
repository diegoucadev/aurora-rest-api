import { uploadImage } from '../util/cloudinary.js'
import { createPostData } from '../helpers/postHelpers.js'

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export async function newPost(req, res) {
    const { _id } = req.payload

    const post = createPostData(_id, req.body)

    try {
        if (req.files?.image) {
            const upload = await uploadImage(req.files.image.tempFilePath)
            post.image = {
                publicId: upload.public_id,
                url: upload.secure_url
            }
        }
        const savedPost = await post.save()
        res.json({ "OK": "Post saved", "post": savedPost })
    } catch(err) {
        res.status(400).json(err.message)
    }
}