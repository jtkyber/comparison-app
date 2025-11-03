import { IAttribute } from './attributes.types';
import { IEntry } from './entries.types';

export interface IComparisonItem {
	id: number;
	name: string;
}

export interface IComparison {
	id: number;
	name: string;
	attributes: IAttribute[];
	entries: IEntry[];
}
