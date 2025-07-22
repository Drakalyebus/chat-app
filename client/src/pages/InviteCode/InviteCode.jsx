import cn from 'classnames';

import styles from './InviteCode.module.css';

import Flex from '../../components/Flex/Flex';
import Back from '../../components/Back/Back';
import { updateInviteCode } from '../../features/auth/authSlice';
import { setContent } from '../../features/menu/menuSlice';
import { useDispatch, useSelector } from 'react-redux';

function InviteCode() {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    const updateClickHandler = async () => {
        try{
            await dispatch(updateInviteCode()).unwrap();
        } catch {
            dispatch(setContent(
                <>
                    <h1 className={cn(styles.error)}>Something went wrong</h1>
                    <span className={cn(styles.error)}>Try to reload the page</span>
                </>
            ))
        }
    }

    return (
        <>
            <Back />
            <Flex direction='column' gap justify='center'>
                <h1>Your invite-code</h1>
                <span>The code is needed as a confirmation of your consent to add you to others who know this code in their chat</span>
                <h2>{user?.inviteCode ?? 'Loading...'}</h2>
                <button onClick={updateClickHandler}>Update invite-code</button>
            </Flex>
        </>
    )
}

export default InviteCode;