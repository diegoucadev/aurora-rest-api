/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
import jwt from 'jsonwebtoken'

export function validateToken(req, res, next) {
    const SECRET = process.env.ACCESS_TOKEN_SECRET
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    //If no token is provided, deny the access
    if(token == null) {
        res.status(401).json({ 'error': 'No token provided' })
        return
    }
    //If the token was tampered, deny the access
    jwt.verify(token, SECRET, (err, decoded) => {
        if(err) {
            return res.status(401).json({ 'error': 'unauthorized' })
        }
        req.payload = decoded
        //Else, continue normally
        next() 
    })
}