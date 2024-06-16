import { Router } from "express"
import * as userController from '../controller/user.controller.js'
import { validateToken } from '../middleware/validateToken.js'
import { authorizeAdmin } from '../middleware/authorizeAdmin.js'
import { handleLoginErrors } from '../middleware/handleLoginErrors.js'

const userRouter = Router()

userRouter.post('/login', handleLoginErrors, userController.login)
userRouter.post('/register', userController.register)

userRouter.get('/users', validateToken, authorizeAdmin, userController.getAllUsers)

export default userRouter