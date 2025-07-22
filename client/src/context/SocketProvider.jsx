import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { SERVER_URL } from '../config'
import SocketContext from './socketContext'

export const SocketProvider = ({ children }) => {
	const [socket, setSocket] = useState(null)

	useEffect(() => {
		const newSocket = io(SERVER_URL, { withCredentials: true })
		setSocket(newSocket)

		return () => newSocket.close()
	}, [])

	useEffect(() => {
		if (!socket) return
		socket.on('connect', () => console.log('Connected to server!'))
		socket.on('disconnect', () => console.log('Disconnected from server!'))
	}, [socket])

	return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}