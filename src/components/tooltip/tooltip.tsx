import React, { ReactNode, useEffect, useRef, useState } from 'react';
import styles from './tooltip.module.css';

const Tooltip = ({ children, text, delay = 0 }: { children: ReactNode; text: string; delay?: number }) => {
	const childRef = useRef<HTMLDivElement>(null);

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

		setIsVisible(false);

		clearTimeout(timeoutID);
	}

	return (
		<>
			<div ref={childRef} className={styles.child_element}>
				{children}
			</div>

			<h5
				style={{ left: `${xPos}px`, top: `${yPos}px` }}
				className={`${styles.tooltip} ${isVisible ? styles.visible : null}`}>
				{text}
			</h5>
		</>
	);
};

export default Tooltip;
