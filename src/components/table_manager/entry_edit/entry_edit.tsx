import { setEntryName, setEntryRating, setEntryValue } from '@/src/lib/features/comparison/comparisonSlice';
import { IManager } from '@/src/lib/features/comparison/managerSlice';
import { useAppDispatch, useAppSelector } from '@/src/lib/hooks';
import React, { ChangeEvent, useEffect, useRef } from 'react';
import Combobox from '../../inputs/combobox/combobox';
import RatingSlider from '../../inputs/rating_slider/rating_slider';
import SectionLabel from '../../inputs/section_label/section_label';
import SpecialInput from '../../inputs/special_input/special_input';
import styles from './entry_edit.module.css';

const EntryEdit = () => {
	const { editingIndex: entryIndex, entryAttributeID } = useAppSelector(
		state => state.manager
	) as Partial<IManager> & { editingIndex: number };
	const attributes = useAppSelector(state => state.comparison.attributes);
	const entry = useAppSelector(state => state.comparison.entries[entryIndex]);

	const dispatch = useAppDispatch();

	const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
		const target = e?.target as HTMLInputElement;
		if (!target) return;

		dispatch(setEntryName({ index: entryIndex, value: target.value }));
	};

	const handleValueChange = (attrID: number) => (value: string) => {
		dispatch(setEntryValue({ index: entryIndex, valueKey: attrID, value: value }));
	};

	const handleRatingChange = (attrID: number) => (rating: number) => {
		dispatch(setEntryRating({ index: entryIndex, attrID: attrID, rating: rating }));
	};

	const handleRadioValueChange = (attrID: number) => (e: ChangeEvent<HTMLInputElement>) => {
		const target = e?.target as HTMLInputElement;
		if (!target) return;

		dispatch(
			setEntryValue({
				index: entryIndex,
				valueKey: attrID,
				value: target.id === attrID + 'yesValue',
			})
		);
	};

	const setDefaultTextRatings = (): void => {
		for (const attr of attributes) {
			const rating = entry.cells[attr.id]?.rating;
			if (
				(rating === null || rating === undefined) &&
				attr.type == 'text' &&
				attr.textRatingType === 'selfrated'
			) {
				handleRatingChange(attr.id)(5);
			}
		}
	};

	const setDefaultRadioValues = (): void => {
		for (const attr of attributes) {
			if (
				attr.type === 'yesNo' &&
				(entry.cells[attr.id]?.value === null || entry.cells[attr.id]?.value === undefined)
			) {
				dispatch(
					setEntryValue({
						index: entryIndex,
						valueKey: attr.id,
						value: true,
					})
				);
			}
		}
	};

	useEffect(() => {
		setDefaultTextRatings();
		setDefaultRadioValues();
	}, []);

	useEffect(() => {
		const el = document.getElementById('attr-' + entryAttributeID);
		setTimeout(() => {
			if (el)
				el.scrollIntoView({
					behavior: 'smooth',
				});
		}, 100);
	}, [entryIndex, entryAttributeID]);

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
				{attributes.map(attr => {
					const keyRatingPairKeys = attr.keyRatingPairs.map(pair => pair.key);
					const rating = entry.cells?.[attr.id]?.rating;
					return (
						<div key={attr.id} id={'attr-' + attr.id} className={styles.entry_attribute_section}>
							<SectionLabel text={attr.name} color='var(--color-grey0)' />

							<div className={styles.input_section}>
								<h5 className={styles.prefix}>{attr.prefix}</h5>
								{(attr.type === 'text' && attr.textRatingType !== 'keyratingpairs') ||
								attr.type === 'number' ||
								attr.type === 'link' ? (
									<div className={styles.value_input_wrapper}>
										<SpecialInput
											value={entry.cells?.[attr.id]?.value?.toString() || ''}
											setValue={handleValueChange(attr.id)}
											label={`Enter ${attr.type}`}
											inputType={attr.type === 'number' ? 'number' : 'string'}
										/>
									</div>
								) : attr.type === 'text' && attr.textRatingType === 'keyratingpairs' ? (
									<div className={styles.textNamePicker}>
										<Combobox
											options={keyRatingPairKeys}
											selected={entry.cells[attr.id]?.value?.toString() || ''}
											setSelected={handleValueChange(attr.id)}
										/>
									</div>
								) : attr.type === 'yesNo' ? (
									<div className={styles.boolean_value_input_wrapper}>
										<div className={styles.radio_input}>
											<label htmlFor={attr.id + 'yesValue'}>Yes</label>
											<input
												name={attr.id + 'boolean_value_input'}
												className={styles.yes_no_input}
												id={attr.id + 'yesValue'}
												type='radio'
												checked={
													entry.cells?.[attr.id]?.value === true ||
													entry.cells?.[attr.id]?.value === undefined
												}
												onChange={handleRadioValueChange(attr.id)}
											/>
										</div>
										<div className={styles.radio_input}>
											<label htmlFor={attr.id + 'noValue'}>No</label>
											<input
												name={attr.id + 'boolean_value_input'}
												className={styles.yes_no_input}
												id={attr.id + 'noValue'}
												type='radio'
												checked={entry.cells?.[attr.id]?.value === false}
												onChange={handleRadioValueChange(attr.id)}
											/>
										</div>
									</div>
								) : null}
								<h5 className={styles.suffix}>{attr.suffix}</h5>
							</div>
							{attr.type === 'text' &&
							attr.textRatingType === 'selfrated' &&
							rating !== null &&
							rating !== undefined ? (
								<div className={styles.rating_input_section}>
									<div className={styles.rating_input_wrapper}>
										<RatingSlider rating={rating} setRating={handleRatingChange(attr.id)} />
									</div>
								</div>
							) : null}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default EntryEdit;
