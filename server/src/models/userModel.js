import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import ShortUniqueId from 'short-unique-id'

const userSchema = mongoose.Schema(
	{
		username: {
			type: String,
			required: [true, 'Пользователь должен иметь username'],
			unique: true,
			trim: true,
			minlength: 3,
			maxlength: 20
		},
		email: {
			type: String,
			required: [true, 'Пользователь должен иметь email'],
			unique: true,
			trim: true,
			lowercase: true,
			match: [
				/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
				'Пожалуйста, введите корректный email'
			]
		},
		password: {
			type: String,
			required: [true, 'Пользователь должен иметь password'],
			minlength: 6,
			select: false
		},
		inviteCode: {
			type: String,
			unique: true,
			trim: true,
			required: [true, 'Пользователь должен иметь inviteCode']
		},
		chats: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Chat'
			}
		]
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true,
			transform: (doc, ret) => {
				delete ret.password
				return ret
			}
		},
		toObject: {
			virtuals: true
		}
	}
)

// Хеширование пароля перед сохранением
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next()
	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
	next()
})

// Проверка пароля
userSchema.methods.correctPassword = async (candidatePassword, userPassword) => {
	return await bcrypt.compare(candidatePassword, userPassword)
}

const User = new mongoose.model('User', userSchema)
export default User
