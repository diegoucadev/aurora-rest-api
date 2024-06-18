import { Router } from "express"

const postRouter = Router()

postRouter.get('/', (req, res)=> {
    res.json({ 'Ok': 'Ok' })
})

export default postRouter