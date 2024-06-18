import express from 'express'
import userRouter from './routes/user.routes.js'
import postRouter from './routes/post.routes.js'
import 'dotenv/config'
import mongoose from 'mongoose'
import fileUpload from 'express-fileupload'

const app = express()

app.use(express.json())
app.use('/users', userRouter)
app.use('/posts', postRouter)
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads' 
}))

app.listen(3000)

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection

db.on("error", (error) => {
    console.log(error)
})

db.once("connected", () => {
    console.log("Connected to database")
})