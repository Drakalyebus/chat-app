import express from 'express';
import { createChat, getMyChats, getChatById, joinChat, getChatMessages } from '../controllers/chatController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.post('/createChat', createChat);
router.get('/getMyChats', getMyChats);
router.get('/getChatById/:id', getChatById);
router.post('/joinChat/:id', joinChat);
router.get('/getChatMessages/:id', getChatMessages);

export default router;