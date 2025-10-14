import React, { ReactNode, useEffect, useRef, useState } from 'react';
import styles from './tooltip.module.css';

const Tooltip = ({ children, text, delay = 0 }: { children: ReactNode; text: string; delay?: number }) => {
	const childRef = useRef<HTMLElement>(null);

	let timeoutID: NodeJS.Timeout;
	let mouseOver: boolean = false;

	const [xPos, setXPos] = useState<number>(0);
	const [yPos, setYPos] = useState<number>(0);

	const [isVisible, setIsVisible] = useState<boolean>(false);

	useEffect(() => {
		const childEl: HTMLElement | null = childRef?.current;
		if (!childEl) return;

		childEl.addEventListener('mouseenter', handleMouseEnter);
		childEl.addEventListener('mouseleave', handleMouseLeave);

		return () => {
			childEl.removeEventListener('mouseenter', handleMouseEnter);
			childEl.removeEventListener('mouseleave', handleMouseLeave);
		};
	}, []);

	function handleMouseEnter() {
		mouseOver = true;

		timeoutID = setTimeout(() => {
			const childEl: HTMLElement | null = childRef?.current;
			if (!childEl || !mouseOver) return;

			const x: number = childEl.getBoundingClientRect().right;
			const y: number = childEl.getBoundingClientRect().top;

			setXPos(x);
			setYPos(y);
			setIsVisible(true);
		}, delay);
	}

	function handleMouseLeave() {
		mouseOver = false;

		// setXPos(0);
		// setYPos(0);
		setIsVisible(false);

		clearTimeout(timeoutID);
	}

	return (
		<div className={styles.tooltip_container}>
			{React.cloneElement(
				children as React.ReactElement,
				{
					ref: childRef,
				} as any
			)}
			<h5
				style={{ left: `${xPos}px`, top: `${yPos}px` }}
				className={`${styles.tooltip} ${isVisible ? styles.visible : null}`}>
				{text}
			</h5>
		</div>
	);
};

export default Tooltip;
