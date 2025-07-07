import cn from 'classnames';
import { NavLink } from 'react-router';

import styles from './Link.module.css';

function Link({ to, children, className = "", ...props }) {
    return (
        <>
            <NavLink {...props} className={cn(styles.link, className)} to={to}></NavLink>
            {children}
        </>
    )
}

export default Link;