import { Router } from "express"
import * as userController from '../controller/user.controller.js'
import { validateToken } from '../middleware/validateToken.js'
import { authorizeAdmin } from '../middleware/authorizeAdmin.js'
import { handleLoginErrors } from '../middleware/handleLoginErrors.js'

const userRouter = Router()

userRouter.get('/', validateToken, authorizeAdmin, userController.getAllUsers)
userRouter.get('/:username', validateToken, authorizeAdmin, userController.getUserByUsername)

userRouter.put('/password/:username', validateToken, userController.updatePassword)
userRouter.put('/email/:username', validateToken, userController.updateEmail)
userRouter.put('/username/:username', validateToken, userController.updateUsername)
userRouter.put('/name/:username', validateToken, userController.updateName)

userRouter.post('/login', handleLoginErrors, userController.login)
userRouter.post('/register', userController.register)
userRouter.post('/ban/:username', validateToken, authorizeAdmin, userController.banUser)
userRouter.post('/unban/:username', validateToken, authorizeAdmin, userController.unbanUser)

export default userRouter