import User from '../models/userModel.js'
import { generateTokens } from '../utils/generateTokens.js'
import ShortUniqueId from 'short-unique-id'

export const register = async (req, res, next) => {
	try {
		const { username, email, password } = req.body
		const uid = new ShortUniqueId({ length: 6, dictionary: 'alphanum' });
		const inviteCode = uid.rnd();
		const userExists = await User.findOne({ $or: [{ email }, { username }] })

		if (userExists) {
			console.log('test')
			res.status(400)
			throw new Error(
				'Пользователь с таким email и(-или) username уже зарегистрирован'
			)
		}

		const user = new User({
			username,
			email,
			password,
			inviteCode
		})

		await user.save()

		const tokens = generateTokens(user._id)

		res.cookie('refreshToken', tokens.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
			httpOnly: true
		})

		res.cookie('accessToken', tokens.accessToken, {
			maxAge: 10 * 60 * 1000, // 10 минут
			httpOnly: true
		})

		return res.status(201).json({
			_id: user._id,
			username: user.username,
			email: user.email,
			chats: user.chats,
			inviteCode
		})
	} catch (err) {
		next(err)
	}
}

export const login = async (req, res, next) => {
	try {
		const { email, password } = req.body
		const user = await User.findOne({ email }).select('+password')

		if (!user) {
			res.status(400)
			throw new Error('Неверный email или пароль')
		}

		console.log(password)
		console.log(user.password)
		const isMatch = await user.correctPassword(password, user.password)
		console.log(isMatch)
		if (!isMatch) {
			res.status(400)
			throw new Error('Неверный email или пароль')
		}

		const tokens = generateTokens(user._id)
		res.cookie('refreshToken', tokens.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
			httpOnly: true
		})

		res.cookie('accessToken', tokens.accessToken, {
			maxAge: 10 * 60 * 1000, // 10 минут
			httpOnly: true
		})

		res.json({
			_id: user._id,
			username: user.username,
			email: user.email,
			chats: user.chats,
			inviteCode: user.inviteCode
		})
	} catch (err) {
		next(err)
	}
}

export const checkAuth = async (req, res, next) => {
	try {
		if (!req.user) {
			res.status(401)
			throw new Error('Вы не авторизованы')
		}
		res.json({
			_id: req.user._id,
			username: req.user.username,
			email: req.user.email,
			chats: req.user.chats,
			inviteCode: req.user.inviteCode
		})
	} catch (err) {
		next(err)
	}
}
export const updateInviteCode = async (req, res, next) => {
	try {
		const uid = new ShortUniqueId({ length: 6, dictionary: 'alphanum' })
		const inviteCode = uid.rnd();
		await User.findByIdAndUpdate(req.user._id, { inviteCode })
		res.json({ inviteCode })
	} catch (err) {
		next(err)
	}
}