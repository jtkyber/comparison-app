import { TableManagerMode } from '@/src/types/table_manager.types';
import React, { MouseEventHandler, useState } from 'react';
import styles from './table_manager.module.css';

const TableManager = () => {
	const [mode, setMode] = useState<TableManagerMode>('attributes');

	const switchMode: MouseEventHandler<HTMLButtonElement> = e => {
		const id: string = (e.target as HTMLButtonElement).id;

		switch (id) {
			case 'attributes_tab':
				setMode('attributes');
				break;
			case 'entries_tab':
				setMode('entries');
				break;
		}
	};

	return (
		<div className={styles.table_manager_container}>
			<div className={styles.tool_section}></div>
			<div className={styles.tab_section}>
				<button
					id='attributes_tab'
					onClick={switchMode}
					className={`${styles.tab} ${mode === 'attributes' ? styles.active : null}`}>
					Attributes
				</button>
				<button
					id='entries_tab'
					onClick={switchMode}
					className={`${styles.tab} ${mode === 'entries' ? styles.active : null}`}>
					Entries
				</button>
				<div className={styles.empty_space}></div>
			</div>
			<div className={styles.manager_section}></div>
		</div>
	);
};

export default TableManager;
