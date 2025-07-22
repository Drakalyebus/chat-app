import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
	createChatAPI,
	fetchChatsAPI,
	fetchMessagesAPI,
	joinPrivateChatAPI,
	joinPublicChatAPI,
	addUserToChatAPI,
	kickUserFromChatAPI,
	editChatAPI
} from './chatAPI'
import { loginUser, registerUser, checkAuth } from '../auth/authSlice'

export const fetchChats = createAsyncThunk('chat/fetchChats', async () => {
	const response = await fetchChatsAPI()
	return response
})
export const fetchMessages = createAsyncThunk('chat/fetchMessages', async chatId => {
	const response = await fetchMessagesAPI(chatId)
	return response
})
export const createChat = createAsyncThunk('chat/createChat', async payload => {
	const response = await createChatAPI(payload)
	return response
})
export const joinPublicChat = createAsyncThunk(
	'chat/joinPublicChat',
	async ({ chatId }) => {
		const response = await joinPublicChatAPI(chatId)
		return response
	}
)
export const joinPrivateChat = createAsyncThunk(
	'chat/joinPrivateChat',
	async ({ chatId, password }) => {
		const response = await joinPrivateChatAPI(chatId, password)
		return response
	}
)
export const addUserToChat = createAsyncThunk(
	'chat/addUserToChat',
	async ({ chatId, username, inviteCode }) => {
		const response = await addUserToChatAPI(chatId, username, inviteCode)
		return response
	}
)
export const kickUserFromChat = createAsyncThunk(
	'chat/kickUserFromChat',
	async ({ chatId, userId }) => {
		const response = await kickUserFromChatAPI(chatId, userId)
		return response
	}
)
export const editChat = createAsyncThunk('chat/editChat', async ({ chatId, payload }) => {
	const response = await editChatAPI(chatId, payload)
	return response
})
export const editMess

const chatSlice = createSlice({
	name: 'chat',
	initialState: {
		chats: [],
        userChats: [],
		currentChat: null,
		available: false,
		messages: [],
		status: 'idle'
	},
	reducers: {
		addMessage: (state, action) => {
			const payload = action.payload;
			payload.author = payload.author._id;
			state.messages.push(payload);
		},
		setCurrentChat: (state, action) => {
			state.currentChat = action.payload
            state.messages = []
		},
        setUserChats: (state, action) => {
            const userId = action.payload;
            state.userChats = state.chats.filter(chat => chat.members.includes(userId) || chat.privacy === 'public');
        },
		setAvailable: (state, action) => {
			state.available = action.payload
		}
	},
	extraReducers: builder => {
		builder
			.addCase(fetchChats.pending, state => {
				state.status = 'loading'
			})
			.addCase(fetchChats.fulfilled, (state, action) => {
				state.chats = action.payload
				state.status = 'succeeded'
			})
			.addCase(fetchMessages.fulfilled, (state, action) => {
				state.messages = action.payload
			})
			.addCase(createChat.fulfilled, (state, action) => {
				state.chats.push(action.payload)
                state.userChats.push(action.payload);
			})
			.addCase(joinPublicChat.fulfilled, (state, action) => {
				console.log(action)
				state.currentChat = action.payload
			})
            .addCase(loginUser.fulfilled, (state, action) => {
                console.log('lol', action.payload._id, state.chats.map(chat => chat.members));
                state.userChats = state.chats.filter(chat => chat.members.includes(action.payload._id));
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                console.log('lol', action.payload._id, state.chats.map(chat => chat.members));
                state.userChats = state.chats.filter(chat => chat.members.includes(action.payload._id));
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                console.log('lol', action.payload._id, state.chats.map(chat => chat.members));
                state.userChats = state.chats.filter(chat => chat.members.includes(action.payload._id));
            })
			.addCase(joinPrivateChat.fulfilled, (state) => {
				state.status = 'succeeded'
			})
			.addCase(addUserToChat.fulfilled, (state) => {
				state.status = 'succeeded'
			})
			.addCase(addUserToChat.rejected, (state) => {
				state.status = 'failed'
			})
			.addCase(kickUserFromChat.fulfilled, (state) => {
				state.status = 'succeeded'
			})
			.addCase(kickUserFromChat.rejected, (state) => {
				state.status = 'failed'
			})
			.addCase(editChat.fulfilled, (state) => {
				state.status = 'succeeded'
			})
			.addCase(editChat.rejected, (state) => {
				state.status = 'failed'
			})
	}
})

export const { addMessage, setCurrentChat, setUserChats, setAvailable } = chatSlice.actions
export default chatSlice.reducer