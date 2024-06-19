import { Router } from "express"
import { validateToken } from '../middleware/validateToken.js'
import * as postController from '../controller/post.controller.js'

const postRouter = Router()

postRouter.post('/', validateToken, postController.newPost)

export default postRouter