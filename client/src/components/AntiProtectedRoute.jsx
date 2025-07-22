import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { checkAuth } from '../features/auth/authSlice'
import Loading from './Loading/Loading'

const AntiProtectedRoute = () => {
	const dispatch = useDispatch()
	const { user, status } = useSelector(state => state.auth)

	useEffect(() => {
		if (status === 'idle') dispatch(checkAuth())
	}, [dispatch, status])

	if (status === 'idle' || status === 'loading') return <Loading />
	if (user) return <Navigate to='/' replace />

	return <Outlet />
}

export default AntiProtectedRoute