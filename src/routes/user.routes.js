import { Router } from "express"
import * as userController from '../controller/user.controller.js'
import { validateToken } from "../middleware/validateToken.js"


const userRouter = Router()

userRouter.post('/login', userController.login)
userRouter.get('/login', validateToken, userController.test)

export default userRouter