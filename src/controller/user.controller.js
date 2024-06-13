/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

import jwt from 'jsonwebtoken'

export function login(req, res) {
    const username = req.body.username
    const user = { name: username }
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.status(200).json({ acessToken: accessToken })
}

export function test(req, res) {
    res.send('Testing...')
}