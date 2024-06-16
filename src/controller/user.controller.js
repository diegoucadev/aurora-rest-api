/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
import jwt from 'jsonwebtoken'
import User from '../model/user.model.js'
import bcrypt from 'bcrypt'
import { AccessDeniedError, InvalidCredentialsError } from '../util/Errors.js'

export async function login(req, res) {
    /*
    The user from req.body is the user from the database
    it constains a password, the password that is being
    extracted is the password entered by the user that will be
    validated
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
    const { firstName, lastName, username, password, email } = req.body
    //Encrypt the password
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    //Create a user model to save in the database
    const user = new User({
        firstName: firstName,
        lastName: lastName,
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
        res.status(200).json({ 'ok': 'user registered', 'token': accessToken })
    } catch (err) {
        res.status(400).json(err.message)
    }
}

export async function getAllUsers(req, res) {
    try {
        const allUsers = await User.find()
        res.status(200).json(allUsers)
    } catch(err) {
        res.json(500).json(err.message)
    }
}