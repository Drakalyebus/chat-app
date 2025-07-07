import cn from 'classnames';

import styles from './Flex.module.css';

function Flex({ children, className = '', align = 'center', justify = 'start', direction = 'row', wrap = 'nowrap', fitX = false, fitY = false, gap = false, onlyGap = false }) {
    return (
        <div className={cn(styles.flex, className, { [styles.fitX]: fitX, [styles.fitY]: fitY, [styles.gap]: gap, [styles.onlyGap]: onlyGap })} style={{ alignItems: align, justifyContent: justify, flexDirection: direction, flexWrap: wrap }}>
            {children}
        </div>
    );
}

export default Flex;