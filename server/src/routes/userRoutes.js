import express from 'express'
import { getAllUsers } from '../controllers/userController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

// get -> получение всех пользователей
router.get('/', authMiddleware, getAllUsers)

export default router