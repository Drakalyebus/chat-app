import cn from 'classnames';

import styles from './MainLayout.module.css';

import { Outlet } from 'react-router-dom';
import Flex from '../../components/Flex/Flex';

function MainLayout() {
    return (
        <Flex align="center" justify="center">
            <Outlet />
        </Flex>
    )
}

export default MainLayout;