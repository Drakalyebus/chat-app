import cn from 'classnames';
import { NavLink } from 'react-router';

import styles from './TextLink.module.css';

function TextLink({ to, children, className = "", ...props }) {
    return (
        <>
            <NavLink {...props} className={cn(styles.link, className)} to={to}>
                {children}
            </NavLink>
        </>
    )
}

export default TextLink;