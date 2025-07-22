import cn from 'classnames';
import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router';
import { useSocket } from '../../context/useSocket';
import { setContent } from '../../features/menu/menuSlice';
import { addMessage, setCurrentChat, fetchMessages, addUserToChat, fetchChats, kickUserFromChat, editChat, setAvailable } from '../../features/chat/chatSlice';
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
	const messagesRef = useRef(null);
    const dispatch = useDispatch();
    const { messages } = useSelector(state => state.chat);
    const { user } = useSelector(state => state.auth);
    const { users } = useSelector(state => state.users);
	const { available } = useSelector(state => state.chat);
	const chatUsers = users.filter(user => chat?.members.includes(user._id));
	const [isAvailable, setIsAvailable] = useState(chat?.privacy === 'public' || available);
	const [title, setTitle] = useState(chat?.title);
	const [mode, setMode] = useState('chat');
	const [selectedMessage, setSelectedMessage] = useState(null);
	const [searchUsers, setSearchUsers] = useState('');
	const [searchMessages, setSearchMessages] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(setAvailable(isAvailable));
	}, [dispatch, isAvailable])
	
	useEffect(() => {
		setTitle(chat?.title);
	}, [chat])

	useEffect(() => {
		dispatch(getAllUsers())
	}, [dispatch])

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

	useEffect(() => {
		scrollDownClickHandler();
	}, [messages])

    const sendMessage = () => {
		if (!socket || !input.trim()) return

		socket.emit('sendMessage', {
			text: input,
			authorId: user._id,
			chatId
		})
		setInput('')
	}
	const editMessage = () => {
		if (!socket || !input.trim()) return
		socket.emit('editMessage', {
			text: input,
			messageId: selectedMessage
		})
		setMode('chat');
		setInput('');
		setSelectedMessage(null);
		dispatch(fetchMessages(chatId));
	}

	window.onkeydown = e => {
		if (e.key === 'Enter') {
			if (mode === 'edit') {
				editMessage();
			} else {
				sendMessage();
			}
		}
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
				dispatch(fetchChats());
				dispatch(setContent(undefined));
			}
		}

		dispatch(setContent(
			<>
				<h1>Add user</h1>
				<Input type='text' placeholder='Username' validator={usernameValidator} />
				<Input type='text' placeholder='Invite-code' validator={inviteCodeValidator} />
				<button onClick={addClickHandler}>Add user</button>
			</>
		));
	}

	const titleChangeHandler = async (_, value) => {
		setTitle(value);
		await dispatch(editChat({
			chatId,
			payload: {
				title: value
			}
		})).unwrap();
	}

	const scrollDownClickHandler = () => {
		if (messagesRef.current) {
			messagesRef.current.scrollTo({
				top: messagesRef.current.scrollHeight,
				behavior: 'smooth'
			})
		}
	}

	scrollDownClickHandler();

	if (!isAvailable) return <></>;

    return (
		<>
			<Back />
			<Flex direction='column' justify='stretch'>
				<Flex gap justify='center' fitY>
					<Input type='text' placeholder='Chat title' className={cn('wide', styles.title)} onChange={titleChangeHandler} def={title} />
				</Flex>
				<Flex justify='stretch' borders={['top']}>
					<Flex direction='column' justify='stretch' gap className={cn(styles.container)}>
						<Input def={searchMessages} onChange={(_, value) => setSearchMessages(value)} type="text" placeholder="Search messages..." className={cn(styles.search)} />
						<Flex ref={messagesRef} direction='column' className={cn(styles.overflow)}>
							<Flex direction='column' gap onlyGap fitY>
								{messages.filter(message => message.text.toLowerCase().includes(searchMessages.toLowerCase())).map(message => {
									const clickHandler = () => {
										if (message.author === user._id) {
											const deleteClickHandler = () => {
												if (!socket) return

												socket.emit('deleteMessage', {
													messageId: message._id
												})

												dispatch(fetchMessages(chatId));
												dispatch(setContent(undefined));
											}
											const editClickHandler = () => {
												setMode('edit');
												setInput(message.text);
												setSelectedMessage(message._id);
												dispatch(setContent(undefined));
											}

											dispatch(setContent(
												<>
													<h1>Actions with message</h1>
													<Flex gap onlyGap justify='stretch'>
														<button onClick={deleteClickHandler} className={cn('wide')}>Delete</button>
														<button onClick={editClickHandler} className={cn('wide')}>Edit</button>
													</Flex>
												</>
											))
										}
									}

									return (
										<Message className={cn({ [styles.selected] : selectedMessage === message._id })} title={message.author === user._id ? 'Click to act' : ''} onClick={clickHandler} key={message._id} {...message} author={[...users, user].find(user => user._id === message?.author)?.username || 'Unknown user'} />
									)
								})}
							</Flex>
						</Flex>
						<Flex align='center' justify='center' gap onlyGap fitY className={cn(styles.input)}>
							<Input type='text' autoUpdate def={input} onChange={(_, value) => setInput(value)} placeholder={mode === 'edit' ? 'Edit your message...' : 'Write your message...'} className={cn('wide')} />
							{mode === 'edit' ? (
								<button className={cn(styles.send)} onClick={editMessage}>Edit</button>
							) : (
								<button className={cn(styles.send)} onClick={sendMessage}>Send</button>
							)}
							<button className={cn('mini')} onClick={scrollDownClickHandler}>Down</button>
						</Flex>
					</Flex>
					<Flex direction='column' className={cn(styles.overflow)} fitX borders={['left']}>
						<Flex direction='column' gap fitY>
							<Flex justify='stretch' gap onlyGap fitY>
								<Input type='text' className={cn('wide')} def={searchUsers} onChange={(_, value) => setSearchUsers(value)} placeholder='Search users...' />
								<button className={cn(styles.addUser)} onClick={addUserClickHandler} >
									<FaUserPlus />
								</button>
							</Flex>
							{[...chatUsers, user].filter(user => user.username.toLowerCase().includes(searchUsers.toLowerCase())).map(user2 => {
								const clickHandler = () => {
									const kickClickHandler = async () => {
										await dispatch(kickUserFromChat({
											chatId,
											userId: user2._id
										})).unwrap()
										dispatch(fetchChats());
										dispatch(setContent(undefined));
									}
									const leaveClickHandler = async () => {
										kickClickHandler();
										dispatch(setAvailable(false));
										navigate('/');
									}
									dispatch(setContent(
										<>
											<h1>Moderate</h1>
											{user2._id === user._id ? <button onClick={leaveClickHandler}>Leave</button> : <button onClick={kickClickHandler}>Kick</button>}
										</>
									));
								}

								return <button className={cn('wide', 'white')} key={user2._id} onClick={clickHandler}>{user2.username}</button>
							})}
						</Flex>
					</Flex>
				</Flex>
			</Flex>
		</>
    )
}

export default Chat;