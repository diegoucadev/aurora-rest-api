/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
import jwt from 'jsonwebtoken'
import User from '../model/user.model.js'
import bcrypt from 'bcrypt'

export async function login(req, res) {
    const username = req.body.username
    const user = await User.findOne({ username: username })
    if(user == null) {
        res.status(500).json({'error': 'User not found'})
    } 
    else {
        const userCreds = { username: user.username }
        const accessToken = jwt.sign(userCreds, process.env.ACCESS_TOKEN_SECRET)
        res.status(200).json({ acessToken: accessToken })
    }
}

export async function register(req, res) {
    //Encrypt the password
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    //Create a user model
    const user = new User({ 
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
        rating: 0,
        isActive: true
    })
    try {
        await user.save()
        res.status(200).json({'ok': 'user registered'})
    } catch(err) {
        res.status(500).json(err)
    }
}