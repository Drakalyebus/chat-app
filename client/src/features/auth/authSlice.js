import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { checkAuthAPI, loginUserAPI, registerUserAPI, updateInviteCodeAPI, refreshAPI, logoutAPI } from './authAPI'

export const loginUser = createAsyncThunk(
	'auth/login',
	async ({ email, password }) => {
		return await loginUserAPI(email, password)
	}
)

export const registerUser = createAsyncThunk(
	'auth/register',
	async ({ username, email, password }) => {
		return await registerUserAPI(username, email, password)
	}
)

export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
	return await checkAuthAPI()
})

export const updateInviteCode = createAsyncThunk(
	'auth/updateInviteCode',
	async inviteCode => {
		return await updateInviteCodeAPI(inviteCode)
	}
)

export const refresh = createAsyncThunk('auth/refresh', async () => {
	return await refreshAPI()
})

export const logout = createAsyncThunk('auth/logout', async () => {
	return await logoutAPI()
})

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		user: null,
		status: 'idle',
		error: null
	},
	reducers: {
		// ?
		setUser: (state, action) => {
			state.user = action.payload
		}
	},
	extraReducers: builder => {
		builder
			.addCase(loginUser.fulfilled, (state, action) => {
				state.user = action.payload
				state.status = 'succeeded'
				state.error = null
                state.chat = action.payload.chats;
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.error = action.error.message
				state.status = 'failed'
				state.user = null
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.user = action.payload
				state.status = 'succeeded'
				state.error = null
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.error = action.error.message
				state.status = 'failed'
				state.user = null
			})
			.addCase(checkAuth.pending, state => {
				state.status = 'loading'
			})
			.addCase(checkAuth.fulfilled, (state, action) => {
				state.user = action.payload
				state.status = 'succeeded'
				state.error = null
			})
			.addCase(checkAuth.rejected, (state, action) => {
				state.error = action.error.message
				state.status = 'failed'
				state.user = null
			})
			.addCase(updateInviteCode.fulfilled, (state, action) => {
				state.user.inviteCode = action.payload.inviteCode
				state.status = 'succeeded'
				state.error = null
			})
			.addCase(updateInviteCode.rejected, (state, action) => {
				state.error = action.error.message
				state.status = 'failed'
				state.user = null
			})
			.addCase(refresh.fulfilled, (state, action) => {
				state.user = action.payload
				state.status = 'succeeded'
				state.error = null
			})
			.addCase(refresh.rejected, (state, action) => {
				state.error = action.error.message
				state.status = 'failed'
				state.user = null
			})
			.addCase(logout.fulfilled, (state) => {
				state.user = null
				state.status = 'succeeded'
				state.error = null
			})
			.addCase(logout.rejected, (state, action) => {
				state.error = action.error.message
				state.status = 'failed'
				state.user = null
			})
	}
})

export const { setUser } = authSlice.actions
export default authSlice.reducer