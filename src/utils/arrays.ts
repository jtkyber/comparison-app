import { IAttribute } from '../types/attributes.types';

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

// export function moveAttributeInArray(attributes: IAttribute[], to: number, id: number): void {
// 	attributes.sort((a, b) => a.pos - b.pos);
// 	const movedIndex = attributes.findIndex(a => a.id === id);
// 	const movedAttribute = attributes.splice(movedIndex, 1)[0];
// 	attributes.splice(to, 0, movedAttribute);

// 	for (let i = 0; i < attributes.length; i++) attributes[i].pos = i;

// 	const attrIdArray: number[] = attributes.map(a => a.id);
// }
