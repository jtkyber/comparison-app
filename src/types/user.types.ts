import { IComparisonItem } from './comparisons.types';

export interface IUser {
	id: number;
	username: string;
	comparisons: IComparisonItem[];
}
