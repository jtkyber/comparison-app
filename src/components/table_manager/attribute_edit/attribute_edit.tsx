import Dropdown from '@/src/components/inputs/dropdown/dropdown';
import SpecialInput from '@/src/components/inputs/special_input/special_input';
import Info from '@/src/components/svg/info.svg';
import Tooltip from '@/src/components/tooltip/tooltip';
import {
	setAttributeBestIndex,
	setAttributeImportance,
	setAttributeName,
	setAttributePrefix,
	setAttributeRangeLength,
	setAttributeRangeValue,
	setAttributeSelfRated,
	setAttributeSuffix,
	setAttributeType,
} from '@/src/lib/features/comparison/comparisonSlice';
import { useAppDispatch, useAppSelector } from '@/src/lib/hooks';
import {
	AttributeType,
	attributeTypeList,
	attributeTypeListDisplayed,
	IAttribute,
} from '@/src/types/attributes.types';
import { IEntry } from '@/src/types/entries.types';
import React, { ChangeEvent, useEffect, useState } from 'react';
import RatingSlider from '../../inputs/rating_slider/rating_slider';
import SectionLabel from '../../inputs/section_label/section_label';
import styles from './attribute_edit.module.css';

const AttributeEdit = ({ attributeIndex }: { attributeIndex: number }) => {
	const attribute = useAppSelector(state => state.comparison.attributes[attributeIndex]);

	const dispatch = useAppDispatch();

	const setPrefix = (value: string) => {
		dispatch(setAttributePrefix({ index: attributeIndex, value: value }));
	};

	const setSuffix = (value: string) => {
		dispatch(setAttributeSuffix({ index: attributeIndex, value: value }));
	};

	const setType = (value: AttributeType) => {
		dispatch(setAttributeType({ index: attributeIndex, value: value }));
	};

	const setRange = (rangeIndex: 0 | 1 | 2) => (value: number) => {
		dispatch(setAttributeRangeValue({ index: attributeIndex, rangeIndex: rangeIndex, value: value }));
	};

	const setImportance = (value: number) => {
		dispatch(setAttributeImportance({ index: attributeIndex, value: value }));
	};

	const [rangeErrorIndex, setRangeErrorIndex] = useState<number>(-1);

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

	const handle_self_rated_selection = (e: ChangeEvent<HTMLInputElement>) => {
		const target = e?.target as HTMLInputElement;
		if (!target) return;

		dispatch(setAttributeSelfRated({ index: attributeIndex, value: target.checked }));
	};

	const handle_value_match_selection = (e: ChangeEvent<HTMLInputElement>) => {
		const target = e?.target as HTMLInputElement;
		if (!target) return;

		console.log(target.checked);
	};

	const show_importance = (): boolean => {
		const attributeType = attribute.type;
		return (
			attributeType === 'number' ||
			attributeType === 'yesNo' ||
			(attributeType === 'text' && attribute.selfRated === true)
		);
	};

	return (
		<div className={styles.attribute_edit_container}>
			<div className={`${styles.attribute_edit_section} ${styles.name_input_section}`}>
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
				<SectionLabel text='Data Type' color='var(--color-grey4)' />

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
					<SectionLabel text='Range Setup' color='var(--color-grey4)' />

					<div className={styles.section_info_wrapper}>
						<Tooltip
							text={`
							* Range Type: The number of values you want in your range\n
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
					<SectionLabel text='Best Value' color='var(--color-grey4)' />

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
				<div className={`${styles.attribute_edit_section} ${styles.self_rated_section}`}>
					<SectionLabel text='Text Settings' color='var(--color-grey4)' />

					<div className={styles.section_info_wrapper}>
						<Tooltip text='* Self-rated: Enable this if you want to assign manual ratings for this attribute'>
							<Info />
						</Tooltip>
					</div>

					<div className={styles.self_rated_selector}>
						<label htmlFor='selfRated'>Self-rated</label>
						<input
							onChange={e => handle_self_rated_selection(e)}
							name='selfRatedSelector'
							type='checkbox'
							id='selfRated'
							checked={attribute.selfRated === true}
						/>
					</div>
					{/* <div className={styles.value_matching_selector}>
						<label htmlFor='valueMatch'>Value Matching</label>
						<input
							onChange={e => handle_value_match_selection(e)}
							name='valueMatchSelector'
							type='checkbox'
							id='valueMatch'
							checked={attribute.selfRated === true}
						/>
					</div> */}
				</div>
			) : null}

			{show_importance() ? (
				<div className={`${styles.attribute_edit_section} ${styles.importance_section}`}>
					<SectionLabel text='Importance Level' color='var(--color-grey4)' />

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
