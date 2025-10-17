import { setEntryName, setEntryRating, setEntryValue } from '@/src/lib/features/comparison/comparisonSlice';
import { useAppDispatch, useAppSelector } from '@/src/lib/hooks';
import React, { ChangeEvent } from 'react';
import SectionLabel from '../../inputs/section_label/section_label';
import SpecialInput from '../../inputs/special_input/special_input';

import RatingSlider from '../../inputs/rating_slider/rating_slider';
import Tooltip from '../../tooltip/tooltip';
import styles from './entry_edit.module.css';
const EntryEdit = ({ entryIndex }: { entryIndex: number }) => {
	const attributes = useAppSelector(state => state.comparison.attributes);
	const entry = useAppSelector(state => state.comparison.entries[entryIndex]);

	const dispatch = useAppDispatch();

	const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
		const target = e?.target as HTMLInputElement;
		if (!target) return;

		dispatch(setEntryName({ index: entryIndex, value: target.value }));
	};

	const handleValueChange = (valueKey: number) => (value: string) => {
		dispatch(setEntryValue({ index: entryIndex, valueKey: valueKey, value: value }));
	};

	const handleRatingChange = (valueKey: number) => (rating: number) => {
		dispatch(setEntryRating({ index: entryIndex, valueKey: valueKey, rating: rating }));
	};

	const handleRadioValueChange = (valueKey: number) => (e: ChangeEvent<HTMLInputElement>) => {
		const target = e?.target as HTMLInputElement;
		if (!target) return;

		dispatch(
			setEntryValue({
				index: entryIndex,
				valueKey: valueKey,
				value: target.id === 'yesValue',
			})
		);
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

						<div className={styles.input_section}>
							<h5 className={styles.prefix}>{attr.prefix}</h5>
							{attr.type === 'text' || attr.type === 'number' || attr.type === 'link' ? (
								<div className={styles.value_input_wrapper}>
									<SpecialInput
										value={entry.cells?.[attr.id]?.value?.toString() || ''}
										setValue={handleValueChange(attr.id)}
										label={`Enter ${attr.type}`}
										inputType={attr.type === 'number' ? 'number' : 'string'}
									/>
								</div>
							) : attr.type === 'yesNo' ? (
								<div className={styles.boolean_value_input_wrapper}>
									<div className={styles.radio_input}>
										<label htmlFor='yesValue'>Yes</label>
										<input
											name='boolean_value_input'
											id='yesValue'
											type='radio'
											checked={
												entry.cells?.[attr.id]?.value === true || entry.cells?.[attr.id]?.value === undefined
											}
											onChange={handleRadioValueChange(attr.id)}
										/>
									</div>
									<div className={styles.radio_input}>
										<label htmlFor='noValue'>No</label>
										<input
											name='boolean_value_input'
											id='noValue'
											type='radio'
											checked={entry.cells?.[attr.id]?.value === false}
											onChange={handleRadioValueChange(attr.id)}
										/>
									</div>
								</div>
							) : null}
							<h5 className={styles.suffix}>{attr.suffix}</h5>
						</div>
						{attr.type === 'text' && attr.selfRated ? (
							<div className={styles.rating_input_section}>
								<div className={styles.rating_input_wrapper}>
									<RatingSlider
										rating={entry.cells?.[attr.id]?.rating || 5}
										setRating={handleRatingChange(attr.id)}
									/>
								</div>
							</div>
						) : null}
					</div>
				))}
			</div>
		</div>
	);
};

export default EntryEdit;
