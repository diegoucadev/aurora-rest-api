import { Router } from "express"
import { validateToken } from '../middleware/validateToken.js'
import * as postController from '../controller/post.controller.js'

const postRouter = Router()

postRouter.post('/create-post', validateToken, postController.newPost)

postRouter.delete('/delete/:postId', validateToken, postController.deletePost)

export default postRouter