import Dropdown from '@/src/components/inputs/dropdown/dropdown';
import ImportanceSlider from '@/src/components/inputs/importance_slider/importance_slider';
import SpecialInput from '@/src/components/inputs/special_input/special_input';
import {
	AttributeDataType,
	AttributeType,
	attributeTypeList,
	attributeTypeListDisplayed,
	IAttribute,
} from '@/src/types/attributes.types';
import React, { useEffect, useState } from 'react';
import styles from './attribute_edit.module.css';

const AttributeEdit = ({ attribute }: { attribute: IAttribute }) => {
	const [importance, setImportance] = useState<number | null>(attribute.importance);
	const [attributeType, setAttributeType] = useState<AttributeType>('text');
	const [rangeValueOne, setRangeValueOne] = useState<number>(0);
	const [rangeValueTwo, setRangeValueTwo] = useState<number>(0);
	const [rangeValueThree, setRangeValueThree] = useState<number>(0);
	const [rangeErrorIndex, setRangeErrorIndex] = useState<number>(-1);

	useEffect(() => {
		setRangeValueOne(0);
		setRangeValueTwo(100);
		if (attributeType === 'range3value') setRangeValueThree(200);
	}, [attributeType]);

	useEffect(() => {
		const checkRanges = () => {
			if (attributeType !== 'range2value' && attributeType !== 'range3value') return;
			setRangeErrorIndex(-1);

			if (rangeValueOne >= rangeValueTwo) setRangeErrorIndex(0);

			if (attributeType === 'range3value') {
				if (rangeValueTwo >= rangeValueThree) setRangeErrorIndex(1);
				if (rangeValueOne >= rangeValueThree) setRangeErrorIndex(2);
			}
		};

		checkRanges();
	}, [attributeType, rangeValueOne, rangeValueTwo, rangeValueThree]);

	return (
		<div className={styles.attribute_modal_container}>
			<div className={styles.attribute_modal}>
				<div className={styles.attribute_modal_contents}>
					<div className={styles.name_input_section}>
						<input
							type='text'
							className={styles.name_input}
							placeholder='Attribute Name'
							defaultValue={attribute.name}
						/>
					</div>

					<div className={styles.data_section}>
						<h5 className={`${styles.section_label} ${styles.data_label}`}>Data</h5>
						<div className={styles.attribute_type_dropdown}>
							<Dropdown
								selected={attributeType}
								setSelected={setAttributeType}
								options={attributeTypeList}
								conversionObject={attributeTypeListDisplayed}
							/>
						</div>

						<div className={styles.type_data_input}>
							{attributeType === 'range2value' ? (
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
							) : attributeType === 'range3value' ? (
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

					<div className={styles.importance_section}>
						{importance !== null ? (
							<div className={styles.importance}>
								<ImportanceSlider importance={importance} setImportance={setImportance} />
							</div>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AttributeEdit;
