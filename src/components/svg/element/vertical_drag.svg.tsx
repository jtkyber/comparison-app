const VerticalDragSVG = () => {
	return (
		<svg viewBox='0 0 250 330' fill='none' xmlns='http://www.w3.org/2000/svg'>
			<path
				d='M0 135C0 126.716 6.71573 120 15 120H235C243.284 120 250 126.716 250 135C250 143.284 243.284 150 235 150H15C6.71573 150 0 143.284 0 135Z'
				fill='#D9D9D9'
			/>
			<path
				d='M0 195C0 186.716 6.71573 180 15 180H235C243.284 180 250 186.716 250 195C250 203.284 243.284 210 235 210H15C6.71573 210 0 203.284 0 195Z'
				fill='#D9D9D9'
			/>
			<rect x='124.497' width='30' height='70' rx='15' transform='rotate(45 124.497 0)' fill='#D9D9D9' />
			<rect
				width='30'
				height='70'
				rx='15'
				transform='matrix(-0.707107 0.707107 0.707107 0.707107 124.749 0)'
				fill='#D9D9D9'
			/>
			<rect
				width='30'
				height='70'
				rx='15'
				transform='matrix(0.707107 -0.707107 -0.707107 -0.707107 124.497 329.711)'
				fill='#D9D9D9'
			/>
			<rect
				x='124.749'
				y='329.711'
				width='30'
				height='70'
				rx='15'
				transform='rotate(-135 124.749 329.711)'
				fill='#D9D9D9'
			/>
		</svg>
	);
};

export default VerticalDragSVG;
