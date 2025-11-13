'use client';
import Login from '@/src/components/auth/login';
import Register from '@/src/components/auth/register';
import { useState } from 'react';
import styles from './auth_page.module.css';

export default function SharedComparisonPage() {
	const [isNewUser, setIsNewUser] = useState<boolean>(false);

	const toggleIsNewUser = () => setIsNewUser(!isNewUser);

	return (
		<div className={styles.auth_container}>
			{isNewUser ? (
				<Register toggleIsNewUser={toggleIsNewUser} />
			) : (
				<Login toggleIsNewUser={toggleIsNewUser} />
			)}
		</div>
	);
}
