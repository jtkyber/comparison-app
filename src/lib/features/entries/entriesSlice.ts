import { IEntry } from '@/src/types/entries';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: IEntry[] = [];

export const entriesSlice = createSlice({
	name: 'entries',
	initialState,
	reducers: {
		setEntries: (state, action: PayloadAction<IEntry[]>) => {
			return action.payload;
		},
		addEntries: (state, action: PayloadAction<IEntry>) => {
			state.push(action.payload);
		},
	},
});

export const { setEntries, addEntries } = entriesSlice.actions;
export default entriesSlice.reducer;
