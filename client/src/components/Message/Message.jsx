import cn from 'classnames';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

import styles from './Message.module.css';
import Flex from '../Flex/Flex';

function Message({ text = "", author = "", createdAt = new Date(), ...props }) {
    const { user } = useSelector(state => state.auth);
    const [isSpamMessage, setIsSpamMessage] = useState(false);

    // useEffect(() => setIsSpamMessage(isSpam(text)), [text]);

    return (
        <Flex {...props} align='start' direction='column' className={cn(styles.message)} fitX fitY gap>
            <span className={cn(styles.author, { [styles.selfAuthor]: user.username === author })}>{author}</span>
            <Flex align='end' direction='column' gap className={cn(styles.content, { [styles.self]: user.username === author })} fitX>
                <span className={cn('wide', styles.text)}>{isSpamMessage ? `[Potential spam] ${text}` : text}</span>
                <span className={cn(styles.date)}>{new Date(createdAt).toLocaleString()}</span>
            </Flex>
        </Flex>
    )
}

export default Message;