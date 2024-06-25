import { uploadImage, deleteImage } from '../util/cloudinary.js'
import { createPostData, updatePostData } from '../helpers/postHelpers.js'
import Post from '../model/post.model.js'
import fs from 'fs-extra'

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
            await fs.unlink(req.files.image.tempFilePath)
        }
        const savedPost = await post.save()
        res.json({ success: 'Post creado exitosamente', post: savedPost })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

export async function getAllPosts(req, res) {
    try {
        const allPosts = await Post.find()
        res.status(200).json(allPosts)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

export async function getAllUserPosts(req, res) {
    const { _id } = req.payload
    try {
        const userPosts = await Post.find({ publishedBy: _id })
        res.status(200).json(userPosts)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

export async function updatePost(req, res) {
    const { postId } = req.params
    const { _id } = req.payload

    try {
        const post = await Post.findOne({ _id: postId, publishedBy: _id })
        if (!post) {
            res.status(400).json({ error: 'Post no encontrado o no autorizado para editar' })
        }
        updatePostData(post, req.body)
        if (req.files?.image) {
            await deleteImage(post.image.publicId)
            const upload = await uploadImage(req.files.image.tempFilePath)
            post.image = {
                publicId: upload.publicId,
                url: upload.secure_url
            }
            fs.unlink(req.files.image.tempFilePath)
        }
        const updatedPost = await post.save()
        res.status(200).json({ success: updatedPost })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

export async function deletePost(req, res) {
    const { postId } = req.params
    try {
        const deletedPost = await Post.findOneAndDelete({ _id: postId }, { new: true })
        await deleteImage(deletedPost.image.publicId)
        res.status(200).json({ success: 'Post borrado correctamente', post: deletedPost })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}