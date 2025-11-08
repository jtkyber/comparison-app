import { ISettings } from '@/src/types/settings.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ISettings = {
	fitColMin: false,
	selectedComparison: 0,
	colorCellsByRating: true,
	tableZoom: 1,
};

export const settingsSlice = createSlice({
	name: 'settings',
	initialState,
	reducers: {
		setSettings: (state, action: PayloadAction<ISettings>) => {
			return action.payload;
		},
		toggleFitColMin: state => {
			state.fitColMin = !state.fitColMin;
		},
		setSelectedComparison: (state, action: PayloadAction<number>) => {
			state.selectedComparison = action.payload;
		},
		toggleColorCellsByRating: state => {
			state.colorCellsByRating = !state.colorCellsByRating;
		},
		updateTableZoom: (state, action: PayloadAction<number>) => {
			if (!state.tableZoom || typeof action.payload !== 'number') state.tableZoom = 1;
			else state.tableZoom -= action.payload;
		},
	},
});

export const {
	setSettings,
	toggleFitColMin,
	setSelectedComparison,
	toggleColorCellsByRating,
	updateTableZoom,
} = settingsSlice.actions;

export default settingsSlice.reducer;
