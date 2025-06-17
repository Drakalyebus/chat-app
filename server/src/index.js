import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import { errorHandler } from './middlewares/errorMiddleware.js'
import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js'
import chatRouter from './routes/chatRoutes.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(
	cors({
		origin: '*',
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
	})
)
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/chats', chatRouter)

app.use(errorHandler)

app.listen(port, () => {
	console.log(`Server is running on port ${port}`)
	mongoose
		.connect(process.env.MONGO_URI)
		.then(() => {
			console.log('Connected to MongoDB')
		})
		.catch(err => {
			console.log(err)
		})
})
