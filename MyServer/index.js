import express, { json } from 'express'
import morgan from 'morgan'
import connectDB from './config/db'
import authRouter from './routers/auth'
import cateRouter from './routers/category'
import bookRouter from './routers/book'
import userRouter from './routers/user'
import verifyToken from './middleware/auth'

connectDB()

const app = express()

app.use(morgan('combined'))

app.use(json())



const port = 3000




app.use('/apis/auth', authRouter)
app.use('/apis/categories', cateRouter)
app.use('/apis/books', verifyToken,  bookRouter)
app.use('/apis/users', verifyToken,  userRouter)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})