import { Router } from "express"
import * as userController from '../controller/user.controller.js'
import { validateToken } from '../middleware/validateToken.js'
import { authorizeAdmin } from '../middleware/authorizeAdmin.js'
import { handleLoginErrors } from '../middleware/handleLoginErrors.js'
import { handleRegisterErrors } from "../middleware/handleRegisterErrors.js"

const userRouter = Router()

userRouter.get('/', validateToken, authorizeAdmin, userController.getAllUsers)
userRouter.get('/:username', validateToken, authorizeAdmin, userController.getUserByUsername)

userRouter.put('/password', validateToken, userController.updatePassword)
userRouter.put('/email', validateToken, userController.updateEmail)
userRouter.put('/username', validateToken, userController.updateUsername)
userRouter.put('/name', validateToken, userController.updateName)
userRouter.put('/phone-number', validateToken, userController.updatePhoneNumber)
userRouter.put('/whatsapp', validateToken, userController.updateWhatsappProfileLink)
userRouter.put('/facebook', validateToken, userController.updateFacebookProfileLink)
userRouter.put('/twitter', validateToken, userController.updateTwitterProfileLink)


userRouter.post('/login', handleLoginErrors, userController.login)
userRouter.post('/register', handleRegisterErrors, userController.register)
userRouter.post('/ban/:username', validateToken, authorizeAdmin, userController.banUser)
userRouter.post('/unban/:username', validateToken, authorizeAdmin, userController.unbanUser)
userRouter.delete('/delete/:username', validateToken, userController.deleteUser)

export default userRouter