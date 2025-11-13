import { setComparison } from '@/src/lib/features/comparison/comparisonSlice';
import { setSettings } from '@/src/lib/features/user/settingsSlice';
import { setUser } from '@/src/lib/features/user/userSlice';
import { useAppDispatch, useAppSelector } from '@/src/lib/hooks';
import { endpoints } from '@/src/utils/api_calls';
import { setCookie } from '@/src/utils/cookies';
import { validateLogin } from '@/src/validation/auth.val';
import { useRouter } from 'next/navigation';
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from 'react';
import ErrorComponent from '../error/error';
import SpecialInput from '../inputs/special_input/special_input';
import styles from './login.module.css';

export default function Login({ toggleIsNewUser }: { toggleIsNewUser: () => void }) {
	const userID = useAppSelector(state => state.user.id);

	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [error, setError] = useState<string>('');

	const dispatch = useAppDispatch();
	const router = useRouter();

	const login = async (e: FormEvent) => {
		try {
			e.preventDefault();
			const val = validateLogin(username, password);
			if (val !== 'passed') {
				setError(val);
				return;
			}

			const { user, settings } = await endpoints.user.get(username, password);

			if (user.comparisons.length && settings.selectedComparison === 0) {
				settings.selectedComparison = user.comparisons[0].id;
			}

			if (settings.selectedComparison && user.comparisons.length) {
				const { id, name, attributes, entries } =
					(await endpoints.comparisons.getTable(settings.selectedComparison)) || {};

				if (id) {
					dispatch(
						setComparison({
							id: id,
							name: name,
							attributes: attributes,
							entries: entries,
						})
					);
				}
			}

			dispatch(setUser(user));
			dispatch(setSettings(settings));
		} catch (err) {
			setError('User not found');
		}
	};

	useEffect(() => {
		if (userID) {
			setCookie('userID', userID.toString(), 7);
			router.replace('/');
		}
	}, [userID]);

	return (
		<form autoComplete='off' onSubmit={login} className={styles.login_form}>
			<h2 className={styles.form_heading}>Login</h2>
			<ErrorComponent msg={error} />
			<div className={styles.username}>
				<SpecialInput value={username} setValue={setUsername} label='Username' inputType='string' />
			</div>
			<div className={styles.password}>
				<SpecialInput value={password} setValue={setPassword} label='Password' inputType='password' />
			</div>

			<button type='submit' className={styles.submit_btn}>
				Submit
			</button>

			<h5 className={styles.logRegSwitchText}>
				Don't have an account? Click{' '}
				<span className={styles.logRegSwitchLink} onClick={toggleIsNewUser}>
					here
				</span>
			</h5>
		</form>
	);
}
