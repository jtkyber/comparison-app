import { toggleAutoResize } from '@/src/lib/features/user/settingsSlice';
import { useAppDispatch, useAppSelector } from '@/src/lib/hooks';
import React from 'react';
import ShrinkSVG from '../svg/settings_bar/shrink';
import Tooltip from '../tooltip/tooltip';
import styles from './table_settings_bar.module.css';

const TableSettings = () => {
	const dispatch = useAppDispatch();
	const settings = useAppSelector(state => state.settings);

	const handleAutoResizeBtn = () => dispatch(toggleAutoResize());

	return (
		<div className={styles.table_settings_bar_container}>
			<div className={styles.display_settings}>
				<Tooltip text='Automatically resize cells' delay={'default'}>
					<button
						onClick={handleAutoResizeBtn}
						className={`${styles.shrink_btn} ${settings.autoResize ? styles.active : null}`}>
						<ShrinkSVG />
					</button>
				</Tooltip>
			</div>
		</div>
	);
};

export default TableSettings;
