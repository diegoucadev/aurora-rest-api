/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
import jwt from 'jsonwebtoken'
import User from '../model/user.model.js'
import bcrypt from 'bcrypt'

export async function login(req, res) {
    const username = req.body.username
    const password = req.body.password
    const user = await User.findOne({ username: username })
    if (user == null) {
        //Return an error if no matches are found
        res.status(500).json({'error': 'User not found'})
    }
    try {
        const match = await bcrypt.compare(password, user.password)
        if(match) {
            const userForToken = { 
                _id: user._id,
                username: user.username,
                email: user.email
            }
            const accessToken = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET)
            res.status(200).json({ acessToken: accessToken })
        } else {
            res.status(401).json({ 'error': 'Incorrect username or password' })
        }
    } catch(err) {
        res.status(500).json({ 'error': 'Something went wrong...' })
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
    //This user object will only be used to create a token
    const userForToken = { 
        _id: user._id,
        username: user.username,
        email: user.email
    }
    try {
        await user.save()
        const accessToken = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET)
        res.status(200).json({'ok': 'user registered', 'token': accessToken})
    } catch(err) {
        res.status(500).json(err)
    }
}