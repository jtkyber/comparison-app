import Dropdown from '@/src/components/inputs/dropdown/dropdown';
import SpecialInput from '@/src/components/inputs/special_input/special_input';
import Info from '@/src/components/svg/info.svg';
import Tooltip from '@/src/components/tooltip/tooltip';
import {
	addKeyRatingPair,
	removeKeyRatingPair,
	setAttributeBestIndex,
	setAttributeImportance,
	setAttributeKeyRatingPairKey,
	setAttributeKeyRatingPairRating,
	setAttributeName,
	setAttributePrefix,
	setAttributeRangeLength,
	setAttributeRangeValue,
	setAttributeSuffix,
	setAttributeTextRatingType,
	setAttributeType,
	setEntryValuesForAttribute,
} from '@/src/lib/features/comparison/comparisonSlice';
import { setHighlightedAttribute } from '@/src/lib/features/comparison/displaySlice';
import { useAppDispatch, useAppSelector } from '@/src/lib/hooks';
import {
	AttributeType,
	attributeTypeList,
	attributeTypeListDisplayed,
	TextRating,
} from '@/src/types/attributes.types';
import { IAttributeValidation } from '@/src/types/validation.types';
import { validateAttribute } from '@/src/validation/table_manager.val';
import { useDebounceCallback } from '@react-hook/debounce';
import React, { ChangeEvent, useEffect, useState } from 'react';
import ErrorComponent from '../../error/error';
import RatingSlider from '../../inputs/rating_slider/rating_slider';
import SectionLabel from '../../inputs/section_label/section_label';
import AddSVG from '../../svg/action_center/add.svg';
import DeleteSVG from '../../svg/action_center/delete.svg';
import styles from './attribute_edit.module.css';

