'use client';
import { setComparison, setComparisonName } from '@/src/lib/features/comparison/comparisonSlice';
import { setSelectedComparison } from '@/src/lib/features/user/settingsSlice';
import { setUserComparisons } from '@/src/lib/features/user/userSlice';
import { useAppDispatch, useAppSelector } from '@/src/lib/hooks';
import { resetStore } from '@/src/lib/store';
import { endpoints } from '@/src/utils/api_calls';
import { setCookie } from '@/src/utils/cookies';
import { isNumeric } from '@/src/utils/general';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ErrorComponent from '../error/error';
import Combobox from '../inputs/combobox/combobox';
import SpecialInput from '../inputs/special_input/special_input';
import Tooltip from '../tooltip/tooltip';
import styles from './nav.module.css';

const Nav = () => {
	const user = useAppSelector(state => state.user);
	const { selectedComparison } = useAppSelector(state => state.settings);
	const comparisonName = useAppSelector(state => state.comparison.name);
	const [addingNew, setAddingNew] = useState<boolean>(false);
	const [newComparisonName, setNewComparisonName] = useState<string>('');
	const [error, setError] = useState<string>('');

	const dispatch = useAppDispatch();

	const router = useRouter();

	const pathname = usePathname();
	const onHomePath = pathname === '/';

	const setComparisonTable = async (id: number) => {
		const table = await endpoints.comparisons.getTable(id);

		dispatch(
			setComparison({
				id: table.id,
				name: table.name,
				attributes: table.attributes,
				entries: table.entries,
			})
		);
	};

	const getAndSetComparisonName = async (id: string) => {
		const fetchedComparisonName = await endpoints.comparisons.getName(id);
		dispatch(setComparisonName(fetchedComparisonName));
	};

	const buildReferenceTable = (): { [key: string]: string } => {
		const referenceTable: { [key: string]: string } = {};
		const comparisons = user.comparisons;

		for (let i = 0; i < comparisons.length; i++) {
			const id: string = comparisons[i].id.toString();
			const name: string = comparisons[i].name;

			referenceTable[id] = name;
		}

		return referenceTable;
	};

	const handleAddComparison = async () => {
		if (!newComparisonName.length || newComparisonName.length > 36) {
			setError('Name must be between 1 and 36 characters');
			return;
		}
		const { comparisons: fetchedComparisons, newComparisonID } = await endpoints.comparisons.add(
			user.id,
			newComparisonName
		);

		await setComparisonTable(newComparisonID);

		dispatch(setUserComparisons(fetchedComparisons));
		dispatch(setSelectedComparison(newComparisonID));
		setAddingNew(false);
	};

	const handleChangeComparison = async (idString: string) => {
		const id = parseInt(idString);
		if (id === selectedComparison) return;

		dispatch(setSelectedComparison(id));

		await setComparisonTable(id);

		await endpoints.settings.selectedComparison.set(user.id, id);
	};

	const handleLogout = () => {
		dispatch(resetStore());
		router.replace('/auth');
		setCookie('userID', '', -1);
	};

	const setAddComparison = () => setAddingNew(true);
	const cancelAddComparison = () => setAddingNew(false);

	useEffect(() => {
		if (onHomePath) return;
		const lastIndex = pathname.lastIndexOf('/');

		const beforeLast = pathname.slice(0, lastIndex);
		const afterLast = pathname.slice(lastIndex + 1);

		if (beforeLast === '/shared' && isNumeric(afterLast)) {
			getAndSetComparisonName(afterLast);
		}
	}, [pathname]);

	useEffect(() => {
		if (!addingNew) setError('');
	}, [addingNew]);

	return (
		<div className={styles.nav_container}>
			<div className={styles.left}>
				<Link href='/'>
					<h1 className={styles.app_name}>EasyCompare</h1>
				</Link>
			</div>
			<div className={styles.middle}>
				{onHomePath && user.id ? (
					<div className={styles.comparison_section}>
						<div className={styles.comparison_dropdown_wrapper}>
							<div className={styles.comparison_dropdown}>
								<Combobox
									options={user.comparisons.map(c => c.id.toString())}
									selected={selectedComparison.toString()}
									setSelected={handleChangeComparison}
									referenceTable={buildReferenceTable()}
								/>
							</div>
							<Tooltip text='Create new comparison' delay={'default'}>
								<button
									onClick={setAddComparison}
									className={`${styles.new_comparison_btn} ${
										!user.comparisons.length ? styles.pulse : null
									}`}>
									+
								</button>
							</Tooltip>
						</div>

						{addingNew ? (
							<div className={styles.new_comparison_container}>
								<div className={styles.new_comparison_modal}>
									<h3 className={styles.comparison_title}>New Comparison</h3>

									{error ? <ErrorComponent msg={'Name must be between 1 and 36 characters'} /> : null}

									<div className={styles.comparison_name_input}>
										<SpecialInput
											value={newComparisonName}
											setValue={setNewComparisonName}
											label='Name'
											inputType='string'
										/>
									</div>
									<div className={styles.comparison_modal_btn_section}>
										<Tooltip text='Cancel' key='cancel' delay='default'>
											<button onClick={cancelAddComparison} className={styles.cancel_add_comparison_btn}>
												X
											</button>
										</Tooltip>
										<Tooltip text='Add' key='add' delay='default'>
											<button onClick={handleAddComparison} className={styles.add_comparison_btn}>
												&#10003;
											</button>
										</Tooltip>
									</div>
								</div>
							</div>
						) : null}
					</div>
				) : (
					<h2 className={styles.comparison_name}>{comparisonName}</h2>
				)}
			</div>
			<div className={styles.right}>
				{user.id ? (
					<button onClick={handleLogout} className={styles.logout_btn}>
						Logout
					</button>
				) : null}
			</div>
		</div>
	);
};

export default Nav;
