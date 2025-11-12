import React, { ReactNode, useEffect, useRef, useState } from 'react';
import styles from './tooltip.module.css';

const Tooltip = ({
	children,
	text,
	delay = 0,
}: {
	children: ReactNode;
	text: string;
	delay?: number | 'default';
}) => {
	const childRef = useRef<HTMLDivElement>(null);

	let timeoutID: NodeJS.Timeout;
	let mouseOver: boolean = false;

	const [xPos, setXPos] = useState<number>(0);
	const [yPos, setYPos] = useState<number>(0);

	const [isVisible, setIsVisible] = useState<boolean>(false);
	const [onRightSide, setOnRightSide] = useState<boolean>(false);

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

		timeoutID = setTimeout(
			() => {
				const childEl: HTMLElement | null = childRef?.current;
				if (!childEl || !mouseOver) return;

				let x: number = childEl.getBoundingClientRect().right;
				let y: number = childEl.getBoundingClientRect().top;
				const width: number = childEl.getBoundingClientRect().width;
				const height: number = childEl.getBoundingClientRect().height;

				if (x - width > window.innerWidth / 2) {
					x = childEl.getBoundingClientRect().left;
					setOnRightSide(true);
				}
				if (y - height < 0) {
					y = childEl.getBoundingClientRect().bottom + height;
					// setOnRightSide(true);
				}

				setXPos(x);
				setYPos(y);
				setIsVisible(true);
			},
			typeof delay === 'number' ? delay : window.tooltipDelay
		);
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
				className={`${styles.tooltip} ${isVisible ? styles.visible : null} ${
					onRightSide ? styles.onRight : null
				}`}>
				{text}
			</h5>
		</>
	);
};

export default Tooltip;
