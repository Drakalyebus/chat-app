import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { checkAuth } from '../features/auth/authSlice'
import Loading from './Loading/Loading'

const ProtectedRoute = ({ anti }) => {
	const dispatch = useDispatch()
	const { user, status } = useSelector(state => state.auth)

	useEffect(() => {
		(async () => {
			if (status === 'idle') dispatch(checkAuth())
			else {
				try{
					// await dispatch(refresh()).unwrap()
				} catch {
					return <Navigate to={anti ? '/' : '/welcome'} replace />
				}
			}
		})()
	}, [dispatch, status, anti])

	if (status === 'idle' || status === 'loading') return <Loading />
	if (anti ? user : !user) return <Navigate to={anti ? '/' : '/welcome'} replace />

	return <Outlet />
}

export default ProtectedRoute