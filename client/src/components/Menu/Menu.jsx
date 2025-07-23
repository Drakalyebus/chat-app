import cn from 'classnames';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { setContent as preSet } from '../../features/menu/menuSlice';
import { useDispatch } from 'react-redux';
import { IoClose } from "react-icons/io5";

import styles from './Menu.module.css';
import Flex from '../Flex/Flex';

function Menu() {
    const dispatch = useDispatch();
    const { content: pre } = useSelector(state => state.menu);
    const [content, setContent] = useState(pre);

    useEffect(() => setContent(pre), [pre]);

    const closeClickHandler = () => {
        dispatch(preSet(undefined));
        setContent(undefined);
    };

    return (
        <Flex align="center" justify="center" className={cn(styles.container, { [styles.visible]: content !== undefined })} direction='column' gap>
            <Flex align="center" justify="center" direction='column' gap fitX fitY className={cn(styles.menu)}>
                <button className={cn("mini", 'white', styles.close)} onClick={closeClickHandler}>
                    <IoClose />
                </button>
                {content}
            </Flex>
        </Flex>
    )
}

export default Menu;