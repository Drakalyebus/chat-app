import cn from 'classnames';

import styles from './Chats.module.css';
import Flex from '../../components/Flex/Flex';
import Input from '../../components/Input/Input';
import passwordValidator from '../../validators/passwordValidator';
import Menu from '../../components/Menu/Menu';
import { setContent } from '../../features/menu/menuSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { createChat, joinPublicChat, joinPrivateChat, setUserChats } from '../../features/chat/chatSlice';
import { getAllUsers } from '../../features/users/usersSlice';
import { useEffect } from 'react';
import isUnseqArrEquals from '../../utils/isUnseqArrEquals';

function Chats() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const { users } = useSelector(state => state.users);
    const { userChats } = useSelector(state => state.chat);

    useEffect(() => {
        (async () => {
            try {
				await dispatch(getAllUsers()).unwrap()
			} catch (err) {
				alert(err.message)
			}
        })()
    }, [dispatch]);

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
                alert('Chat created!')
            } else {
                createdChat = userChats.find(c => isUnseqArrEquals(c.members, [user._id, otherUserId]))
            }
			console.log(createdChat)
			const chatId = createdChat._id
            if (createdChat.privacy === 'private') {
                await dispatch(joinPrivateChat({ chatId, password: password })).unwrap()
            } else {
                await dispatch(joinPublicChat({ chatId })).unwrap()
            }
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
            privateChatHandler('')
        }
    }

    return (
        <>
            <Flex align="center" justify="center" direction='column' gap>
                {
                    users.map(user => 
                        <button key={user._id} className={cn("wide", styles.user)} onClick={() => clickHandler(user._id)}>{user.username}</button>
                    )
                }
            </Flex>
        </>
    )
}

export default Chats;