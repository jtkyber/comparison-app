import { IAttribute } from '@/src/types/attributes';
import React from 'react';
import styles from './attribute_edit.module.css';

const AttributeEdit = ({ attribute }: { attribute: IAttribute }) => {
	return (
		<div className={styles.attribute_modal_container}>
			<div className={styles.attribute_modal}>{attribute?.name}</div>
		</div>
	);
};

export default AttributeEdit;
