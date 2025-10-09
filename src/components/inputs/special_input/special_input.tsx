import { moveCaretToEnd } from '@/src/utils/dom';
import React, { CSSProperties, Dispatch, MouseEventHandler, SetStateAction, useEffect, useRef } from 'react';
import styles from './special_input.module.css';

const SpecialInput = ({
	value,
	setValue,
	label,
	inputType,
	styling = {},
}: {
	value: string | number;
	setValue: Dispatch<SetStateAction<any>>;
	label: string;
	inputType: 'string' | 'number';
	styling?: CSSProperties;
}) => {
	const inputRef = useRef<HTMLHeadingElement>(null);

	useEffect(() => {
		const input = inputRef?.current;
		if (input === null && input !== '') return;
		input.innerText = value.toString();
	}, [label]);

	const handle_input_change: MouseEventHandler<HTMLHeadingElement> = e => {
		const target = e.target as HTMLHeadingElement;
		const value = target.innerText.trim();
		if (
			inputType === 'number' &&
			(!Number.isFinite(Number(value)) || (value[0] === '0' && value.length > 1 && value[1] !== '.'))
		) {
			target.innerText = target.innerText.slice(0, -1);
			moveCaretToEnd(target);
			return;
		}

		setValue(inputType === 'string' ? value : Number(value));
	};

	return (
		<div className={styles.special_input_container}>
			<h5
				ref={inputRef}
				onInput={handle_input_change}
				contentEditable
				suppressContentEditableWarning
				className={styles.special_input}
				style={styling}></h5>
			<h5 className={`${styles.special_input_label} ${value !== '' ? styles.filled : null}`}>{label}</h5>
		</div>
	);
};

export default SpecialInput;
