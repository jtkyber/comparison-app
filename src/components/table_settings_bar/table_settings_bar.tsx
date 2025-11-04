import { toggleAutoResize } from '@/src/lib/features/user/settingsSlice';
import { useAppDispatch, useAppSelector } from '@/src/lib/hooks';
import React, { useEffect } from 'react';
import ShrinkSVG from '../svg/settings_bar/shrink';
import Tooltip from '../tooltip/tooltip';
import styles from './table_settings_bar.module.css';

const TableSettings = () => {
	const dispatch = useAppDispatch();
	const { id: userID } = useAppSelector(state => state.user);
	const { autoResize } = useAppSelector(state => state.settings);

	const handleAutoResizeBtn = () => dispatch(toggleAutoResize());

	const setAutoResizeInDB = async () => {
		if (!userID) return;

		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/setAutoResize`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userID: userID,
				autoResize: autoResize,
			}),
		});
		const data = await res.json();

		if (!data) {
			console.log('Could not update auto resize value in DB');
		}
	};

	useEffect(() => {
		setAutoResizeInDB();
	}, [autoResize]);

	return (
		<div className={styles.table_settings_bar_container}>
			<div className={styles.display_settings}>
				<Tooltip text='Automatically resize cells' delay={'default'}>
					<button
						onClick={handleAutoResizeBtn}
						className={`${styles.shrink_btn} ${autoResize ? styles.active : null}`}>
						<ShrinkSVG />
					</button>
				</Tooltip>
			</div>
		</div>
	);
};

export default TableSettings;
