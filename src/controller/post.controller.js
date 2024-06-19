import { uploadImage } from '../util/cloudinary.js'
import { createPostData } from '../helpers/postHelpers.js'
import Post from '../model/post.model.js'


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
    } catch (err) {
        res.status(400).json(err.message)
    }
}

export async function deletePost(req, res) {
    const { postId } = req.params
    try {
        const deletedPost = await Post.findOneAndDelete({ _id: postId })
        res.status(200).json({ "OK": "Post deleted", "post": deletedPost })
    } catch (err) {
        res.status(400).json(err.message)
    }
}