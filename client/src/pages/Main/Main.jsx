import cn from 'classnames';

import styles from './Main.module.css';

import Flex from '../../components/Flex/Flex';
import Link from '../../components/Link/Link';

function Main() {
    return (
        <Flex align="center" justify="center" direction='column' gap>
            <Flex align="start" justify="center" direction='column' fitX fitY gap>
                <h1 className={cn(styles.title)}>Welcome to Chat-App</h1>
                <Flex align="center" justify="center" gap onlyGap>
                    <button className={cn("white", "wide")}>
                        <Link to="/login">Login</Link>
                    </button>
                    <button className={cn("white", "wide")}>
                        <Link to="/register">Register</Link>
                    </button>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default Main;