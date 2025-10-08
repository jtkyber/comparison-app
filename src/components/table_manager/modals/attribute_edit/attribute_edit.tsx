import Dropdown from '@/src/components/inputs/dropdown/dropdown';
import ImportanceSlider from '@/src/components/inputs/importance_slider/importance_slider';
import {
	AttributeType,
	attributeTypeList,
	attributeTypeListDisplayed,
	IAttribute,
} from '@/src/types/attributes.types';
import React, { useState } from 'react';
import styles from './attribute_edit.module.css';

const AttributeEdit = ({ attribute }: { attribute: IAttribute }) => {
	const [importance, setImportance] = useState<number | null>(attribute.importance);
	const [attributeType, setAttributeType] = useState<AttributeType>('range2value');

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
