import cn from 'classnames';
import { useState, useEffect } from 'react';

import styles from './Input.module.css';

function Input({ type = "text", autoUpdate = false, placeholder = "", def = "", onChange = () => {}, className = "", validator = () => ({ isValid: null, message: "" }), ...props }) {
    const [value, setValue] = useState(def);
    const [edited, setEdited] = useState(false);
    const [isValid, setIsValid] = useState(validator(null, value, { isValid: true, message: "" }).isValid);
    const [message, setMessage] = useState(validator(null, value, { isValid: true, message: "" }).message);

    useEffect(() => {
        if (autoUpdate) {
            setValue(def);
            const { isValid: newIsValid, message: newMessage } = validator(null, def, { isValid: true, message: "" });
            setIsValid(newIsValid);
            setMessage(newMessage);
        }
    }, [def, validator, autoUpdate]);

    const changeHandler = (e) => {
        setEdited(true);
        setValue(e.target.value);
        const { isValid: newIsValid, message: newMessage } = validator(e, e.target.value, { isValid: isValid ?? true, message });
        setIsValid(newIsValid);
        setMessage(newMessage);
        onChange(e, e.target.value, { isValid: newIsValid ?? true, newMessage });
    }

    return (
        <div title={message} value={value} message={message} isvalid={isValid === null ? "true" : isValid.toString()} className={cn(styles.container, className)}>
            <input {...props} type={type} placeholder={placeholder} value={value} onChange={changeHandler} className={cn(className, { [styles.valid]: isValid === true && edited, [styles.invalid]: isValid === false && edited })} />
            <span className={cn(styles.message, { [styles.valid]: isValid === true && edited, [styles.invalid]: isValid === false && edited })}>{edited ? message : ''}</span>
        </div>
    )
}

export default Input;