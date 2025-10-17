import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IDisplay {
	highlightedAttribute: number;
	highlightedEntry: number;
	highlightedCell: string; // attributeID-entryID
}

const initialState = {
	highlightedAttribute: 0,
	highlightedEntry: 0,
	highlightedCell: '',
};

export const displaySlice = createSlice({
	name: 'display',
	initialState,
	reducers: {
		setHighlightedAttribute: (state, action: PayloadAction<number>) => {
			state.highlightedAttribute = action.payload;
		},
		setHighlightedEntry: (state, action: PayloadAction<number>) => {
			state.highlightedEntry = action.payload;
		},
		setHighlightedCell: (state, action: PayloadAction<string>) => {
			state.highlightedCell = action.payload;
		},
	},
});

export const { setHighlightedAttribute, setHighlightedEntry, setHighlightedCell } = displaySlice.actions;

export default displaySlice.reducer;
