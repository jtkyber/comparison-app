import React, { ReactNode, useEffect, useRef, useState } from 'react';
import styles from './tooltip.module.css';

const Tooltip = ({ children, text }: { children: ReactNode; text: string }) => {
	const childElement = useRef<HTMLDivElement>(null);

	const [xPos, setXPos] = useState<number>(0);
	const [yPos, setYPos] = useState<number>(0);

	useEffect(() => {
		const childEl: HTMLDivElement | null = childElement?.current;
		if (!childEl) return;

		childEl.addEventListener('mouseenter', handleMouseEnter);
		childEl.addEventListener('mouseleave', handleMouseLeave);

		return () => {
			childEl.removeEventListener('mouseenter', handleMouseEnter);
			childEl.removeEventListener('mouseleave', handleMouseLeave);
		};
	}, []);

	function handleMouseEnter() {
		const childEl: HTMLDivElement | null = childElement?.current;
		if (!childEl) return;

		const x: number = childEl.getBoundingClientRect().right;
		const y: number = childEl.getBoundingClientRect().top;

		setXPos(x);
		setYPos(y);
	}

	function handleMouseLeave() {
		setXPos(0);
		setYPos(0);
	}

	return (
		<div className={styles.tooltip_container}>
			<div ref={childElement} className={styles.child_wrapper}>
				{children}
			</div>
			{xPos && yPos ? (
				<h5 style={{ left: `${xPos}px`, top: `${yPos}px` }} className={styles.tooltip}>
					{text}
				</h5>
			) : null}
		</div>
	);
};

export default Tooltip;
