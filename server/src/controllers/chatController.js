// 1. createChat - создание чата (приватный или публичный)
// 2. getMyChats - получить все чаты пользователя
// 3. getChatById - получить чат по id
// 4. joinChat - присоединиться к чату
// 5. getChatMessages - получить сообщения чата (email + сообщения: id, text, createdAt)

import Chat from '../models/chatModel.js';
import Message from '../models/messageModel.js';
import User from '../models/userModel.js';

export const createChat = async (req, res, next) => {
    const user = req.user;
    const { title, privacy, password } = req.body;
    try {
        const chat = await Chat.create({ title, privacy, password: password ?? '', members: [user] });
        await user.updateOne({ $push: { chats: chat } });
        res.status(201).json(chat);
    } catch (error) {
        next(error);
    }
}

export const getMyChats = async (req, res, next) => {
    const user = req.user;
    try {
        const chats = await Chat.find({ members: user });
        res.json(chats);
    } catch (error) {
        next(error);
    }
}

export const getChatById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const chat = await Chat.findById(id);
        res.json(chat);
    } catch (error) {
        next(error);
    }
}

export const joinChat = async (req, res, next) => {
    const user = req.user;
    const { id } = req.params;
    try {
        if (user.chats.includes(id)) {
            return res.status(400).json({ message: 'Вы уже в чате' });
        }
        const chat = await Chat.findByIdAndUpdate(id, { $push: { members: user } }, { new: true });
        res.json(chat);
    } catch (error) {
        next(error);
    }
}

export const getChatMessages = async (req, res, next) => {
    const { id } = req.params;
    try {
        const messages = Array.from(await Message.find({ chat: id }));
        res.json(messages.map((message) => {
            const json = message.toJSON();
            return { id: json._id, text: json.text, createdAt: json.createdAt, email: message.author.toJSON().email };
        }));
    } catch (error) {
        next(error);
    }
}