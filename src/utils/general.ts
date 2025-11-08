import { CellValueType } from '../types/entries.types';

export function isValidURL(text: string): boolean {
	try {
		new URL(text);
		return true;
	} catch (e) {
		return false;
	}
}

export function isNothing(value: CellValueType) {
	return value === '' || value === undefined || value === null;
}
