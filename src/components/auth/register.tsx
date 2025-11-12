import { useAppDispatch } from '@/src/lib/hooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ErrorComponent from '../error/error';
import SpecialInput from '../inputs/special_input/special_input';
import styles from './login.module.css';

const Register = ({ toggleIsNewUser }: { toggleIsNewUser: () => void }) => {
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [passwordConfirm, setPasswordConfirm] = useState<string>('');
	const [error, setError] = useState<string>('');

	const dispatch = useAppDispatch();
	const router = useRouter();

	return (
		<form autoComplete='off' onSubmit={() => console.log('Submit')} className={styles.login_form}>
			<h2 className={styles.form_heading}>Register</h2>
			<ErrorComponent msg={error} />
			<div className={styles.username}>
				<SpecialInput value={username} setValue={setUsername} label='Username' inputType='string' />
			</div>
			<div className={styles.password}>
				<SpecialInput value={password} setValue={setPassword} label='Password' inputType='password' />
			</div>
			<div className={styles.confirm_password}>
				<SpecialInput
					value={passwordConfirm}
					setValue={setPasswordConfirm}
					label='Confirm Password'
					inputType='password'
				/>
			</div>

			<button type='submit' className={styles.submit_btn}>
				Submit
			</button>

			<h5 className={styles.logRegSwitchText}>
				Already have an account? Click{' '}
				<span className={styles.logRegSwitchLink} onClick={toggleIsNewUser}>
					here
				</span>
			</h5>
		</form>
	);
};

export default Register;
