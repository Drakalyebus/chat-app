import Chat from '../models/chatModel.js'
import Message from '../models/messageModel.js'
import User from '../models/userModel.js'

export const createChat = async (req, res, next) => {
	try {
		const { title, privacy, password, members, inviteCode } = req.body

		if (!members || members.length < 2) {
			throw new Error('Для создания чата необходимо указать минимум 2 участника')
		}

		const otherId = members.find(id => id.toString() !== req.user._id.toString())
		const otherUser = await User.findById(otherId);

		if (otherUser.inviteCode !== inviteCode) {
			throw new Error('Неверный код приглашения')	
		}

		if (privacy === 'private' && !password) {
			throw new Error('Для создания приватного чата необходимо указать пароль')
		}

		const chat = await Chat.create({ title, privacy, password, members })
		await User.updateMany({ _id: { $in: members } }, { $push: { chats: chat._id } })

		res.status(201).json(chat)
	} catch (err) {
		next(err)
	}
}

// export const getMyChats = async (req, res, next) => {
// 	try {
// 		const userId = req.user._id
// 		const chats = await Chat.find({ members: userId }).select('+password')

// 		if (!chats) {
// 			throw new Error('Чаты не найдены')
// 		}

// 		//? Подумать, что передавать
// 		res.status(200).json(chats)
// 	} catch (err) {
// 		next(err)
// 	}
// }

export const getChats = async (req, res, next) => {
	try{
		const chats = await Chat.find()
		res.status(200).json(chats)
	} catch (err) {
		next(err)
	}
}

export const joinPublicChat = async (req, res, next) => {
	try {
		const chatId = req.params.id
		const userId = req.user._id

		const chat = await Chat.findById(chatId)
		const user = await User.findById(userId)

		if (!chat) {
			res.status(404)
			throw new Error('Чат не найден')
		}

		if (chat.members.includes(userId)) {
			res.status(200).json(chat._id)
		} else {
			chat.members.push(userId)
			user.chats.push(chatId)
			await user.save()
			await chat.save()
			res.status(200).json(chat._id)
		}
	} catch (err) {
		next(err)
	}
}

export const joinPrivateChat = async (req, res, next) => {
	try {
		const chatId = req.params.id
		const { password } = req.body
		const userId = req.user._id

        console.log(chatId)

		const chat = await Chat.findById(chatId).select('+password')
		if (!chat) {
			res.status(404)
			throw new Error('Чат не найден')
		}

		if (chat.privacy !== 'private') {
			res.status(400)
			throw new Error('Это не приватный чат')
		}

		const isMatch = await chat.correctPassword(password, chat.password)

		if (!isMatch) {
			res.status(401)
			throw new Error('Неверный пароль')
		}

		if (!chat.members.includes(userId)) {
			chat.members.push(userId)
			await chat.save()
			await User.findByIdAndUpdate(userId, { $push: { chats: chat._id } })
		}

		res.status(200).json({ message: 'Вы успешно присоединились к чату' })
	} catch (err) {
		next(err)
	}
}

export const getChatMessages = async (req, res, next) => {
	try {
		const chatId = req.params.id
		const userId = req.user._id

		const chat = await Chat.findById(chatId)
		if (!chat) {
			res.status(404)
			throw new Error('Чат не найден')
		}
		if (!chat.members.includes(userId)) {
			res.status(403)
			throw new Error('У вас нет доступа к этому чату')
		}

		const messages = await Message.find({ chat: chatId })

		res.status(200).json(messages)
	} catch (err) {
		next(err)
	}
}

export const addUserToChat = async (req, res, next) => {
	try {
		const chatId = req.params.id
		const username = req.body.username
		const inviteCode = req.body.inviteCode

		const user = await User.findOne({ username })
		if (!user) {
			res.status(404)
			throw new Error('Пользователь не найден')
		}

		if (user.inviteCode !== inviteCode) {
			res.status(400)
			throw new Error('Неверный код приглашения')
		}

		const chat = await Chat.findById(chatId)
		if (!chat) {
			res.status(404)
			throw new Error('Чат не найден')
		}
		if (chat.members.includes(user._id)) {
			throw new Error('Пользователь уже состоит в чате')
		}

		chat.members.push(user._id)
		user.chats.push(chat._id)
		await user.save()
		await chat.save()

		res.status(200).json({ message: 'Пользователь успешно добавлен в чат' })
	} catch (err) {
		next(err)
	}
}

export const checkPassword = async (req, res, next) => {
	try {
		const chatId = req.params.id
		const { password } = req.body

		const chat = await Chat.findById(chatId).select('+password')
		if (!chat) {
			res.status(404)
			throw new Error('Чат не найден')
		}

		const isMatch = await chat.correctPassword(password, chat.password)

		res.status(200).json({ isMatch })
	} catch (err) {
		next(err)
	}
}

export const kickUserFromChat = async (req, res, next) => {
	try {
		const chatId = req.params.id
		const userId = req.body.userId

		const chat = await Chat.findById(chatId);
		const user = await User.findById(userId);
		if (!chat) {
			res.status(404)
			throw new Error('Чат не найден')
		}
		if (!chat.members.includes(userId)) {
			res.status(400)
			throw new Error('Пользователь не состоит в чате')
		}

		chat.members.splice(chat.members.indexOf(userId), 1);
		user.chats.splice(user.chats.indexOf(chatId), 1);
		if (chat.members.length === 0) {
			await Chat.findByIdAndDelete(chatId);
			await Message.deleteMany({ chat: chatId });
		} else {
			await chat.save();
		}
		await user.save();

		res.status(200).json({ message: 'Пользователь успешно исключен из чата' })
	} catch (err) {
		next(err)
	}
}

export const editChat = async (req, res, next) => {
	try {
		const chatId = req.params.id
		const chat = await Chat.findById(chatId).select('+password')
		if (!chat) {
			res.status(404)
			throw new Error('Чат не найден')
		}
		const { title, privacy, password } = req.body

		chat.title = title ?? chat.title
		chat.privacy = privacy ?? chat.privacy
		chat.password = password ?? chat.password
		await chat.save()

		res.status(200).json({ message: 'Чат успешно отредактирован' })
	} catch (err) {
		next(err)
	}
}