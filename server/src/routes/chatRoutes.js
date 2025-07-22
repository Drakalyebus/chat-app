import express from 'express'
import {
	createChat,
	getChatMessages,
	getMyChats,
	joinPrivateChat,
	joinPublicChat,
	addUserToChat,
	checkPassword,
	kickUserFromChat
} from '../controllers/chatController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.use(authMiddleware)
router.post('/', createChat)
router.get('/', getMyChats)
router.post('/:id/join-public', joinPublicChat)
router.post('/:id/join-private', joinPrivateChat)
router.get('/:id/messages', getChatMessages)
router.post('/:id/add-user', addUserToChat)
router.post('/:id/check-password', checkPassword)
router.post('/:id/kick-user', kickUserFromChat)

export default router