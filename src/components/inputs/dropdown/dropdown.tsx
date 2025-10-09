import styles from './dropdown.module.css';

import React, { Dispatch, MouseEventHandler, SetStateAction, useState } from 'react';

const Dropdown = ({
	selected,
	setSelected,
	options,
	conversionObject,
}: {
	selected: string;
	setSelected: Dispatch<SetStateAction<any>>;
	options: ReadonlyArray<string>;
	conversionObject: { [key: string]: string };
}) => {
	const [isDropped, setIsDropped] = useState<boolean>(false);

	const handleDisplayClick = () => {
		setIsDropped(!isDropped);
	};

	const handleSelection: MouseEventHandler<HTMLHeadingElement> = e => {
		const target = e.target as HTMLHeadingElement;
		setSelected(target.id);
		setIsDropped(false);
	};

	return (
		<div className={`${styles.dropdown_container} ${isDropped ? styles.dropped : null}`}>
			<div onClick={handleDisplayClick} className={styles.dropdown_display}>
				<h5 className={styles.dropdown_display_text}>{conversionObject[selected]}</h5>
				<h5 className={styles.down_arrow}>&#8964;</h5>
			</div>
			{isDropped ? (
				<div className={styles.dropdown}>
					<div className={styles.options}>
						{options.map(option => (
							<h5 id={option} onClick={handleSelection} key={option} className={styles.option}>
								{conversionObject[option]}
							</h5>
						))}
					</div>
				</div>
			) : null}
		</div>
	);
};

export default Dropdown;
