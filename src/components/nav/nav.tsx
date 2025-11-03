'use client';
import { setComparison } from '@/src/lib/features/comparison/comparisonSlice';
import { ISettings, setSelectedComparison, setSettings } from '@/src/lib/features/user/settingsSlice';
import { setUser, setUserComparisons } from '@/src/lib/features/user/userSlice';
import { useAppDispatch, useAppSelector } from '@/src/lib/hooks';
import { IComparisonItem } from '@/src/types/comparisons.types';
import { IUser } from '@/src/types/user.types';
import { useEffect, useState } from 'react';
import Combobox from '../inputs/combobox/combobox';
import SpecialInput from '../inputs/special_input/special_input';
import Tooltip from '../tooltip/tooltip';
import styles from './nav.module.css';

const Nav = () => {
	const user = useAppSelector(state => state.user);
	const { selectedComparison } = useAppSelector(state => state.settings);
	const [addingNew, setAddingNew] = useState<boolean>(false);
	const [newComparisonName, setNewComparisonName] = useState<string>('');

	const dispatch = useAppDispatch();

	const setComparisonTable = async () => {
		if (selectedComparison <= 0) return;

		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/comparisons/table`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				comparisonID: selectedComparison,
			}),
		});

		const data = await res.json();

		dispatch(
			setComparison({
				id: data.id,
				name: data.name,
				attributes: data.attributes,
				entries: data.entries,
			})
		);
	};

	const getAndSetUserData = async () => {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username: 'bob',
				password: 'testing123',
			}),
		});
		const userData = await res.json();

		if (userData.user && userData.settings) {
			const { user, settings }: { user: IUser; settings: ISettings } = userData;
			if (user.comparisons.length && settings.selectedComparison === 0) {
				settings.selectedComparison = user.comparisons[0].id;
			}

			dispatch(setUser(user));
			dispatch(setSettings(settings));
		}
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
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/comparisons/addComparison`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userID: user.id,
				name: newComparisonName,
			}),
		});
		const data = await res.json();

		if (data) {
			const comparisons: IComparisonItem[] = data;
			dispatch(setUserComparisons(comparisons));

			if (data.length === 1) dispatch(setSelectedComparison(data[0].id));
			else await setComparisonTable();
			setAddingNew(false);
		}
	};

	const handleChangeComparison = async (idString: string) => {
		const id = parseInt(idString);

		dispatch(setSelectedComparison(id));

		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/setSelectedComparison`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userID: 4,
				comparisonID: id,
			}),
		});
		const data = await res.json();

		if (!data) {
			console.log('Could not update selected comparisonID');
		}
	};

	const setAddComparison = () => setAddingNew(true);
	const cancelAddComparison = () => setAddingNew(false);

	useEffect(() => {
		setComparisonTable();
	}, [selectedComparison]);

	useEffect(() => {
		getAndSetUserData();
	}, []);

	return (
		<div className={styles.nav_container}>
			<div className={styles.comparison_dropdown_wrapper}>
				<div className={styles.comparison_dropdown}>
					<Combobox
						options={user.comparisons.map(c => c.id.toString())}
						selected={selectedComparison.toString()}
						setSelected={handleChangeComparison}
						referenceTable={buildReferenceTable()}
					/>
				</div>
				<button onClick={setAddComparison} className={styles.new_comparison_btn}>
					+
				</button>
			</div>

			{addingNew ? (
				<div className={styles.new_comparison_container}>
					<div className={styles.new_comparison_modal}>
						<h3 className={styles.comparison_title}>New Comparison</h3>
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
	);
};

export default Nav;
