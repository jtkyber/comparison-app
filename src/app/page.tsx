'use client';
import TableDisplay from '../components/table_display/table_display';
import TableManager from '../components/table_manager/table_manager';
import styles from './page.module.css';

export default function Home() {
	return (
		<div className={styles.page}>
			<TableManager />
			<TableDisplay />
		</div>
	);
}
