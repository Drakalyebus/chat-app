import cn from 'classnames';
import Flex from '../Flex/Flex';
import { getAllUsers } from '../../features/users/usersSlice';
import { useDispatch, useSelector } from 'react-redux';
import { joinPrivateChat, joinPublicChat, setAvailable } from '../../features/chat/chatSlice';
import passwordValidator from '../../validators/passwordValidator';
import { setContent } from '../../features/menu/menuSlice';
import { useEffect } from 'react';
import Input from '../Input/Input';
import { useNavigate } from 'react-router';

import styles from './ChatTile.module.css';

function ChatTile({ chat }) {
    const { users } = useSelector(state => state.users);
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try{
                await dispatch(getAllUsers()).unwrap()
            } catch {
                dispatch(setContent(
                    <>
                        <h1 className={cn(styles.error)}>Something went wrong</h1>
                        <span className={cn(styles.error)}>Try to reload the page</span>
                    </>
                ))
            }
        })()
    }, [dispatch]);

    const clickHandler = async () => {
        const youInChat = chat.members.includes(user._id);
        const isPrivate = chat.privacy === 'private';
        if (youInChat) {
            navigate(`/chat/${chat._id}`)
        } else {
            if (isPrivate) {
                const enterClickHandler = async (e) => {
                    const input = e.target.parentElement.children[2];
                    if (input.getAttribute('isvalid') === 'true') {
                        try{
                            await dispatch(joinPrivateChat({ chatId: chat._id, password: input.getAttribute('value') })).unwrap()
                            dispatch(setAvailable(true));
                            navigate(`/chat/${chat._id}`)
                        } catch {
                            dispatch(setContent(
                                <>
                                    <h1 className={cn(styles.error)}>Something went wrong</h1>
                                    <span className={cn(styles.error)}>Try to reload the page</span>
                                </>
                            ))
                        }
                    }
                }
                dispatch(setContent(
                    <>
                        <h1>Enter chat password</h1>
                        <Input type="password" placeholder="Password" validator={passwordValidator} />
                        <button onClick={enterClickHandler}>Enter</button>
                    </>
                ));
                try{
                    await dispatch(joinPrivateChat({ chatId: chat._id })).unwrap()
                } catch {
                    dispatch(setContent(
                        <>
                            <h1 className={cn(styles.error)}>Something went wrong</h1>
                            <span className={cn(styles.error)}>Try to reload the page</span>
                        </>
                    ))
                }
            } else {
                try{
                    await dispatch(joinPublicChat({ chatId: chat._id })).unwrap()
                } catch {
                    dispatch(setContent(
                        <>
                            <h1 className={cn(styles.error)}>Something went wrong</h1>
                            <span className={cn(styles.error)}>Try to reload the page</span>
                        </>
                    ))
                }
            }
            navigate(`/chat/${chat._id}`)
        }
    }

    return (
        <Flex title="Click to open" className={cn(styles.container)} gap direction='column' align='start' fitY fitX onClick={clickHandler}>
            <h3>{chat.title}</h3>
            <span>{chat.privacy === 'private' ? 'Private' : 'Public'}{chat.members.includes(user._id) ? ', You are in a chat' : ''}</span>
            <Flex fitY gap onlyGap className={cn(styles.members)}>
                {
                    chat.members.slice(0, 3).map(member => [...users, user].find(user => user._id === member)).map(member => <button className={cn('mini', 'white')} key={member?._id || user._id}>{member?.username}</button>)
                }
                {
                    chat.members.length > 3 ? <button className={cn('mini')}>...</button> : <></>
                }
            </Flex>
        </Flex>
    )
}

export default ChatTile;