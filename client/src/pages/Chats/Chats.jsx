import cn from 'classnames';

import styles from './Chats.module.css';
import Flex from '../../components/Flex/Flex';
import Input from '../../components/Input/Input';
import ChatTile from '../../components/ChatTile/ChatTile';
import Back from '../../components/Back/Back';
import passwordValidator from '../../validators/passwordValidator';
import { setContent } from '../../features/menu/menuSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { createChat, joinPublicChat, joinPrivateChat, setUserChats, fetchChats, setAvailable } from '../../features/chat/chatSlice';
import { getAllUsers } from '../../features/users/usersSlice';
import { logout } from '../../features/auth/authSlice';
import { useEffect, useState } from 'react';
import isUnseqArrEquals from '../../utils/isUnseqArrEquals';

function Chats() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const { users } = useSelector(state => state.users);
    const { userChats } = useSelector(state => state.chat);
    const { chats } = useSelector(state => state.chat);
    const [searchChats, setSearchChats] = useState('');
    const [searchUsers, setSearchUsers] = useState('');

    useEffect(() => {
        dispatch(setAvailable(false));
    }, [dispatch]);

    useEffect(() => {
        (async () => {
            try {
				await dispatch(getAllUsers()).unwrap()
                await dispatch(fetchChats()).unwrap()
                dispatch(setUserChats(user._id))
			} catch (err) {
				alert(err.message)
			}
        })()
    }, [dispatch, user]);

    const startChat = async (otherUserId, isPrivate = false, password = null) => {
        dispatch(setContent(undefined));
		try {
            const already = userChats.some(c => isUnseqArrEquals(c.members, [user._id, otherUserId]))
            let createdChat = {};
            if (!already) {
                createdChat = await dispatch(
                    createChat({
                        title: `${user.username}'s chat with ${users.find(u => u._id === otherUserId).username}`,
                        privacy: isPrivate ? 'private' : 'public',
                        password: isPrivate ? password : null,
                        members: [user._id, otherUserId]
                    })
                ).unwrap()
            } else {
                createdChat = userChats.find(c => isUnseqArrEquals(c.members, [user._id, otherUserId]))
            }
			const chatId = createdChat._id
            if (createdChat.privacy === 'private') {
                await dispatch(joinPrivateChat({ chatId, password: password })).unwrap()
            } else {
                await dispatch(joinPublicChat({ chatId })).unwrap()
            }
            dispatch(setAvailable(true))
			navigate(`/chat/${chatId}`)
		} catch (err) {
			alert(err.message)
		}
	}
    const clickHandler = (otherUserId) => {
        const already = userChats.some(c => isUnseqArrEquals(c.members, [user._id, otherUserId]))
        console.log(already, userChats)
        const privateChatHandler = (otherUserId) => {
            const enterClickHandler = (e, otherUserId) => {
                const input = e.target.parentElement.children[2];
                if (input.getAttribute('isvalid') === 'true') {
                    startChat(otherUserId, true, e.target.parentElement.children[2].getAttribute('value'))
                } else {
                    alert('Enter valid password!')
                }
            }
            dispatch(setContent(
                <>
                    <h1>Enter chat password</h1>
                    <Input type='password' placeholder='Password' validator={passwordValidator} className={cn('wide')} />
                    <button className={cn("wide")} onClick={(e) => enterClickHandler(e, otherUserId)}>Enter</button>
                </>
            ))
        }
        if (!already) {
            dispatch(setContent(
                <>
                    <h1>Select type of new chat</h1>
                    <button className={cn("wide")} onClick={() => startChat(otherUserId)}>Public</button>
                    <button className={cn("wide")} onClick={() => privateChatHandler(otherUserId)}>Private</button>
                </>
            ))   
        } else {
            dispatch(setContent(undefined));
            navigate(`/chat/${userChats.find(c => isUnseqArrEquals(c.members, [user._id, otherUserId]))._id}`)
        }
    }

    const searchChatsChangeHandler = (_, value) => setSearchChats(value);
    const searchUsersChangeHandler = (_, value) => setSearchUsers(value);

    const logoutClickHandler = () => {
        dispatch(logout());
        navigate('/welcome');
    }
    const iCodeClickHandler = () => {
        navigate('/invite-code');
    }

    return (
        <>
            <Back />
            <Flex justify="stretch">
                <Flex direction='column' justify='stretch' borders={['right']} fitX>
                    <Flex direction='column' fitY gap>
                        <span>You are logged in as</span>
                        <h1>{user.username}</h1>
                        <span>{user.email}</span>
                        <Flex fitY gap onlyGap justify='stretch'>
                            <button className={cn("wide")} onClick={logoutClickHandler}>Logout</button>
                            <button className={cn("wide")} onClick={iCodeClickHandler}>I-code</button>
                        </Flex>
                    </Flex>
                    <Flex borders={['top']} direction='column' className={cn(styles.users)}>
                        <Flex direction='column' fitY gap>
                            <h1>Users</h1>
                            <Input placeholder='Search users...' onChange={searchUsersChangeHandler} def={searchUsers} className={cn('wide')} />
                            {
                                Array.from(users).sort((a, b) => b.chats.length - a.chats.length).filter(user => user.username.toLowerCase().includes(searchUsers.toLowerCase())).map(user => 
                                    <button key={user._id} className={cn("wide", "white", styles.user)} onClick={() => clickHandler(user._id)}>{user.username}</button>
                                )
                            }
                        </Flex>
                    </Flex>
                </Flex>
                <Flex borders={['right']} align="center" justify="start" direction='column' gap className={cn(styles.chats)}>
                    <h1>Chats</h1>
                    <Input placeholder='Search chats...' onChange={searchChatsChangeHandler} def={searchChats} className={cn('wide')} />
                    <Flex direction='column' className={cn(styles.chatsList)}>
                        <Flex gap onlyGap wrap='wrap' align='start' fitY>
                            {
                                Array.from(chats).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).filter(chat => chat.title.toLowerCase().includes(searchChats.toLowerCase())).map(chat => 
                                    <ChatTile key={chat._id} chat={chat} />
                                )
                            }
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}

export default Chats;