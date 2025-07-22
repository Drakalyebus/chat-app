import cn from 'classnames';
import Flex from '../Flex/Flex';
import { getAllUsers } from '../../features/users/usersSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import styles from './ChatTile.module.css';

function ChatTile({ chat }) {
    const { users } = useSelector(state => state.users);
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            await dispatch(getAllUsers()).unwrap()  
        })()
    }, [dispatch]);

    const clickHandler = () => {
        window.location.href = `/chat/${chat._id}`
    }

    return (
        <Flex title="Click to open" className={cn(styles.container)} gap direction='column' align='start' fitY onClick={clickHandler}>
            <h3>{chat.title}</h3>
            <span>{chat.privacy}</span>
            <Flex fitY gap onlyGap>
                {
                    chat.members.map(member => [...users, user].find(user => user._id === member)).map(member => <button className={cn('mini')} key={member?._id}>{member?.username}</button>)
                }
            </Flex>
        </Flex>
    )
}

export default ChatTile;