import cn from 'classnames';

import styles from './Flex.module.css';

function Flex({ children, className = '', align = 'center', justify = 'start', direction = 'row', wrap = 'nowrap', fitX = false, fitY = false, gap = false, onlyGap = false, borders = [], ...props }) {
    return (
        <div {...props} className={cn(styles.flex, className, { [styles.fitX]: fitX, [styles.fitY]: fitY, [styles.gap]: gap, [styles.onlyGap]: onlyGap, [styles.right]: borders.includes('right'), [styles.left]: borders.includes('left'), [styles.top]: borders.includes('top'), [styles.bottom]: borders.includes('bottom') })} style={{ alignItems: align, justifyContent: justify, flexDirection: direction, flexWrap: wrap }}>
            {children}
        </div>
    );
}

export default Flex;