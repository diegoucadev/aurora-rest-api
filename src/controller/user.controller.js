/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
import jwt from 'jsonwebtoken'
import User from '../model/user.model.js'
import bcrypt from 'bcrypt'
import { EmailTakenError, InvalidCredentialsError, InvalidUsername, UserAlreadyBannedError, UserNotFoundError, userNotBannedError } from '../util/Errors.js'

export async function login(req, res) {
    /*
    The user from req.body is the user from the database
    it contains a password, the password that is being
    extracted is the password entered by the user that will be
    validated, the user was set on the handleLoginErrors middleware
    */
    const { user, password } = req.body
    try {
        const match = await bcrypt.compare(password, user.password)
        if (match) {
            const userForToken = {
                _id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin
            }
            const accessToken = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET)
            res.status(200).json({ acessToken: accessToken })
        } else {
            //If the password doesn't match, deny the access
            throw new InvalidCredentialsError("Credenciales de inicio de sesion invalidas")
        }
    } catch (err) {
        res.status(400).json(err.message)
    }
}

export async function register(req, res) {
    const { name, username, password, email } = req.body
    //Encrypt the password
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    //Create a user model to save in the database
    const user = new User({
        name: name,
        username: username,
        password: hashedPassword,
        email: email,
        rating: 0,
        isActive: true,
        isAdmin: false
    })
    try {
        const savedUser = await user.save()
        const { _id, username, email, isAdmin } = savedUser
        //This user object will only be used to create a token
        const userForToken = {
            _id: _id,
            username: username,
            email: email,
            isAdmin: isAdmin
        }
        const accessToken = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET)
        res.status(200).json({ 'Ok': 'user registered', 'token': accessToken })
    } catch (err) {
        res.status(400).json(err.message)
    }
}

export async function getAllUsers(req, res) {
    try {
        const allUsers = await User.find()
        res.status(200).json(allUsers)
    } catch (err) {
        res.json(500).json(err.message)
    }
}

export async function getUserByUsername(req, res) {
    try {
        const { username } = req.params
        const user = await User.findOne({ username })
        if (user == null) {
            throw new InvalidUsername("no user with that username was found")
        } 
        res.status(200).json(user)
    } catch (err) {
        res.status(400).json(err.message)
    }
}

export async function updatePassword(req, res) {
    const { username } = req.payload
    const { currentPassword, newPassword } = req.body
    try {
        const user = await User.findOne({ username })
        if (user == null) {
            throw new UserNotFoundError("User not found")
        }
        const match = bcrypt.compare(currentPassword, user.password)
        if (match) {
            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(newPassword, salt)
            await User.findOneAndUpdate({ username }, { password: hashedPassword })
            res.status(200).json({ 'Ok': 'Password updated' })
        } else {
            throw new InvalidCredentialsError("Passwords don't match")
        }
    } catch (err) {
        res.status(400).json(err.message)
    }
}

export async function updateUsername(req, res) {
    const { username } = req.payload
    const newUsername = req.body.newUsername
    try {
        const isUsernameTaken = await User.findOne({ username: newUsername })
        if (isUsernameTaken) {
            throw new InvalidUsername("The username is already taken")
        }
        const updatedUser = await User.findOneAndUpdate({ username }, { username: newUsername }, { new: true })
        const userForToken = {
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        }

        const accessToken = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET);
        res.status(200).json({
            'Ok': 'Username updated',
            "newAccessToken": accessToken
        })
    } catch (err) {
        res.status(400).json(err.message)
    }
}

export async function updateEmail(req, res) {
    const { username } = req.payload
    const { newEmail } = req.body
    try {
        const isEmailTaken = await User.findOne({ email: newEmail })
        if (isEmailTaken) {
            throw new EmailTakenError("The email is already taken")
        }
        await User.findOneAndUpdate({ username }, { email: newEmail })
        res.status(200).json({ 'Ok': 'Email updated' })
    } catch (err) {
        res.status(400).json(err.message)
    }
}

export async function updateName(req, res) {
    const { username } = req.payload
    const { newName } = req.body
    try {
        await User.findOneAndUpdate({ username }, { name: newName })
        res.status(200).json({ 'Ok': 'Name updated' })
    } catch (err) {
        res.status(500).json(err.message)
    }
}

export async function banUser(req, res) {
    const { username } = req.params
    try {
        const user = await User.find({ username })
        if (!user.isActive) {
            throw new UserAlreadyBannedError("The user is already banned")
        }
        await User.findOneAndUpdate({ username }, { isActive: false })
        res.status(200).json({ 'Ok': 'User banned' })
    } catch (err) {
        res.status(400).json(err.message)
    }
}

export async function unbanUser(req, res) {
    const { username } = req.params
    try {
        const user = await User.findOne({ username })
        if (user.isActive) {
            throw new userNotBannedError("The user is not banned")
        }
        await User.findOneAndUpdate({ username }, { isActive: true })
        res.status(200).json({ 'Ok': 'User unbanned' })
    } catch (err) {
        res.status(400).json(err.message)
    }
}

export async function deleteUser(req, res) {
    const { username } = req.params
    try {
        const user = await User.findOne({ username })
        if (!user) {
            throw new UserNotFoundError("User not found")
        }
        await User.findOneAndDelete({ username })
        res.status(200).json({ "Ok": "User deleted" })
    } catch (err) {
        res.status(400).json(err.message)
    }
}