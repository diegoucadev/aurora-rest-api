import User from '../model/user.model.js'
import { UserNotFoundError, AccessDeniedError } from '../util/Errors.js'

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export async function handleLoginErrors(req, res, next) {
    const { username } = req.body
    try {
        const user = await User.findOne({ username })
        //If the user is not on the database, throw an error
        if (!user) {
            //Return an error if no matches are found
            throw new UserNotFoundError("Usuario no registrado")
        }
        //If the user is banned, throw an error
        if (!user.isActive) {
            throw new AccessDeniedError("Usuario baneado")
        }
        req.body.user = user
        next()
    } catch (err) {
        res.status(400).json({ error: err.message })
        return
    }
}