import { EmailAlreadyTakenError, InvalidUsername } from '../util/Errors';
import User from '../model/user.model.js'

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export async function handleRegisterErrors(req, res, next) {
    const { username, email } = req.body
    //Check if there a user with the username
    //sent by the user when signing up
    try {
        const isUsernameTaken = await User.findOne({ username })
        if (isUsernameTaken) {
            throw new InvalidUsername("The username is already in use")
        } 
        const isEmailTaken = await User.findOne({ email })
        if (isEmailTaken) {
            throw new EmailAlreadyTakenError("The email is already in use")
        }
        next()
    } catch(err) {
        res.status(400).json(err.message)
        return
    }
}