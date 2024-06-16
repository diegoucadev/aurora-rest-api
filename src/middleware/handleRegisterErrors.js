import { InvalidUsername } from '../util/Errors';
import User from '../model/user.model.js'

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export async function handleRegisterErrors(req, res, next) {
    const { username } = req.body
    //Check if there a user with the username
    //sent by the user when signing up
    try {
        const isUsernameTaken = await User.findOne({ username })
        if (isUsernameTaken) {
            throw new InvalidUsername("Ya existe un usuario con ese nombre")
        } else {
            next()
        }
    } catch(err) {
        res.status(400).json(err.message)
        return
    }
}