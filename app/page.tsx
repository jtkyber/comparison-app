import TableManager from './_table_manager/table_manager';
import styles from './page.module.css';

export default function Home() {
	return (
		<div className={styles.page}>
			<TableManager />
		</div>
	);
}
