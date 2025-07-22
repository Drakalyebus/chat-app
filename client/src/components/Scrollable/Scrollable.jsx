import cn from 'classnames';
import Flex from '../Flex/Flex';

import styles from './Scrollable.module.css';

function Scrollable({ children, className = '', align = 'center', justify = 'start', direction = 'row', wrap = 'nowrap', fitX = false, fitY = false, gap = false, onlyGap = false, ...props }) {
    return (
        <div {...props} className={cn(styles.scrollable, className)}>
            {children}
        </div>
    )
}

export default Scrollable;