export function ratingToColor(rating: number, format: 'hex' | 'rgb' = 'hex') {
	// clamp to [0, 10]
	const r = Math.max(0, Math.min(10, Number(rating) || 0));

	// helper: linear interpolation
	const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);

	// segment 1: 0..5 from red (255,0,0) to yellow (255,255,0)
	// segment 2: 5..10 from yellow (255,255,0) to green (0,128,0)
	let rr, gg, bb;
	if (r <= 5) {
		const t = r / 5; // 0..1
		rr = lerp(255, 255, t); // stays 255
		gg = lerp(0, 255, t);
		bb = lerp(0, 0, t); // stays 0
	} else {
		const t = (r - 5) / 5; // 0..1
		rr = lerp(255, 0, t);
		gg = lerp(255, 128, t);
		bb = lerp(0, 0, t);
	}

	if (format === 'rgb') return `rgb(${rr}, ${gg}, ${bb})`;

	// convert to two-digit hex
	const toHex = (n: number) => n.toString(16).padStart(2, '0');
	return `#${toHex(rr)}${toHex(gg)}${toHex(bb)}`;
}
