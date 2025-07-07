import cn from 'classnames';

import styles from './Login.module.css';

function Login() {
    return (
        <div className={cn(styles.login)}>
            <div className={cn(styles.form)}>
                <input type="email" />
            </div>
        </div>
    )
}

export default Login;