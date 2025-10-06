import { IComparison } from './comparisons';

export interface IUser {
	username: string;
	comparisons: IComparison[];
}
