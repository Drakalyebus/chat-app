import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice.js'
import chatReducer from '../features/chat/chatSlice.js'
import usersReducer from '../features/users/usersSlice.js'
import menuReducer from '../features/menu/menuSlice.js'

export const store = configureStore({
	reducer: {
		auth: authReducer,
		chat: chatReducer,
		users: usersReducer,
        menu: menuReducer
	},
	middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
})