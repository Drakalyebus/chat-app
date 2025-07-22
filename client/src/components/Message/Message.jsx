import cn from 'classnames';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setContent } from '../../features/menu/menuSlice';

import styles from './Message.module.css';
import Flex from '../Flex/Flex';

function Message({ text = "", author = "", createdAt = new Date() }) {
    const { user } = useSelector(state => state.auth);
    const [isSpamMessage, setIsSpamMessage] = useState(false);
    const dispatch = useDispatch();

    // useEffect(() => setIsSpamMessage(isSpam(text)), [text]);

    const clickHandler = () => {
        const deleteClickHandler = () => {
            
        }

        dispatch(setContent(
            <>
                <button>Delete</button>
                <button>Edit</button>
            </>
        ));
    }

    return (
        <Flex align='start' direction='column' className={cn(styles.message)} fitX fitY gap>
            <span className={cn(styles.author, { [styles.selfAuthor]: user.username === author })}>{author}</span>
            <Flex align='end' direction='column' gap className={cn(styles.content, { [styles.self]: user.username === author })} fitX>
                <span className={cn('wide', styles.text)}>{isSpamMessage ? `[Potential spam] ${text}` : text}</span>
                <span className={cn(styles.date)}>{new Date(createdAt).toLocaleString()}</span>
            </Flex>
        </Flex>
    )
}

export default Message;