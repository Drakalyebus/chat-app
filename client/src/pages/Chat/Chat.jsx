import cn from 'classnames';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { useSocket } from '../../context/useSocket';
import { addMessage, setCurrentChat, fetchMessages } from '../../features/chat/chatSlice';
import Message from '../../components/Message/Message';
import desame from '../../utils/desame';
import Input from '../../components/Input/Input';

import styles from './Chat.module.css';
import Flex from '../../components/Flex/Flex';

function Chat() {
    const { chatId } = useParams();
    const { socket } = useSocket();
    const dispatch = useDispatch();
    const { messages } = useSelector(state => state.chat);
    const { user } = useSelector(state => state.auth);
    const { users } = useSelector(state => state.users);
    
    const [input, setInput] = useState('');
    const [log, setLog] = useState([]);

    useEffect(() => {
		if (!chatId) return
		dispatch(fetchMessages(chatId))
		dispatch(setCurrentChat(chatId))
	}, [chatId, dispatch])

    useEffect(() => {
		if (!socket || !chatId || !user) return

		socket.emit('joinRoom', {
			chatId,
			userId: user._id,
			username: user.username
		})

		return () => {
			socket.emit('leaveRoom', {
				chatId,
				userId: user._id,
				username: user.username
			})
		}
	}, [socket, chatId, user])

    useEffect(() => {
		if (!socket) return

		const handleNewMessage = msg => {
			if (msg.chat === chatId) {
				dispatch(addMessage(msg))
			}
		}

		const handleUserJoined = ({ username }) => {
			setLog(prev => [...prev, `${username} вошёл в чат`])
		}

		const handleUserLeft = ({ username }) => {
			setLog(prev => [...prev, `${username} вышел из чата`])
		}

		socket.on('newMessage', handleNewMessage)
		socket.on('userJoined', handleUserJoined)
		socket.on('userLeft', handleUserLeft)

		return () => {
			socket.off('newMessage', handleNewMessage)
			socket.off('userJoined', handleUserJoined)
			socket.off('userLeft', handleUserLeft)
		}
	}, [socket, chatId, dispatch])

    const sendMessage = () => {
		if (!socket || !input.trim()) return

		socket.emit('sendMessage', {
			text: input,
			authorId: user._id,
			chatId
		})
		setInput('')
	}

    return (
        <Flex direction='column' justify='stretch' gap className={cn(styles.container)}>
            <Flex align='start' direction='column' className={cn(styles.messages)} gap onlyGap>
                {desame(messages.map(message => ({...message, authorId: users.find(user => user._id === message.authorId).username})), (message) => message.authorId, (message) => ({...message, authorId: null})).map(message => <Message key={message._id} text={message.text} author={message.authorId} createdAt={message.createdAt} />)}
            </Flex>
            <Flex align='center' justify='center' direction='column' gap onlyGap fitY className={cn(styles.input)}>
                <Input type='text' def={input} onChange={(_, value) => setInput(value)} placeholder='Write your message...' className={cn('wide')} />
                <button onClick={sendMessage}>Send</button>
            </Flex>
        </Flex>
    )
}

export default Chat;