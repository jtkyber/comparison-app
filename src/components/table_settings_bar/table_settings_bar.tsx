'use client';
import { setComparison } from '@/src/lib/features/comparison/comparisonSlice';
import { setDownloading } from '@/src/lib/features/comparison/displaySlice';
import {
	setSelectedComparison,
	toggleColorCellsByRating,
	toggleFitColMin,
} from '@/src/lib/features/user/settingsSlice';
import { removeComparison } from '@/src/lib/features/user/userSlice';
import { useAppDispatch, useAppSelector } from '@/src/lib/hooks';
import { endpoints } from '@/src/utils/api_calls';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import DeleteSVG from '../svg/action_center/delete.svg';
import CheckSVG from '../svg/settings_bar/check.svg';
import ColorCellsSVG from '../svg/settings_bar/color_cells';
import CopySVG from '../svg/settings_bar/copy';
import DownloadSVG from '../svg/settings_bar/download';
import ShrinkSVG from '../svg/settings_bar/shrink';
import Tooltip from '../tooltip/tooltip';
import styles from './table_settings_bar.module.css';

const TableSettings = () => {
	const dispatch = useAppDispatch();
	const { id: userID } = useAppSelector(state => state.user);
	const { fitColMin, colorCellsByRating, selectedComparison } = useAppSelector(state => state.settings);
	const { downloading } = useAppSelector(state => state.display);

	const handleAutoResizeBtn = () => dispatch(toggleFitColMin());
	const handleColorCellsByRatingBtn = () => dispatch(toggleColorCellsByRating());
	const handleDownloadBtn = () => dispatch(setDownloading(true));

	const [copied, setCopied] = useState<boolean>(false);

	const onHomePath = usePathname() === '/';

	const setfitColMinInDB = async () => {
		if (!userID) return;
		await endpoints.settings.fitColMin.set(userID, fitColMin);
	};

	const setColorCellsByRatingInDB = async () => {
		if (!userID) return;
		await endpoints.settings.colorCellsByRating.set(userID, colorCellsByRating);
	};

	const copyShareLinkToClipboard = async () => {
		const baseURL = window.location.origin;
		await navigator.clipboard.writeText(`${baseURL}/shared/${selectedComparison}`);

		setCopied(true);
		setTimeout(() => {
			setCopied(false);
		}, 2000);
	};

	const removeComparisonFromDB = async () => {
		const comparisonToRemove = selectedComparison;

		const firstComparison = await endpoints.comparisons.delete(comparisonToRemove);

		dispatch(setSelectedComparison(firstComparison.id));
		dispatch(removeComparison(comparisonToRemove));
	};

	const handleDeleteBtn = () => {
		const isConfirmed = window.confirm('Are you sure you want to permanently delete this comparison?');
		if (isConfirmed) removeComparisonFromDB();
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
					<Tooltip text='Color cells based on their rating' delay={'default'}>
						<button
							onClick={handleColorCellsByRatingBtn}
							className={`${styles.color_cells_btn} ${colorCellsByRating ? styles.active : null}`}>
							<ColorCellsSVG />
						</button>
					</Tooltip>
					<Tooltip text='Shrink columns to smallest possible size' delay={'default'}>
						<button
							onClick={handleAutoResizeBtn}
							className={`${styles.shrink_btn} ${fitColMin ? styles.active : null}`}>
							<ShrinkSVG />
						</button>
					</Tooltip>
				</div>

				<div className={styles.setting_section}>
					<Tooltip text='Download table as PDF' delay={'default'}>
						<button disabled={downloading} onClick={handleDownloadBtn} className={`${styles.download_btn}`}>
							<DownloadSVG />
						</button>
					</Tooltip>

					{onHomePath ? (
						copied ? (
							<div className={styles.copied_check}>
								<CheckSVG />
							</div>
						) : (
							<Tooltip text='Copy link for sharing' delay={'default'}>
								<button onClick={copyShareLinkToClipboard} className={`${styles.copy_btn}`}>
									<CopySVG />
								</button>
							</Tooltip>
						)
					) : null}
				</div>

				<div className={styles.setting_section}>
					{onHomePath ? (
						<Tooltip text='Delete Comparison' delay={'default'}>
							<button onClick={handleDeleteBtn} className={`${styles.delete_btn}`}>
								<DeleteSVG />
							</button>
						</Tooltip>
					) : null}
				</div>
			</div>
		</div>
	);
};

export default TableSettings;
