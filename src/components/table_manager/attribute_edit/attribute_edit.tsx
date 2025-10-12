import Dropdown from '@/src/components/inputs/dropdown/dropdown';
import ImportanceSlider from '@/src/components/inputs/importance_slider/importance_slider';
import SpecialInput from '@/src/components/inputs/special_input/special_input';
import Info from '@/src/components/svg/info.svg';
import Tooltip from '@/src/components/tooltip/tooltip';
import {
	AttributeType,
	attributeTypeList,
	attributeTypeListDisplayed,
	IAttribute,
} from '@/src/types/attributes.types';
import React, { FormEvent, MouseEvent, useEffect, useState } from 'react';
import styles from './attribute_edit.module.css';

const AttributeEdit = ({ attribute }: { attribute: IAttribute }) => {
	const [attributeType, setAttributeType] = useState<AttributeType>(attribute.type || 'text');
	const [rangeType, setRangeType] = useState<0 | 1>(0);

	const [prefix, setPrefix] = useState<string>('');
	const [suffix, setSuffix] = useState<string>('');

	const [rangeValueOne, setRangeValueOne] = useState<number | null>(null);
	const [rangeValueTwo, setRangeValueTwo] = useState<number | null>(null);
	const [rangeValueThree, setRangeValueThree] = useState<number | null>(null);

	const [rangeBest, setRangeBest] = useState<number>(0);

	const [rangeErrorIndex, setRangeErrorIndex] = useState<number>(-1);

	const [importance, setImportance] = useState<number | null>(attribute.importance);

	useEffect(() => {
		setRangeValueOne(0);
		setRangeValueTwo(100);
		if (rangeType === 1) setRangeValueThree(200);
	}, [attributeType]);

	useEffect(() => {
		const checkRanges = () => {
			if (attributeType !== 'number') return;
			setRangeErrorIndex(-1);

			if (rangeValueOne && rangeValueTwo && rangeValueOne >= rangeValueTwo) setRangeErrorIndex(0);

			if (rangeType === 1) {
				if (rangeValueTwo && rangeValueThree && rangeValueTwo >= rangeValueThree) setRangeErrorIndex(1);
				if (rangeValueOne && rangeValueThree && rangeValueOne >= rangeValueThree) setRangeErrorIndex(2);
			}
		};

		checkRanges();
	}, [attributeType, rangeValueOne, rangeValueTwo, rangeValueThree]);

	const handle_range_type_selection = (e: FormEvent<HTMLInputElement>) => {
		const target = e?.target as HTMLInputElement;
		if (!target) return;

		setRangeType(target.id === 'range3value' ? 1 : 0);
	};

	const handle_range_best_selection = (e: FormEvent<HTMLInputElement>) => {
		const target = e?.target as HTMLInputElement;
		if (!target) return;

		const id = target.id;
		switch (id) {
			case 'low':
				setRangeBest(0);
				break;
			case 'mid':
				setRangeBest(1);
				break;
			case 'high':
				setRangeBest(2);
				break;
		}
	};

	return (
		<div className={styles.attribute_edit_container}>
			<div className={styles.name_input_section}>
				<input id='name_input' type='text' placeholder='Enter Name' defaultValue={attribute.name} />
				<div className={styles.prefix_suffix_wrapper}>
					<SpecialInput value={prefix} setValue={setPrefix} label='Prefix' inputType='string' />
					<SpecialInput value={suffix} setValue={setSuffix} label='Suffix' inputType='string' />
				</div>
			</div>

			<div className={styles.type_section}>
				<h5 className={`${styles.section_label} ${styles.data_label}`}>Data Type</h5>

				<div className={styles.section_info_wrapper}>
					<Tooltip text='Choose a data type for this attribute'>
						<Info />
					</Tooltip>
				</div>

				<div className={styles.attribute_type_dropdown}>
					<Dropdown
						selected={attributeType}
						setSelected={setAttributeType}
						options={attributeTypeList}
						conversionObject={attributeTypeListDisplayed}
					/>
				</div>
			</div>

			{attributeType === 'number' ? (
				<div className={styles.range_setup_section}>
					<h5 className={`${styles.section_label} ${styles.data_label}`}>Range Setup</h5>

					<div className={styles.section_info_wrapper}>
						<Tooltip text="Entry values will be compared against this range to calculate a rating. An entry's attribute value that matches your 'best' selection will be rated a 10">
							<Info />
						</Tooltip>
					</div>

					<div className={styles.input_wrapper}>
						<h5 className={styles.input_label}>Range Type:</h5>
						<div className={styles.range_selectors}>
							<div className={styles.range_selector}>
								<label htmlFor='range2value'>2 Values</label>
								<input
									onInput={e => handle_range_type_selection(e)}
									type='radio'
									id='range2value'
									name='range_type'
									defaultChecked
								/>
							</div>
							<div className={styles.range_selector}>
								<label htmlFor='range3value'>3 Values</label>
								<input
									onInput={e => handle_range_type_selection(e)}
									type='radio'
									id='range3value'
									name='range_type'
								/>
							</div>
						</div>
					</div>
					<div className={styles.input_wrapper}>
						<h5 className={styles.input_label}>Range Values:</h5>
						<div className={styles.range_input}>
							{rangeType === 0 ? (
								<>
									<SpecialInput
										value={rangeValueOne}
										setValue={setRangeValueOne}
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
										value={rangeValueTwo}
										setValue={setRangeValueTwo}
										label='High'
										inputType='number'
										styling={{
											borderTopLeftRadius: 0,
											borderBottomLeftRadius: 0,
											color: rangeErrorIndex === 0 ? 'red' : '',
										}}
									/>
								</>
							) : rangeType === 1 ? (
								<>
									<SpecialInput
										value={rangeValueOne}
										setValue={setRangeValueOne}
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
										value={rangeValueTwo}
										setValue={setRangeValueTwo}
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
										value={rangeValueThree}
										setValue={setRangeValueThree}
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
						<h5 className={styles.input_label}>Range Best:</h5>
						<div className={styles.range_best_wrapper}>
							<div className={styles.range_best_selector}>
								<label htmlFor='low'>&#8593;</label>
								<input
									onInput={e => handle_range_best_selection(e)}
									type='radio'
									id='low'
									name='range_best'
									defaultChecked
								/>
							</div>
							{rangeType === 1 ? (
								<div className={styles.range_best_selector}>
									<label htmlFor='mid'>&#8593;</label>
									<input
										onInput={e => handle_range_best_selection(e)}
										type='radio'
										id='mid'
										name='range_best'
									/>
								</div>
							) : null}
							<div className={styles.range_best_selector}>
								<label htmlFor='high'>&#8593;</label>
								<input
									onInput={e => handle_range_best_selection(e)}
									type='radio'
									id='high'
									name='range_best'
								/>
							</div>
						</div>
					</div>
				</div>
			) : null}

			{/* <div className={styles.importance_section}>
				{importance !== null ? (
					<div className={styles.importance}>
						<ImportanceSlider importance={importance} setImportance={setImportance} />
					</div>
				) : null}
			</div> */}
		</div>
	);
};

export default AttributeEdit;
