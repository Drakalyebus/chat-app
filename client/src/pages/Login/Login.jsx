import cn from 'classnames';
import emailValidator from '../../validators/emailValidator';
import passwordValidator from '../../validators/passwordValidator';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { loginUser } from '../../features/auth/authSlice';
import { setContent } from '../../features/menu/menuSlice';

import styles from './Login.module.css';

import Flex from '../../components/Flex/Flex';
import TextLink from '../../components/TextLink/TextLink';
import Input from '../../components/Input/Input';
import Back from '../../components/Back/Back';

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState({ value: "", isValid: false });
    const [password, setPassword] = useState({ value: "", isValid: false });

    const loginClickHandler = async (e) => {
        e.preventDefault();
        try {
            if (!email.isValid || !password.isValid) throw new Error();
            await dispatch(loginUser({ email: email.value, password: password.value })).unwrap();
            navigate('/');
        } catch {
            dispatch(setContent(
                <>
                    <h1 className={cn(styles.error)}>Login error</h1>
                    <span className={cn(styles.error)}>The email or password is incorrect</span>
                </>
            ))
        }
    }

    const emailChangeHandler = (_, value, { isValid }) => setEmail({ value, isValid });
    const passwordChangeHandler = (_, value, { isValid }) => setPassword({ value, isValid });

    return (
        <>
            <Back />
            <Flex direction='column' justify='center' gap>
                <Flex className={cn(styles.container)} direction='column' gap fitX fitY>
                    <h1>Login</h1>
                    <Input type='email' placeholder='Email' onChange={emailChangeHandler} validator={emailValidator} className={cn('wide')} />
                    <Input type='password' placeholder='Password' onChange={passwordChangeHandler} validator={passwordValidator} className={cn('wide')} />
                    <button className={cn("wide")} onClick={loginClickHandler}>Login</button>
                    <TextLink to='/register'>Don't have an account? Register</TextLink>
                </Flex>
            </Flex>
        </>
    )
}

export default Login;