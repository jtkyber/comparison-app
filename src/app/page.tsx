'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import TableDisplay from '../components/table_display/table_display';
import TableManager from '../components/table_manager/table_manager';
import TableSettings from '../components/table_settings_bar/table_settings_bar';
import { setComparison } from '../lib/features/comparison/comparisonSlice';
import { setSelectedComparison, setSettings } from '../lib/features/user/settingsSlice';
import { setUser } from '../lib/features/user/userSlice';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import { endpoints } from '../utils/api_calls';
import { getCookie, setCookie } from '../utils/cookies';
import styles from './page.module.css';

declare global {
	interface Window {
		tooltipDelay: number;
	}
}

export default function Home() {
	const { id: userID } = useAppSelector(state => state.user);
	const { attributes, entries } = useAppSelector(state => state.comparison);

	const router = useRouter();

	const dispatch = useAppDispatch();

	const loginWithID = async (idString: string) => {
		try {
			const idParsed = parseInt(idString);
			const { user, settings } = await endpoints.user.getWithID(idParsed);

			if (user.comparisons.length && settings.selectedComparison === 0) {
				settings.selectedComparison = user.comparisons[0].id;
			}

			if (settings.selectedComparison && user.comparisons.length) {
				const { id, name, attributes, entries } =
					(await endpoints.comparisons.getTable(settings.selectedComparison, user.id)) || {};

				if (id) {
					if (id !== settings.selectedComparison) {
						settings.selectedComparison = id;
						await endpoints.settings.selectedComparison.set(user.id, id);
					}

					dispatch(
						setComparison({
							id: id,
							name: name,
							attributes: attributes,
							entries: entries,
						})
					);

					dispatch(setSelectedComparison(id));
				}
			}

			dispatch(setUser(user));
			dispatch(setSettings({ ...settings, selectedComparison: settings.selectedComparison }));

			setCookie('userID', user.id.toString(), 7);

			router.replace('/');
		} catch (err) {
			router.push('/auth');
		}
	};

	useEffect(() => {
		window.tooltipDelay = 800;

		if (!userID) {
			const userIDCookie = getCookie('userID');
			if (userIDCookie) loginWithID(userIDCookie);
			else router.push('/auth');
		}
	}, [userID]);

	return (
		<div className={styles.page}>
			{userID ? (
				<>
					<TableManager />
					<TableDisplay attributes={attributes} entries={entries} />
					<TableSettings />
				</>
			) : null}
		</div>
	);
}
