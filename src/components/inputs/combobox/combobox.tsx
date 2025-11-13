'use client';
import { Dispatch, MouseEventHandler, SetStateAction, useEffect, useRef, useState } from 'react';
import styles from './combobox.module.css';

const Combobox = ({
	options,
	selected,
	setSelected,
	referenceTable,
	label = '',
}: {
	options: string[];
	selected: string;
	setSelected: Dispatch<SetStateAction<any>>;
	referenceTable?: { [key: string]: string };
	label?: string;
}) => {
	const [isDropped, setIsDropped] = useState<boolean>(false);
	const [enteredText, setEnteredText] = useState<string>('');

	const displayTextRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const displayTextEl = displayTextRef?.current;
		if (displayTextEl) {
			isDropped ? displayTextEl.focus() : setEnteredText('');
		}
	}, [isDropped]);

	const handleDisplayClick: MouseEventHandler<HTMLInputElement | HTMLHeadingElement> = e => {
		const target = e.target as HTMLInputElement;
		if (target instanceof HTMLInputElement && !target.readOnly) return;
		setIsDropped(!isDropped);
	};

	const handleInputChange: MouseEventHandler<HTMLInputElement> = e => {
		const target = e.target as HTMLInputElement;
		setEnteredText(target.value.trim().toLowerCase());
	};

	const handleSelection: MouseEventHandler<HTMLHeadingElement> = e => {
		const target = e.target as HTMLHeadingElement;
		setSelected(target.id);
		setIsDropped(false);
	};

	const getValue = (text: string): string => {
		return referenceTable ? referenceTable[text] || label : text;
	};

	return (
		<div className={styles.combobox_container}>
			<div className={styles.select_display}>
				<input
					type='text'
					readOnly={!isDropped}
					ref={displayTextRef}
					onClick={handleDisplayClick}
					onInput={handleInputChange}
					className={styles.display_text}
					value={isDropped ? enteredText : getValue(selected)}></input>
				<h4 onClick={handleDisplayClick} className={styles.down_arrow}>
					&#8964;
				</h4>
			</div>
			{isDropped ? (
				<div className={styles.dropdown}>
					<div className={styles.options}>
						{options
							?.filter(o => getValue(o).toLowerCase().includes(enteredText))
							.map(option => (
								<h4 id={option} onClick={handleSelection} key={option} className={styles.option}>
									{getValue(option)}
								</h4>
							))}
					</div>
				</div>
			) : null}
		</div>
	);
};

export default Combobox;