const AttributeEdit = ({
	validation,
	setValidation,
}: {
	validation: IAttributeValidation;
	setValidation: React.Dispatch<React.SetStateAction<IAttributeValidation>>;
}) => {
	const editingIndex = useAppSelector(state => state.manager.editingIndex) as number;
	const attributes = useAppSelector(state => state.comparison.attributes);
	const attributeIndex = editingIndex !== null && editingIndex >= 0 ? editingIndex : attributes.length - 1;
	const attribute = attributes[attributeIndex];

	const dispatch = useAppDispatch();

	const setPrefix = (value: string) => {
		dispatch(setAttributePrefix({ index: attributeIndex, value: value }));
	};

	const setSuffix = (value: string) => {
		dispatch(setAttributeSuffix({ index: attributeIndex, value: value }));
	};

	const setType = (type: AttributeType) => {
		if (type === 'link') {
			dispatch(
				setEntryValuesForAttribute({
					attrID: attribute.id,
					value: 'javascript:void(0);',
				})
			);
		}
		dispatch(setAttributeType({ index: attributeIndex, value: type }));
	};

	const setRange = (rangeIndex: 0 | 1 | 2) => (value: number) => {
		dispatch(setAttributeRangeValue({ index: attributeIndex, rangeIndex: rangeIndex, value: value }));
	};

	const setImportance = (value: number) => {
		dispatch(setAttributeImportance({ index: attributeIndex, value: value }));
	};

	const [rangeErrorIndex, setRangeErrorIndex] = useState<number>(-1);

	const handle_name_change = (e: ChangeEvent<HTMLInputElement>) => {
		const target = e?.target as HTMLInputElement;
		if (!target) return;

		dispatch(setAttributeName({ index: attributeIndex, value: target.value }));
	};

	const handle_range_type_selection = (e: ChangeEvent<HTMLInputElement>) => {
		const target = e?.target as HTMLInputElement;
		if (!target) return;

		dispatch(setAttributeRangeLength({ index: attributeIndex, value: target.id === 'range3value' ? 3 : 2 }));

		dispatch(
			setAttributeBestIndex({
				index: attributeIndex,
				value: 0,
			})
		);
	};

	const handle_range_best_selection = (e: ChangeEvent<HTMLInputElement>) => {
		const target = e?.target as HTMLInputElement;
		if (!target) return;

		const id = target.id;
		switch (id) {
			case 'low':
				dispatch(
					setAttributeBestIndex({
						index: attributeIndex,
						value: 0,
					})
				);
				break;
			case 'mid':
				dispatch(
					setAttributeBestIndex({
						index: attributeIndex,
						value: 1,
					})
				);
				break;
			case 'high':
				dispatch(
					setAttributeBestIndex({
						index: attributeIndex,
						value: attribute.range.length === 2 ? 1 : 2,
					})
				);
				break;
		}
	};

	const handle_best_boolean_selection = (e: ChangeEvent<HTMLInputElement>) => {
		const target = e?.target as HTMLInputElement;
		if (!target) return;

		dispatch(setAttributeBestIndex({ index: attributeIndex, value: target.id === 'yesBest' ? 1 : 0 }));
	};

	const handle_text_rating_type_selection = (e: ChangeEvent<HTMLInputElement>) => {
		const target = e?.target as HTMLInputElement;
		if (!target) return;

		let value: TextRating;
		switch (target.id) {
			case 'noRating':
				value = 'none';
				break;
			case 'selfRated':
				value = 'selfrated';
				break;
			case 'keyRatingPairs':
				value = 'keyratingpairs';
				break;
			default:
				value = 'none';
		}

		dispatch(setAttributeTextRatingType({ index: attributeIndex, value: value }));
	};

	const show_importance = (): boolean => {
		const attributeType = attribute.type;
		return (
			attributeType === 'number' ||
			attributeType === 'score' ||
			attributeType === 'yesNo' ||
			(attributeType === 'text' &&
				(attribute.textRatingType === 'selfrated' || attribute.textRatingType === 'keyratingpairs'))
		);
	};

	const set_key_rating_pair_key = (id: number) => (key: string) => {
		dispatch(
			setAttributeKeyRatingPairKey({
				attrIndex: attributeIndex,
				pairID: id,
				key: key,
			})
		);
	};
	const set_key_rating_pair_rating = (id: number) => (rating: number) => {
		dispatch(
			setAttributeKeyRatingPairRating({
				attrIndex: attributeIndex,
				pairID: id,
				rating: rating,
			})
		);
	};

	const add_key_rating_pair = () => {
		dispatch(addKeyRatingPair(attributeIndex));
	};

	const remove_key_rating_pair = (pairIndex: number) => {
		dispatch(
			removeKeyRatingPair({
				attrIndex: attributeIndex,
				pairIndex: pairIndex,
			})
		);
	};

	const validate = useDebounceCallback(() => {
		const val = validateAttribute(attribute);
		setValidation(val.valObj);
	}, 500);

	useEffect(() => {
		const checkRanges = () => {
			if (attribute.type !== 'number') return;
			setRangeErrorIndex(-1);

			if (attribute.range[0] >= attribute.range[1]) setRangeErrorIndex(0);

			if (attribute.range.length === 3) {
				if (attribute.range[1] >= attribute.range[2]) setRangeErrorIndex(1);
				if (attribute.range[0] >= attribute.range[2]) setRangeErrorIndex(2);
			}
		};

		checkRanges();
	}, [attribute.type, attribute.range]);

	useEffect(() => {
		validate();
	}, [attribute]);

	useEffect(() => {
		dispatch(setHighlightedAttribute(attribute.id));

		return () => {
			dispatch(setHighlightedAttribute(0));
		};
	}, []);

	return (
		<div className={styles.attribute_edit_container}>
			<div className={`${styles.attribute_edit_section} ${styles.name_input_section}`}>
				<ErrorComponent msg={validation.name} />
				<ErrorComponent msg={validation.prefix} />
				<ErrorComponent msg={validation.suffix} />

				<input
					onChange={handle_name_change}
					id='name_input'
					type='text'
					placeholder='Enter Name'
					className={styles.name_input}
					autoComplete='off'
					value={attribute.name ?? ''}
				/>
				<div className={styles.prefix_suffix_wrapper}>
					<SpecialInput value={attribute.prefix} setValue={setPrefix} label='Prefix' inputType='string' />
					<SpecialInput value={attribute.suffix} setValue={setSuffix} label='Suffix' inputType='string' />
				</div>
			</div>

			<div className={`${styles.attribute_edit_section} ${styles.type_section}`}>
				<div className={styles.section_label_wrapper}>
					<SectionLabel text='Data Type' />
				</div>
				<div className={styles.section_info_wrapper}>
					<Tooltip text='The type of value you want this column to hold'>
						<Info />
					</Tooltip>
				</div>

				<div className={styles.attribute_type_dropdown}>
					<Dropdown
						selected={attribute.type}
						setSelected={setType}
						options={attributeTypeList}
						conversionObject={attributeTypeListDisplayed}
					/>
				</div>
			</div>

			{attribute.type === 'number' ? (
				<div className={`${styles.attribute_edit_section} ${styles.range_setup_section}`}>
					<div className={styles.section_label_wrapper}>
						<SectionLabel text='Range Setup' />
					</div>

					<ErrorComponent msg={validation.rangeValues} />

					<div className={styles.section_info_wrapper}>
						<Tooltip
							text={`* Range Type: The number of values you want in your range\n
							* Range Values: Entry values will be compared against these numbers to generate a rating\n
							* Range Best: The value you consider to "best". Entry values that match this number will be rated a 10
							`}>
							<Info />
						</Tooltip>
					</div>

					<div className={styles.input_wrapper}>
						<h5 className={styles.input_label}>Type:</h5>
						<div className={styles.range_length_selectors}>
							<div className={styles.range_length_selector}>
								<label htmlFor='range2value'>2 Values</label>
								<input
									onChange={handle_range_type_selection}
									type='radio'
									id='range2value'
									name='range_type'
									checked={attribute.range.length === 2}
								/>
							</div>
							<div className={styles.range_length_selector}>
								<label htmlFor='range3value'>3 Values</label>
								<input
									onChange={handle_range_type_selection}
									type='radio'
									id='range3value'
									name='range_type'
									checked={attribute.range.length === 3}
								/>
							</div>
						</div>
					</div>
					<div className={styles.input_wrapper}>
						<h5 className={styles.input_label}>Values:</h5>
						<div className={styles.range_input}>
							{attribute.range.length === 2 ? (
								<>
									<SpecialInput
										value={attribute.range[0]}
										setValue={setRange(0)}
										label='Low'
										inputType='number'
										styling={{
											borderTopRightRadius: 0,
											borderBottomRightRadius: 0,
											borderRight: 'none',
											color: rangeErrorIndex === 0 ? 'red' : '',
										}}
									/>
									<SpecialInput
										value={attribute.range[1]}
										setValue={setRange(1)}
										label='High'
										inputType='number'
										styling={{
											borderTopLeftRadius: 0,
											borderBottomLeftRadius: 0,
											color: rangeErrorIndex === 0 ? 'red' : '',
										}}
									/>
								</>
							) : attribute.range.length === 3 ? (
								<>
									<SpecialInput
										value={attribute.range[0]}
										setValue={setRange(0)}
										label='Low'
										inputType='number'
										styling={{
											borderTopRightRadius: 0,
											borderBottomRightRadius: 0,
											borderRight: 'none',
											color: rangeErrorIndex === 0 || rangeErrorIndex === 2 ? 'red' : '',
										}}
									/>
									<SpecialInput
										value={attribute.range[1]}
										setValue={setRange(1)}
										label='Mid'
										inputType='number'
										styling={{
											borderRadius: '0',
											borderRight: 'none',
											color:
												rangeErrorIndex === 0 || rangeErrorIndex === 1 || rangeErrorIndex === 2 ? 'red' : '',
										}}
									/>
									<SpecialInput
										value={attribute.range[2]}
										setValue={setRange(2)}
										label='High'
										inputType='number'
										styling={{
											borderTopLeftRadius: 0,
											borderBottomLeftRadius: 0,
											color: rangeErrorIndex === 1 || rangeErrorIndex === 2 ? 'red' : '',
										}}
									/>
								</>
							) : null}
						</div>
					</div>
					<div className={styles.input_wrapper}>
						<h5 className={styles.input_label}>Best:</h5>
						<div className={styles.range_best_wrapper}>
							<div className={styles.range_best_selector}>
								<label htmlFor='low'>Low</label>
								<input
									onChange={e => handle_range_best_selection(e)}
									type='radio'
									id='low'
									name='range_best'
									checked={attribute.bestIndex === 0}
								/>
							</div>
							{attribute.range.length === 3 ? (
								<div className={styles.range_best_selector}>
									<label htmlFor='mid'>Mid</label>
									<input
										onChange={e => handle_range_best_selection(e)}
										type='radio'
										id='mid'
										name='range_best'
										checked={attribute.bestIndex === 1}
									/>
								</div>
							) : null}
							<div className={styles.range_best_selector}>
								<label htmlFor='high'>High</label>
								<input
									onChange={e => handle_range_best_selection(e)}
									type='radio'
									id='high'
									name='range_best'
									checked={
										(attribute.range.length === 3 && attribute.bestIndex === 2) ||
										(attribute.range.length === 2 && attribute.bestIndex === 1)
									}
								/>
							</div>
						</div>
					</div>
				</div>
			) : attribute.type === 'yesNo' ? (
				<div className={`${styles.attribute_edit_section} ${styles.best_boolean_section}`}>
					<div className={styles.section_label_wrapper}>
						<SectionLabel text='Best Value' />
					</div>
					<div className={styles.section_info_wrapper}>
						<Tooltip text='The value you consider to be "best". Entry values that match this selection will be rated a 10'>
							<Info />
						</Tooltip>
					</div>

					<div className={styles.best_boolean_selectors}>
						<div className={styles.best_boolean_selector}>
							<label htmlFor='yesBest'>Yes</label>
							<input
								onChange={e => handle_best_boolean_selection(e)}
								type='radio'
								id='yesBest'
								name='yesNoBest'
								checked={attribute.bestIndex === 1}
							/>
						</div>
						<div className={styles.best_boolean_selector}>
							<label htmlFor='noBest'>No</label>
							<input
								onChange={e => handle_best_boolean_selection(e)}
								type='radio'
								id='noBest'
								name='yesNoBest'
								checked={attribute.bestIndex === 0}
							/>
						</div>
					</div>
				</div>
			) : attribute.type === 'text' ? (
				<>
					<div className={`${styles.attribute_edit_section} ${styles.rating_method_section}`}>
						<div className={styles.section_label_wrapper}>
							<SectionLabel text='Text Rating Type' />
						</div>
						<div className={styles.section_info_wrapper}>
							<Tooltip
								text={`* No Rating: This attribute will not be used to calculate an entry's final rating\n
									* Self Rated: Assign a rating manually when editing an entry\n
									* Name Matching: Predefine a set of name-rating pairs. Choose one of the names when editing an entry and it will use that rating`}>
								<Info />
							</Tooltip>
						</div>

						<div className={styles.rating_methods}>
							<div className={styles.no_rating_selector}>
								<label htmlFor='noRating'>No Rating</label>
								<input
									onChange={e => handle_text_rating_type_selection(e)}
									name='noRatingSelector'
									type='checkbox'
									id='noRating'
									checked={attribute.textRatingType === 'none'}
								/>
							</div>
							<div className={styles.self_rated_selector}>
								<label htmlFor='selfRated'>Self Rated</label>
								<input
									onChange={e => handle_text_rating_type_selection(e)}
									name='selfRatedSelector'
									type='checkbox'
									id='selfRated'
									checked={attribute.textRatingType === 'selfrated'}
								/>
							</div>
							<div className={styles.name_matching_selector}>
								<label htmlFor='keyRatingPairs'>Name Matching</label>
								<input
									onChange={e => handle_text_rating_type_selection(e)}
									name='nameMatchSelector'
									type='checkbox'
									id='keyRatingPairs'
									checked={attribute.textRatingType === 'keyratingpairs'}
								/>
							</div>
						</div>
					</div>
					{attribute.textRatingType === 'keyratingpairs' ? (
						<div className={`${styles.attribute_edit_section} ${styles.name_rating_pairs}`}>
							<div className={styles.section_label_wrapper}>
								<SectionLabel text='Name-Rating Pairs' />
							</div>
							<ErrorComponent msg={validation.pairName} />

							<div className={styles.section_info_wrapper}>
								<Tooltip text='Create a list of value options and the ratings that should be assigned to each'>
									<Info />
								</Tooltip>
							</div>

							{attribute?.keyRatingPairs?.map((pair, index) => {
								return (
									<div key={pair.id} className={styles.name_rating_pair}>
										<div onClick={() => remove_key_rating_pair(index)} className={styles.delete_pair_btn}>
											<DeleteSVG />
										</div>
										<div className={styles.name_rating_pair_name}>
											<SpecialInput
												value={pair.key}
												setValue={set_key_rating_pair_key(pair.id)}
												label='Name'
												inputType='string'
											/>
										</div>
										<h3 className={styles.name_colon}>:</h3>
										<div className={styles.name_rating_pair_rating}>
											<RatingSlider rating={pair.rating} setRating={set_key_rating_pair_rating(pair.id)} />
										</div>
									</div>
								);
							})}

							<div onClick={add_key_rating_pair} className={styles.add_pair_btn}>
								<AddSVG />
							</div>
						</div>
					) : null}
				</>
			) : null}

			{show_importance() ? (
				<div className={`${styles.attribute_edit_section} ${styles.importance_section}`}>
					<div className={styles.section_label_wrapper}>
						<SectionLabel text='Importance Level' />
					</div>
					<div className={styles.section_info_wrapper}>
						<Tooltip text="This determines how much weight should be applied to a rating. Values with low importance will have less impact on the entry's final rating">
							<Info />
						</Tooltip>
					</div>

					<div className={styles.importance}>
						<RatingSlider rating={attribute.importance ?? 10} setRating={setImportance} />
					</div>
				</div>
			) : null}
		</div>
	);
};

export default AttributeEdit;
