import { IComparison } from './comparisons.types';

export interface IUser {
	username: string;
	comparisons: IComparison[];
}
