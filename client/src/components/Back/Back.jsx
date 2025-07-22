import cn from 'classnames';
import { useLocation } from 'react-router';

import styles from './Back.module.css';

function Back() {
    const location = useLocation();

    const backClickHandler = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = '/welcome';
        }
    }

    if (location.pathname === '/welcome') return <></>;

    return (
        <button className={cn("mini", styles.back)} onClick={backClickHandler}>Back</button>
    )
}

export default Back;