'use client';
import React, { Dispatch, MouseEventHandler, SetStateAction, useEffect, useRef, useState } from 'react';
import styles from './combobox.module.css';

const Combobox = ({
	options,
	selected,
	setSelected,
	referenceTable,
}: {
	options: string[];
	selected: string;
	setSelected: Dispatch<SetStateAction<any>>;
	referenceTable?: { [key: string]: string };
}) => {
	const [isDropped, setIsDropped] = useState<boolean>(false);
	const [enteredText, setEnteredText] = useState<string>('');

	const displayTextRef = useRef<HTMLHeadingElement>(null);

	useEffect(() => {
		const displayTextEl = displayTextRef?.current;
		if (displayTextEl && isDropped) displayTextEl.focus();
	}, [isDropped]);

	const handleDisplayClick: MouseEventHandler<HTMLHeadingElement> = e => {
		const target = e.target as HTMLHeadingElement;
		if (target.isContentEditable) return;
		setIsDropped(!isDropped);
	};

	const handleInputChange: MouseEventHandler<HTMLHeadingElement> = e => {
		const target = e.target as HTMLHeadingElement;
		if (!target.isContentEditable) return;
		setEnteredText(target.innerText.trim().toLowerCase());
	};

	const handleSelection: MouseEventHandler<HTMLHeadingElement> = e => {
		const target = e.target as HTMLHeadingElement;
		setSelected(target.id);
		setIsDropped(false);
	};

	const getValue = (text: string): string => {
		return referenceTable ? referenceTable[text] : text;
	};

	return (
		<div className={styles.combobox_container}>
			<div className={styles.select_display}>
				<h4
					ref={displayTextRef}
					contentEditable={isDropped}
					suppressContentEditableWarning={true}
					onClick={handleDisplayClick}
					onInput={handleInputChange}
					className={styles.display_text}>
					{isDropped ? '' : getValue(selected)}
				</h4>
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
								<h5 id={option} onClick={handleSelection} key={option} className={styles.option}>
									{getValue(option)}
								</h5>
							))}
					</div>
				</div>
			) : null}
		</div>
	);
};

export default Combobox;
