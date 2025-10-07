import { IComparison } from '@/src/types/comparisons';
import Combobox from '../combobox/combobox';
import styles from './nav.module.css';

const Nav = ({ comparisons }: { comparisons: IComparison[] }) => {
	return (
		<div className={styles.nav_container}>
			<div className={styles.comparison_dropdown}>
				<Combobox options={comparisons.map(c => c.name)} width='20rem' height='2rem' />
			</div>
		</div>
	);
};

export default Nav;
