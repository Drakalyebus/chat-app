import cn from 'classnames';
import { useLocation, useNavigate } from 'react-router';
import { IoMdArrowRoundBack } from "react-icons/io";

import styles from './Back.module.css';

function Back() {
    const location = useLocation();
    const navigate = useNavigate();


    const backClickHandler = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            navigate('/welcome');
        }
    }

    if (location.pathname === '/welcome') return <></>;

    return (
        <button className={cn("mini", styles.back)} onClick={backClickHandler}>
            <IoMdArrowRoundBack />
        </button>
    )
}

export default Back;