import cn from 'classnames';
import emailValidator from '../../validators/emailValidator';
import passwordValidator from '../../validators/passwordValidator';
import usernameValidator from '../../validators/usernameValidator';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { registerUser } from '../../features/auth/authSlice';

import styles from './Register.module.css';

import Flex from '../../components/Flex/Flex';
import TextLink from '../../components/TextLink/TextLink';
import Input from '../../components/Input/Input';
import Back from '../../components/Back/Back';

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState({ value: "", isValid: false });
    const [password, setPassword] = useState({ value: "", isValid: false });
    const [username, setUsername] = useState({ value: "", isValid: false });

    const registerClickHandler = async (e) => {
        e.preventDefault();
        try {
            if (!email.isValid || !password.isValid || !username.isValid) throw new Error();
            await dispatch(registerUser({ email: email.value, password: password.value, username: username.value })).unwrap();
            navigate('/');
        } catch {
            alert(`Register failed!`);
        }
    }

    const emailChangeHandler = (_, value, { isValid }) => setEmail({ value, isValid });
    const passwordChangeHandler = (_, value, { isValid }) => setPassword({ value, isValid });
    const usernameChangeHandler = (_, value, { isValid }) => setUsername({ value, isValid });

    return (
        <>
            <Back />
            <Flex direction='column' justify='center' gap>
                <Flex className={cn(styles.container)} direction='column' gap fitX fitY>
                    <h1>Register</h1>
                    <Input type='text' placeholder='Username' onChange={usernameChangeHandler} validator={usernameValidator} className={cn('wide')} />
                    <Input type='email' placeholder='Email' onChange={emailChangeHandler} validator={emailValidator} className={cn('wide')} />
                    <Input type='password' placeholder='Password' onChange={passwordChangeHandler} validator={passwordValidator} className={cn('wide')} />
                    <button className={cn("wide")} onClick={registerClickHandler}>Register</button>
                    <TextLink to='/login'>Already have an account? Login</TextLink>
                </Flex>
            </Flex>
        </>
    )
}

export default Register;