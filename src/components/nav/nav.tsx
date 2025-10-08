'use client';

import { setAttributes } from '@/src/lib/features/attributes/attributesSlice';
import { setEntries } from '@/src/lib/features/entries/entriesSlice';
import { useAppDispatch } from '@/src/lib/hooks';
import { IComparison } from '@/src/types/comparisons';
import { useEffect, useState } from 'react';
import Combobox from '../combobox/combobox';
import styles from './nav.module.css';

const Nav = ({ comparisons }: { comparisons: IComparison[] }) => {
	const defaultComparison = comparisons[0];

	const [selectedID, setSelectedID] = useState<string>(defaultComparison.id.toString());

	const dispatch = useAppDispatch();

	const getComparisonTable = async () => {
		const comparison: IComparison | undefined = comparisons.find(c => c.id.toString() === selectedID);
		if (!comparison) return;

		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/table`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				attributeIDs: comparison.attributes,
				entryIDs: comparison.entries,
			}),
		});

		const data = await res.json();
		dispatch(setAttributes(data.attributes));
		dispatch(setEntries(data.entries));
	};

	useEffect(() => {
		getComparisonTable();
	}, [selectedID]);

	return (
		<div className={styles.nav_container}>
			<div className={styles.comparison_dropdown}>
				<Combobox
					width='20rem'
					height='2rem'
					defaultValue={defaultComparison.name}
					values={comparisons.map(c => c.name)}
					ids={comparisons.map(c => c.id)}
					setSelectedID={setSelectedID}
				/>
			</div>
		</div>
	);
};

export default Nav;
