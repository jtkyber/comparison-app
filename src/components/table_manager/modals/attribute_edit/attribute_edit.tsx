import ImportanceSlider from '@/src/components/inputs/importance_slider/importance_slider';
import { IAttribute } from '@/src/types/attributes.types';
import React from 'react';
import styles from './attribute_edit.module.css';

const AttributeEdit = ({ attribute }: { attribute: IAttribute }) => {
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

					<div className={styles.importance_section}>
						<div className={styles.importance}>
							<ImportanceSlider defaultImportance={attribute.importance || 10} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AttributeEdit;
