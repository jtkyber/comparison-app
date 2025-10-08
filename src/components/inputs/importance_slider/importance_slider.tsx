import React, { useEffect, useRef, useState } from 'react';
import styles from './importance_slider.module.css';

const sliderColors: { [key: number]: string } = {
	0: '#ff0000',
	10: '#ff3300',
	20: '#ff6600',
	30: '#ff9900',
	40: '#ffcc00',
	50: '#ffff00',
	60: '#cce600',
	70: '#99cc00',
	80: '#66b300',
	90: '#339900',
	100: '#008000',
};

const ImportanceSlider = ({ defaultImportance }: { defaultImportance: number }) => {
	const [holdingOnSlider, setHoldingOnSlider] = useState<boolean>(false);

	const sliderRef = useRef<HTMLDivElement>(null);
	const importanceRatingRef = useRef<HTMLDivElement>(null);

	const handle_mouse_up = () => setHoldingOnSlider(false);

	useEffect(() => {
		if (!sliderRef?.current) return;
		const slider = sliderRef.current;

		slider.style.setProperty('--slider-progress', `${defaultImportance * 10}%`);
		slider.style.setProperty('--slider-color', `${sliderColors[defaultImportance * 10]}`);
	}, []);

	useEffect(() => {
		const handle_mouse_move = (e: MouseEvent) => {
			if (!sliderRef?.current || !importanceRatingRef?.current || !holdingOnSlider) return;
			const slider = sliderRef.current;
			const importanceRating = importanceRatingRef.current;

			const sliderLeftX: number = slider.getBoundingClientRect().left;
			const sliderRightX: number = slider.getBoundingClientRect().right;

			const clientX: number = e.clientX;

			const percentAccross: number = ((clientX - sliderLeftX) / (sliderRightX - sliderLeftX)) * 100;

			const percentAccrossClamped: number = Math.min(Math.max(percentAccross, 0), 100);

			const percentAccrossRounded: number = Math.round(percentAccrossClamped / 10) * 10;

			slider.style.setProperty('--slider-progress', `${percentAccrossRounded}%`);
			slider.style.setProperty('--slider-color', `${sliderColors[percentAccrossRounded]}`);
			importanceRating.innerText = `${percentAccrossRounded / 10}`;
		};

		document.addEventListener('mousemove', handle_mouse_move);
		document.addEventListener('mouseup', handle_mouse_up);

		return () => {
			document.removeEventListener('mousemove', handle_mouse_move);
			document.removeEventListener('mouseup', handle_mouse_up);
		};
	}, [holdingOnSlider]);

	return (
		<div className={styles.importance_slider_container}>
			<h4 ref={importanceRatingRef} className={styles.importance_rating}>
				{defaultImportance}
			</h4>
			<div ref={sliderRef} onMouseDown={() => setHoldingOnSlider(true)} className={styles.importance_slider}>
				<div className={styles.slider_fill}></div>
				<div className={styles.slider_thumb}></div>
			</div>
		</div>
	);
};

export default ImportanceSlider;
