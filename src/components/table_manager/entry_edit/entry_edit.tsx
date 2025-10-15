import { useAppDispatch, useAppSelector } from '@/src/lib/hooks';
import styles from './entry_edit.module.css';

import { setEntryName } from '@/src/lib/features/comparison/comparisonSlice';
import React, { ChangeEvent } from 'react';
import SectionLabel from '../../inputs/section_label/section_label';

const EntryEdit = ({ entryIndex }: { entryIndex: number }) => {
	const attributes = useAppSelector(state => state.comparison.attributes);
	const entry = useAppSelector(state => state.comparison.entries[entryIndex]);
	console.log(entry);

	const dispatch = useAppDispatch();

	const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
		const target = e?.target as HTMLInputElement;
		if (!target) return;

		dispatch(setEntryName({ index: entryIndex, value: target.value }));
	};

	return (
		<div className={styles.entry_edit_container}>
			<div className={styles.name_input_section}>
				<input
					onChange={handleNameChange}
					id='name_input'
					type='text'
					placeholder='Enter Name'
					className={styles.name_input}
					autoComplete='off'
					value={entry.name ?? ''}
				/>
			</div>

			<div className={styles.entry_attributes}>
				{attributes.map(attr => (
					<div key={attr.id} className={styles.entry_attribute_section}>
						<SectionLabel text={attr.name} color='var(--color-grey0)' />
					</div>
				))}
			</div>
		</div>
	);
};

export default EntryEdit;
