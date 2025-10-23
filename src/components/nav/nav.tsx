'use client';
import { setComparison } from '@/src/lib/features/comparison/comparisonSlice';
import { setUser } from '@/src/lib/features/userSlice';
import { useAppDispatch, useAppSelector } from '@/src/lib/hooks';
import { IComparisonItem } from '@/src/types/comparisons.types';
import { useEffect, useState } from 'react';
import Combobox from '../inputs/combobox/combobox';
import SpecialInput from '../inputs/special_input/special_input';
import Tooltip from '../tooltip/tooltip';
import styles from './nav.module.css';

const Nav = () => {
	const user = useAppSelector(state => state.user);
	const [selected, setSelected] = useState<string>('');
	const [addingNew, setAddingNew] = useState<boolean>(false);
	const [newComparisonName, setNewComparisonName] = useState<string>('');

	const dispatch = useAppDispatch();

	const setComparisonTable = async () => {
		const comparison: IComparisonItem | undefined = user.comparisons.find(c => c.id.toString() === selected);
		if (!comparison) return;

		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/comparisons/table`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				comparisonID: comparison.id,
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

	const getAndSetUser = async () => {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/comparisons/${4}`);
		const comparisons: IComparisonItem[] = await res.json();

		dispatch(
			setUser({
				id: 4,
				username: 'jtkyber',
				comparisons: comparisons,
			})
		);

		setSelected(comparisons.find(c => c.id === 1)?.id.toString() || '');
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
				userID: 4,
				name: newComparisonName,
			}),
		});
		const data = await res.json();

		if (data) {
			await setComparisonTable();
			setAddingNew(false);
		}
	};

	const setAddComparison = () => setAddingNew(true);
	const cancelAddComparison = () => setAddingNew(false);

	useEffect(() => {
		setComparisonTable();
	}, [selected]);

	useEffect(() => {
		getAndSetUser();
	}, []);

	return (
		<div className={styles.nav_container}>
			<div className={styles.comparison_dropdown_wrapper}>
				<Combobox
					options={user.comparisons.map(c => c.id.toString())}
					selected={selected}
					setSelected={setSelected}
					referenceTable={buildReferenceTable()}
				/>
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
							<Tooltip text='Cancel' key='cancel' delay={800}>
								<button onClick={cancelAddComparison} className={styles.cancel_add_comparison_btn}>
									X
								</button>
							</Tooltip>
							<Tooltip text='Add' key='add' delay={800}>
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
