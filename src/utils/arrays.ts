export function moveArrayItem(arr: any[], to: number, from: number): any[] {
	const len = arr.length;
	if (len === 0) return [];

	const fromIdx = Math.max(0, Math.min(len - 1, from));
	const toIdx = Math.max(0, Math.min(len, to));

	if (fromIdx === toIdx) return arr.slice();

	const copy = arr.slice();
	const [item] = copy.splice(fromIdx, 1);
	if (item === undefined) return copy;
	copy.splice(toIdx, 0, item);
	return copy;
}
