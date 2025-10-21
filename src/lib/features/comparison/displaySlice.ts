import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IDisplay {
	highlightedAttribute: number;
	highlightedEntry: number;
	entryRatings: {
		[key: number]: {
			// key = entryID
			rating: number;
			[key: number]: number;
			//key = attributeID
		};
	};
}

const initialState: IDisplay = {
	highlightedAttribute: 0,
	highlightedEntry: 0,
	entryRatings: {},
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
		setEntryCellRating: (
			state,
			action: PayloadAction<{ entryID: number; attributeID: number; rating: number }>
		) => {
			state.entryRatings = {
				...state.entryRatings,
				[action.payload.entryID]: {
					...state.entryRatings[action.payload.entryID],
					[action.payload.attributeID]: action.payload.rating,
				},
			};
		},
		setEntryFinalRating: (state, action: PayloadAction<{ entryID: number; rating: number }>) => {
			state.entryRatings = {
				...state.entryRatings,
				[action.payload.entryID]: {
					...state.entryRatings[action.payload.entryID],
					rating: action.payload.rating,
				},
			};
		},
	},
});

export const { setHighlightedAttribute, setHighlightedEntry, setEntryCellRating, setEntryFinalRating } =
	displaySlice.actions;

export default displaySlice.reducer;
