import cn from 'classnames';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { useSocket } from '../../context/useSocket';
import { setContent } from '../../features/menu/menuSlice';
import { addMessage, setCurrentChat, fetchMessages, addUserToChat, fetchChats, kickUserFromChat } from '../../features/chat/chatSlice';
import { getAllUsers } from '../../features/users/usersSlice';
import { FaUserPlus } from "react-icons/fa6";
import usernameValidator from '../../validators/usernameValidator';
import passwordValidator from '../../validators/passwordValidator';
import inviteCodeValidator from '../../validators/inviteCodeValidator';
import Message from '../../components/Message/Message';
import desame from '../../utils/desame';
import Input from '../../components/Input/Input';
import Back from '../../components/Back/Back';
import { checkPasswordAPI } from '../../features/chat/chatAPI';

import styles from './Chat.module.css';
import Flex from '../../components/Flex/Flex';

function Chat() {
    const { chatId } = useParams();
	const { chats } = useSelector(state => state.chat);
	const chat = chats.find(chat => chat._id === chatId);
    const socket = useSocket();
    const dispatch = useDispatch();
    const { messages } = useSelector(state => state.chat);
    const { user } = useSelector(state => state.auth);
    const { users } = useSelector(state => state.users);
	const chatUsers = users.filter(user => chat?.members.includes(user._id));
	const [isAvailable, setIsAvailable] = useState(chat?.privacy === 'public');

	useEffect(() => {
		dispatch(getAllUsers())
	}, [dispatch])

	useEffect(() => {
		(async () => {
			if (!chatId) return
			await dispatch(fetchMessages(chatId)).unwrap();
		})()
	}, [chatId, dispatch])

	useEffect(() => {
		(async () => {
			if (!chatId) return
			await dispatch(fetchChats()).unwrap();
		})()
	}, [chatId, dispatch])

	useEffect(() => {
		setIsAvailable(chat?.privacy === 'public');
		if (chat !== undefined && chat.privacy === 'private') {
			console.log('password', chat);
			const enterClickHandler = async (e) => {
				const passwordInput = e.target.parentElement.children[2];
				if (passwordInput.getAttribute('isvalid') === 'true' && await checkPasswordAPI(chatId, passwordInput.getAttribute('value'))) {
					setIsAvailable(true);
					dispatch(setContent(undefined));
				}
			}
			dispatch(setContent(
				<>
					<h1>Enter chat password</h1>
					<Input type='password' placeholder='Password' validator={passwordValidator} />
					<button onClick={enterClickHandler}>Enter</button>
				</>
			));
		}
	}, [chat, dispatch, chatId]);
    
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

	window.onkeydown = e => {
		if (e.key === 'Enter') sendMessage()
	}

	const addUserClickHandler = () => {
		const addClickHandler = async (e) => {
			const usernameInput = e.target.parentElement.children[2];
			const inviteCodeInput = e.target.parentElement.children[3];
			if (usernameInput.getAttribute('isvalid') === 'true' && inviteCodeInput.getAttribute('isvalid') === 'true') {
				await dispatch(addUserToChat({
					chatId,
					username: usernameInput.getAttribute('value'),
					inviteCode: inviteCodeInput.getAttribute('value')
				})).unwrap();
				dispatch(setContent(undefined));
			}
		}

		dispatch(setContent(
			<>
				<h1>Add user</h1>
				<Input type='text' placeholder='Username' validator={usernameValidator} />
				<Input type='text' placeholder='Invite code' validator={inviteCodeValidator} />
				<button onClick={addClickHandler}>Add user</button>
			</>
		));
	}

	if (!isAvailable) return <></>;

    return (
		<>
			<Back />
			<Flex justify='stretch'>
				<Flex direction='column' justify='stretch' gap className={cn(styles.container)}>
					<Flex align='start' direction='column' className={cn(styles.messages)} gap onlyGap>
						{messages.map(message => <Message key={message._id} {...message} author={[...users, user].find(user => user._id === message?.author)?.username || 'Unknown user'} />)}
					</Flex>
					<Flex align='center' justify='center' gap onlyGap fitY className={cn(styles.input)}>
						<Input type='text' def={input} onChange={(_, value) => setInput(value)} placeholder='Write your message...' className={cn('wide')} />
						<button onClick={sendMessage}>Send</button>
					</Flex>
				</Flex>
				<Flex direction='column' className={cn(styles.members)} gap fitX borders={['left']}>
					<button className={cn(styles.addUser)} onClick={addUserClickHandler} >
						<FaUserPlus />
					</button>
					{[...chatUsers, user].map(user2 => {
						const clickHandler = () => {
							const kickClickHandler = async () => {
								await dispatch(kickUserFromChat({
									chatId,
									userId: user2._id
								})).unwrap()
								dispatch(setContent(undefined));
							}
							dispatch(setContent(
								<>
									<h1>Moderate</h1>
									{user2._id === user._id ? <h3>This is you</h3> : <button onClick={kickClickHandler}>Kick</button>}
								</>
							));
						}

						return <button className={cn('wide')} key={user2._id} onClick={clickHandler}>{user2.username}</button>
					})}
				</Flex>
			</Flex>
		</>
    )
}

export default Chat;