import { IComparisonItem } from './comparisons.types';

export interface IUser {
	username: string;
	comparisons: IComparisonItem[];
}
