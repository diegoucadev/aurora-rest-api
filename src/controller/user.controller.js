/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
import jwt from 'jsonwebtoken'
import User from '../model/user.model.js'
import bcrypt from 'bcrypt'
import { createTokenPayload, createUser } from '../helpers/userHelpers.js'
import { 
    EmailAlreadyTakenError, 
    InvalidCredentialsError, 
    InvalidUsername, 
    UserAlreadyBannedError, 
    UserNotFoundError, 
    userNotBannedError 
} from '../util/Errors.js'

    /*
    The user from req.body is the user from the database
    it contains a password, the password that is being
    extracted is the password entered by the user that will be
    validated, the user was set on the handleLoginErrors middleware
    */

export async function login(req, res) {
    const { user, password } = req.body
    try {
        const match = await bcrypt.compare(password, user.password)
        if (match) {
            const tokenPayload = createTokenPayload(user._id, user.username, user.email, user.isAdmin)
            const accessToken = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET)
            res.status(200).json({ accessToken: accessToken })
        } else {
            //If the password doesn't match, deny the access
            throw new InvalidCredentialsError("Usuario o contrasena invalidos")
        }
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

export async function register(req, res) {
    const { password } = req.body
    //Encrypt the password
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    //Create a user model to save in the database
    const user = createUser(req.body)
    user.password = hashedPassword
    try {
        const savedUser = await user.save()
        const tokenPayload = createTokenPayload(savedUser._id, savedUser.username, savedUser.email, savedUser.isAdmin)
        const accessToken = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET)
        res.status(200).json({ success: 'Usuario registrado Exitosamente', accessToken: accessToken })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

export async function getAllUsers(req, res) {
    try {
        const allUsers = await User.find()
        res.status(200).json(allUsers)
    } catch (err) {
        res.json(500).json({ error: err.message })
    }
}

export async function getUserByUsername(req, res) {
    try {
        const { username } = req.params
        const user = await User.findOne({ username })
        if (user == null) {
            throw new InvalidUsername("No se ha encontrado a un usuario con ese nombre")
        }
        res.status(200).json(user)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

export async function getUserWithToken(req, res) {
    try {
        const { username } = req.payload
        const user = await User.findOne({ username })
        if (!user) {
            throw new InvalidUsername("Usuario no encontrado")
        } 
        res.status(200).json({ success: user })
    } catch(err) {
        res.json(400).json({ error: err.message })
    }
}

export async function updatePassword(req, res) {
    const { username } = req.payload
    const { currentPassword, newPassword } = req.body
    try {
        const user = await User.findOne({ username })
        if (user == null) {
            throw new UserNotFoundError("Usuario no encontrado")
        }
        const match = bcrypt.compare(currentPassword, user.password)
        if (match) {
            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(newPassword, salt)
            await User.findOneAndUpdate({ username }, { password: hashedPassword })
            res.status(200).json({ success: 'Contraseña cambiada exitosamente' })
        } else {
            throw new InvalidCredentialsError("Las claves de acceso no coinciden")
        }
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

export async function updateUsername(req, res) {
    const { username } = req.payload
    const newUsername = req.body.newUsername
    try {
        //Check is the username is already in use
        const isUsernameTaken = await User.findOne({ username: newUsername })
        if (isUsernameTaken) {
            throw new InvalidUsername("El nombre de usuario esta tomado")
        }
        const updatedUser = await User.findOneAndUpdate({ username }, { username: newUsername }, { new: true })
        //Generate a new access token 
        const tokenPayload = createTokenPayload(updatedUser._id, updatedUser.username, updatedUser.email, updatedUser.isAdmin)
        const accessToken = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET);
        res.status(200).json({
            success: 'Username updated',
            accessToken: accessToken
        })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

export async function updateEmail(req, res) {
    const { username } = req.payload
    const { newEmail } = req.body
    try {
        //Check if the email is already in use
        const isEmailTaken = await User.findOne({ email: newEmail })
        if (isEmailTaken) {
            throw new EmailAlreadyTakenError("El email esta ocupado")
        }
        const updatedUser = await User.findOneAndUpdate({ username }, { email: newEmail }, { new: true })
        //Generate a new access token
        const tokenPayload = createTokenPayload(updatedUser._id, updatedUser.username, updatedUser.email, updatedUser.isAdmin)
        const accessToken = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET);
        res.status(200).json({
            success: 'Email updated',
            accessToken: accessToken
        })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

export async function updateName(req, res) {
    const { username } = req.payload
    const { newName } = req.body
    try {
        await User.findOneAndUpdate({ username }, { name: newName })
        res.status(200).json({ success: 'Nombre actualizado exitosamente' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export async function banUser(req, res) {
    const { username } = req.params
    try {
        const user = await User.find({ username })
        if (!user.isActive) {
            throw new UserAlreadyBannedError("El usuario ya esta baneado")
        }
        await User.findOneAndUpdate({ username }, { isActive: false })
        res.status(200).json({ success: 'Usuario Baneado Exitosamente' })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

export async function updatePhoneNumber(req, res) {
    const { username } = req.payload
    const { phoneNumber } = req.body
    try {
        const updatedUser = await User.findOneAndUpdate(
            { username },
            { $set: { 'contact.phoneNumber': phoneNumber } }
        )
        res.status(200).json({ success: 'Telefono actualizado exitosamente' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export async function updateWhatsappProfileLink(req, res) {
    const { username } = req.payload
    const { whatsapp } = req.body
    try {
        const updatedUser = await User.findOneAndUpdate(
            { username },
            { $set: { 'contact.whatsapp': whatsapp } }
        )
        res.status(200).json({ success: 'Whatsapp Actualizado exitosamente' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export async function updateFacebookProfileLink(req, res) {
    const { username } = req.payload
    const { facebook } = req.body
    try {
        const updatedUser = await User.findOneAndUpdate(
            { username },
            { $set: { 'contact.facebook': facebook } }
        )
        res.status(200).json({ success: 'Link de facebook actualizado' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export async function updateTwitterProfileLink(req, res) {
    const { username } = req.payload
    const { twitter } = req.body
    try {
        const updatedUser = await User.findOneAndUpdate(
            { username },
            { $set: { 'contact.twitter': twitter } }
        )
        res.status(200).json({ success: 'Link de twitter Actualizado' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export async function unbanUser(req, res) {
    const { username } = req.params
    try {
        const user = await User.findOne({ username })
        if (user.isActive) {
            throw new userNotBannedError("El usuario no esta baneado")
        }
        await User.findOneAndUpdate({ username }, { isActive: true })
        res.status(200).json({ success: 'Usuario desbloqueado' })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

export async function deleteUser(req, res) {
    const { username } = req.params
    try {
        const user = await User.findOne({ username })
        if (!user) {
            throw new UserNotFoundError("Usuario no encontrado")
        }
        await User.findOneAndDelete({ username })
        res.status(200).json({ success: 'Usuario borrado correctamente' })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}