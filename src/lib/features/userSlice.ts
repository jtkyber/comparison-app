import { IComparisonItem } from '@/src/types/comparisons.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IUser {
	id: number;
	username: string;
	comparisons: IComparisonItem[];
}

const initialState: IUser = {
	id: 0,
	username: '',
	comparisons: [],
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<IUser>) => {
			return action.payload;
		},
		setUserComparisons: (state, action: PayloadAction<IComparisonItem[]>) => {
			state.comparisons = action.payload;
		},
	},
});

export const { setUser, setUserComparisons } = userSlice.actions;

export default userSlice.reducer;
