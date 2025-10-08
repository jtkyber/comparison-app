'use client';
import React, { Dispatch, MouseEventHandler, SetStateAction, useEffect, useRef, useState } from 'react';
import styles from './combobox.module.css';

const Combobox = ({
	width,
	height,
	defaultValue,
	values,
	ids,
	setSelectedID,
}: {
	width: string;
	height: string;
	defaultValue: string;
	values: string[];
	ids: number[];
	setSelectedID: Dispatch<SetStateAction<any>>;
}) => {
	const options = ids.map((o, i) => ({ id: o, name: values[i] }));

	const [selectedName, setSelectedName] = useState<string>(defaultValue);
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

	const handleDisplayChange: MouseEventHandler<HTMLHeadingElement> = e => {
		const target = e.target as HTMLHeadingElement;
		if (!target.isContentEditable) return;
		setEnteredText(target.innerText.trim().toLowerCase());
	};

	const handleSelection: MouseEventHandler<HTMLHeadingElement> = e => {
		const target = e.target as HTMLHeadingElement;
		setSelectedID(target.id);
		setSelectedName(target.innerText);
		setIsDropped(false);
	};

	return (
		<div className={styles.combobox_container}>
			<div style={{ width: width, height: height }} className={styles.select_display}>
				<h4
					ref={displayTextRef}
					contentEditable={isDropped}
					suppressContentEditableWarning={true}
					onClick={handleDisplayClick}
					onInput={handleDisplayChange}
					className={styles.display_text}
					style={{ lineHeight: height }}>
					{isDropped ? '' : selectedName}
				</h4>
				<h4 style={{ lineHeight: height }} onClick={handleDisplayClick} className={styles.down_arrow}>
					&#8964;
				</h4>
			</div>
			{isDropped ? (
				<div className={styles.dropdown}>
					<div className={styles.options}>
						{options
							?.filter(o => o.name.toLowerCase().includes(enteredText))
							.map(option => (
								<h5
									style={{ height: height }}
									id={option.id.toString()}
									onClick={handleSelection}
									key={option.id}
									className={styles.option}>
									{option.name}
								</h5>
							))}
					</div>
				</div>
			) : null}
		</div>
	);
};

export default Combobox;
