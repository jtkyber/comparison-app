import { IComparisonItem } from '@/src/types/comparisons.types';
import { IUser } from '@/src/types/user.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
		removeComparison: (state, action: PayloadAction<number>) => {
			const indexToDelete = state.comparisons.findIndex(c => c.id === action.payload);
			state.comparisons.splice(indexToDelete, 1);
		},
	},
});

export const { setUser, setUserComparisons, removeComparison } = userSlice.actions;

export default userSlice.reducer;
