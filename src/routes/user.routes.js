import { Router } from "express"

const userRouter = Router()

userRouter.get('/', (req, res) => {
    res.send("Hello world")
})

export default userRouter