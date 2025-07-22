import axios from 'axios'
import { SERVER_URL } from '../../config'

const CHAT_URL = `${SERVER_URL}/chats`
const config = { withCredentials: true }

export const fetchChatsAPI = async () =>
	axios.get(CHAT_URL, config).then(res => res.data)

export const fetchMessagesAPI = async chatId =>
	axios.get(`${CHAT_URL}/${chatId}/messages`, config).then(res => res.data)

export const createChatAPI = async payload =>
	axios.post(CHAT_URL, payload, config).then(res => res.data)

export const joinPublicChatAPI = async chatId =>
	axios.post(`${CHAT_URL}/${chatId}/join-public`, {}, config).then(res => res.data)

export const joinPrivateChatAPI = async (chatId, password) =>
	axios
		.post(`${CHAT_URL}/${chatId}/join-private`, { password }, config)
		.then(res => res.data)

export const addUserToChatAPI = async (chatId, username, inviteCode) =>
	axios
		.post(`${CHAT_URL}/${chatId}/add-user`, { username, inviteCode }, config)
		.then(res => res.data)
export const checkPasswordAPI = async (chatId, password) =>
	axios
		.post(`${CHAT_URL}/${chatId}/check-password`, { password }, config)
		.then(res => res.data.isMatch)
export const kickUserFromChatAPI = async (chatId, userId) =>
	axios
		.post(`${CHAT_URL}/${chatId}/kick-user`, { userId }, config)
		.then(res => res.data)
export const editChatAPI = async (chatId, payload) =>
	axios
		.patch(`${CHAT_URL}/${chatId}`, payload, config)
		.then(res => res.data)