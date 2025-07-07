import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
	createChatAPI,
	fetchChatsAPI,
	fetchMessagesAPI,
	joinPrivateChatAPI,
	joinPublicChatAPI
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

const chatSlice = createSlice({
	name: 'chat',
	initialState: {
		chats: [],
        userChats: [],
		currentChat: null,
		messages: [],
		status: 'idle'
	},
	reducers: {
		addMessage: (state, action) => {
			state.messages.push(action.payload)
		},
		setCurrentChat: (state, action) => {
			state.currentChat = action.payload
            state.messages = []
		},
        setUserChats: (state, action) => {
            const userId = action.payload;
            state.userChats = state.chats.filter(chat => chat.members.includes(userId));
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
	}
})

export const { addMessage, setCurrentChat, setUserChats } = chatSlice.actions
export default chatSlice.reducer