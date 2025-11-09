'use client';
import { setDownloading } from '@/src/lib/features/comparison/displaySlice';
import { toggleColorCellsByRating, toggleFitColMin } from '@/src/lib/features/user/settingsSlice';
import { useAppDispatch, useAppSelector } from '@/src/lib/hooks';
import React, { useEffect } from 'react';
import ColorCellsSVG from '../svg/settings_bar/color_cells';
import DownloadSVG from '../svg/settings_bar/download';
import ShrinkSVG from '../svg/settings_bar/shrink';
import Tooltip from '../tooltip/tooltip';
import styles from './table_settings_bar.module.css';

const TableSettings = () => {
	const dispatch = useAppDispatch();
	const { id: userID } = useAppSelector(state => state.user);
	const { fitColMin, colorCellsByRating } = useAppSelector(state => state.settings);
	const { downloading } = useAppSelector(state => state.display);

	const handleAutoResizeBtn = () => dispatch(toggleFitColMin());
	const handleColorCellsByRatingBtn = () => dispatch(toggleColorCellsByRating());
	const handleDownloadBtn = () => dispatch(setDownloading(true));

	const setfitColMinInDB = async () => {
		if (!userID) return;

		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/settings/setAutoResize`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userID: userID,
				fitColMin: fitColMin,
			}),
		});
		const data = await res.json();

		if (!data) {
			console.log('Could not update fitColMin in DB');
		}
	};

	const setColorCellsByRatingInDB = async () => {
		if (!userID) return;

		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/settings/setColorCellsByRating`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userID: userID,
				colorCellsByRating: colorCellsByRating,
			}),
		});
		const data = await res.json();

		if (!data) {
			console.log('Could not update colorCellsByRating in DB');
		}
	};

	useEffect(() => {
		setfitColMinInDB();
	}, [fitColMin]);

	useEffect(() => {
		setColorCellsByRatingInDB();
	}, [colorCellsByRating]);

	return (
		<div className={styles.table_settings_bar_container}>
			<div className={styles.display_settings}>
				<div className={styles.setting_section}>
					<Tooltip text='Shrink columns to smallest possible size' delay={'default'}>
						<button
							onClick={handleAutoResizeBtn}
							className={`${styles.shrink_btn} ${fitColMin ? styles.active : null}`}>
							<ShrinkSVG />
						</button>
					</Tooltip>
				</div>

				<div className={styles.setting_section}>
					<Tooltip text='Color cells based on their rating' delay={'default'}>
						<button
							onClick={handleColorCellsByRatingBtn}
							className={`${styles.color_cells_btn} ${colorCellsByRating ? styles.active : null}`}>
							<ColorCellsSVG />
						</button>
					</Tooltip>
				</div>
				<div className={styles.setting_section}>
					<Tooltip text='Download table as PDF' delay={'default'}>
						<button disabled={downloading} onClick={handleDownloadBtn} className={`${styles.download_btn}`}>
							<DownloadSVG />
						</button>
					</Tooltip>
				</div>
			</div>
		</div>
	);
};

export default TableSettings;
