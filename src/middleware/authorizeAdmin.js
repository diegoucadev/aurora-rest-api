import User from '../model/user.model.js'
import { AccessDeniedError } from '../util/Errors.js'

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export async function authorizeAdmin(req, res, next) {
    const { username } = req.payload
    try {
        const user = await User.findOne({ username })
        if(user.isAdmin) {
            next()
        } 
        throw new AccessDeniedError("User is not admin")
    } catch(err) {
        res.status(400).json(err.message)
        return
    }
}