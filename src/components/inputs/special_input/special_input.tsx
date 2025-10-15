import { sanitizeNumInputValue } from '@/src/utils/dom';
import React, { ChangeEvent, CSSProperties, useEffect } from 'react';
import styles from './special_input.module.css';

const SpecialInput = ({
	value,
	setValue,
	label,
	inputType,
	styling = {},
}: {
	value: string | number | null;
	setValue: (value: any) => void;
	label: string;
	inputType: 'string' | 'number';
	styling?: CSSProperties;
}) => {
	const handle_input_change = (e: ChangeEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement;
		const text = target.value.trim();

		switch (inputType) {
			case 'string':
				setValue(text);
				break;
			case 'number':
				const sanitized = sanitizeNumInputValue(text);
				if ((Number(sanitized) || sanitized === '0') && sanitized[sanitized.length - 1] !== '.') {
					setValue(Number(sanitized));
				} else setValue(sanitized);
				break;
		}
	};

	const formattedValue = (): string => {
		const val: string = value?.toString() || '';
		if (inputType === 'string' || !val) return val;

		const splitValue: string[] = val.split('.');

		let integerPart: string = splitValue[0];
		integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		let fractionPart: string = splitValue[1];
		if (fractionPart !== undefined) fractionPart = '.'.concat(fractionPart);
		else fractionPart = '';

		const finalValue: string = integerPart.concat(fractionPart);
		return finalValue;
	};

	return (
		<div className={styles.special_input_container}>
			<input
				type='text'
				inputMode='decimal'
				value={formattedValue()}
				onChange={handle_input_change}
				className={styles.special_input}
				style={styling}
				autoComplete='off'
			/>
			<h5 className={`${styles.special_input_label} ${value !== '' ? styles.filled : null}`}>{label}</h5>
		</div>
	);
};

export default SpecialInput;
