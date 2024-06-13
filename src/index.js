import express from 'express'
import userRouter from './routes/user.routes.js'
import 'dotenv/config'

const app = express()

app.use(express.json())
app.use('/user', userRouter)

app.listen(3000)