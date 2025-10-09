'use client';
import { setAttributes } from '@/src/lib/features/attributes/attributesSlice';
import { setEntries } from '@/src/lib/features/entries/entriesSlice';
import { useAppDispatch } from '@/src/lib/hooks';
import { IComparison } from '@/src/types/comparisons.types';
import { useEffect, useState } from 'react';
import Combobox from '../inputs/combobox/combobox';
import styles from './nav.module.css';

const Nav = ({ comparisons }: { comparisons: IComparison[] }) => {
	const [selected, setSelected] = useState<string>(comparisons[0].id.toString());

	const dispatch = useAppDispatch();

	const getComparisonTable = async () => {
		const comparison: IComparison | undefined = comparisons.find(c => c.id.toString() === selected);
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

	const buildReferenceTable = (): { [key: string]: string } => {
		const referenceTable: { [key: string]: string } = {};

		for (let i = 0; i < comparisons.length; i++) {
			const id: string = comparisons[i].id.toString();
			const name: string = comparisons[i].name;

			referenceTable[id] = name;
		}

		return referenceTable;
	};

	useEffect(() => {
		getComparisonTable();
	}, [selected]);

	return (
		<div className={styles.nav_container}>
			<div className={styles.comparison_dropdown}>
				<Combobox
					options={comparisons.map(c => c.id.toString())}
					selected={selected}
					setSelected={setSelected}
					referenceTable={buildReferenceTable()}
				/>
			</div>
		</div>
	);
};

export default Nav;
