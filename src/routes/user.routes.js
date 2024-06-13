import { Router } from "express"
import * as userController from '../controller/user.controller.js'
import { validateToken } from "../middleware/validateToken.js"


const userRouter = Router()

userRouter.post('/login', userController.login)
userRouter.post('/register', userController.register)

export default userRouter