import { setEntryName, setEntryRating, setEntryValue } from '@/src/lib/features/comparison/comparisonSlice';
import { setHighlightedEntry } from '@/src/lib/features/comparison/displaySlice';
import { IManager, setEditingIndex, setEntryAttributeID } from '@/src/lib/features/comparison/managerSlice';
import { useAppDispatch, useAppSelector } from '@/src/lib/hooks';
import { IEntryValidation } from '@/src/types/validation.types';
import { validateEntry } from '@/src/validation/table_manager.val';
import { useDebounceCallback } from '@react-hook/debounce';
import React, { ChangeEvent, useEffect, useRef } from 'react';
import ErrorComponent from '../../error/error';
import Combobox from '../../inputs/combobox/combobox';
import RatingSlider from '../../inputs/rating_slider/rating_slider';
import SectionLabel from '../../inputs/section_label/section_label';
import SpecialInput from '../../inputs/special_input/special_input';
import styles from './entry_edit.module.css';

const EntryEdit = ({
	validation,
	setValidation,
}: {
	validation: IEntryValidation;
	setValidation: React.Dispatch<React.SetStateAction<IEntryValidation>>;
}) => {
	const { editingIndex, entryAttributeID } = useAppSelector(state => state.manager);
	const attributes = useAppSelector(state => state.comparison.attributes);
	const entries = useAppSelector(state => state.comparison.entries);

	const entryIndex = editingIndex !== null && editingIndex >= 0 ? editingIndex : entries.length - 1;
	const entry = entries[entryIndex];

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
			const { id: attrID, type: attrType, textRatingType } = attr;
			const rating = entry.cells[attrID]?.rating;
			if ((rating === null || rating === undefined) && attrType == 'text' && textRatingType === 'selfrated') {
				handleRatingChange(attrID)(5);
			}
		}
	};

	const setDefaultRadioValues = (): void => {
		for (const attr of attributes) {
			const { id: attrID, type: attrType } = attr;

			if (
				attrType === 'yesNo' &&
				(entry.cells[attrID]?.value === null || entry.cells[attrID]?.value === undefined)
			) {
				dispatch(
					setEntryValue({
						index: entryIndex,
						valueKey: attrID,
						value: true,
					})
				);
			}
		}
	};

	const validate = useDebounceCallback(() => {
		const val = validateEntry(entry, attributes);
		setValidation(val.valObj);
	}, 500);

	useEffect(() => {
		setDefaultTextRatings();
		setDefaultRadioValues();

		return () => {
			dispatch(setEntryAttributeID(null));
		};
	}, []);

	useEffect(() => {
		const el = document.getElementById('attr-' + entryAttributeID);

		if (el) {
			el.scrollIntoView({
				behavior: 'instant',
			});

			setTimeout(() => {
				el?.classList.add(styles.highlighted);
				setTimeout(() => {
					el?.classList.remove(styles.highlighted);
				}, 1500);
			}, 500);
		}
	}, [entryIndex, entryAttributeID]);

	useEffect(() => {
		validate();
	}, [entry]);

	useEffect(() => {
		dispatch(setHighlightedEntry(entry.id));
	}, [entry.id]);

	useEffect(() => {
		dispatch(setHighlightedEntry(entry.id));

		return () => {
			dispatch(setHighlightedEntry(0));
		};
	}, []);

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
					const { name: attrName, type: attrType, id: attrID } = attr;
					const keyRatingPairKeys = attr.keyRatingPairs.map(pair => pair.key);
					const rating = entry.cells?.[attrID]?.rating;
					return (
						<div key={attrID} id={'attr-' + attrID} className={styles.entry_attribute_section}>
							<div className={styles.section_label_wrapper}>
								<SectionLabel text={attrName} />
							</div>

							<ErrorComponent msg={validation.cells[attrID]} />

							{attrType !== 'score' ? (
								<div className={styles.input_section}>
									<h5 className={styles.prefix}>{attr.prefix}</h5>
									{(attrType === 'text' && attr.textRatingType !== 'keyratingpairs') ||
									attrType === 'number' ||
									attrType === 'link' ? (
										<div className={styles.value_input_wrapper}>
											<SpecialInput
												value={entry.cells?.[attrID]?.value?.toString() || ''}
												setValue={handleValueChange(attrID)}
												label={`Enter ${attrType}`}
												inputType={attrType === 'number' ? 'number' : 'string'}
											/>
										</div>
									) : attrType === 'text' && attr.textRatingType === 'keyratingpairs' ? (
										<div className={styles.textNamePicker}>
											<Combobox
												options={keyRatingPairKeys}
												selected={entry.cells[attrID]?.value?.toString() || ''}
												setSelected={handleValueChange(attrID)}
											/>
										</div>
									) : attrType === 'yesNo' ? (
										<div className={styles.boolean_value_input_wrapper}>
											<div className={styles.radio_input}>
												<label htmlFor={attrID + 'yesValue'}>Yes</label>
												<input
													name={attrID + 'boolean_value_input'}
													className={styles.yes_no_input}
													id={attrID + 'yesValue'}
													type='radio'
													checked={
														entry.cells?.[attrID]?.value === true ||
														entry.cells?.[attrID]?.value === undefined
													}
													onChange={handleRadioValueChange(attrID)}
												/>
											</div>
											<div className={styles.radio_input}>
												<label htmlFor={attrID + 'noValue'}>No</label>
												<input
													name={attrID + 'boolean_value_input'}
													className={styles.yes_no_input}
													id={attrID + 'noValue'}
													type='radio'
													checked={entry.cells?.[attrID]?.value === false}
													onChange={handleRadioValueChange(attrID)}
												/>
											</div>
										</div>
									) : null}
									<h5 className={styles.suffix}>{attr.suffix}</h5>
								</div>
							) : null}
							{attrType === 'score' || (attrType === 'text' && attr.textRatingType === 'selfrated') ? (
								<div className={styles.rating_input_section}>
									<div
										className={`${styles.rating_input_wrapper} ${
											attrType === 'score' ? styles.score : null
										}`}>
										<RatingSlider rating={rating ?? -1} setRating={handleRatingChange(attrID)} />
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
