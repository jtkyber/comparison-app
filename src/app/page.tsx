'use client';
import { useEffect } from 'react';
import TableDisplay from '../components/table_display/table_display';
import TableManager from '../components/table_manager/table_manager';
import TableSettings from '../components/table_settings_bar/table_settings_bar';
import { useAppSelector } from '../lib/hooks';
import styles from './page.module.css';

declare global {
	interface Window {
		tooltipDelay: number;
	}
}

export default function Home() {
	const { attributes, entries } = useAppSelector(state => state.comparison);

	useEffect(() => {
		window.tooltipDelay = 800;
	}, []);

	return (
		<div className={styles.page}>
			<TableManager />
			<TableDisplay attributes={attributes} entries={entries} />
			<TableSettings />
		</div>
	);
}
