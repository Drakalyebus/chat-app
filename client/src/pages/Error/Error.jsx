import cn from 'classnames';
import { useLocation } from 'react-router';
import Flex from '../../components/Flex/Flex';
import Link from '../../components/Link/Link';

import styles from './Error.module.css';

function Error() {
    const location = useLocation();

    return (
        <Flex justify="center" direction='column' gap>
            <h1 className={cn(styles.title)}>404</h1>
            <h3 className={cn(styles.title)}>Page "{location.pathname}" not found</h3>
            <button>
                <Link to="/">Go to main</Link>
            </button>
        </Flex>
    )
}

export default Error;