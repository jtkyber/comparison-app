import { ISettings } from '@/src/types/settings.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ISettings = {
	fitColMin: false,
	selectedComparison: 0,
	colorCellsByRating: true,
	tableZoom: 1,
	managerWidth: null,
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
			const zoomInc = action.payload;

			if (!state.tableZoom || typeof zoomInc !== 'number') state.tableZoom = 1;
			else if (state.tableZoom - zoomInc >= 3) {
				state.tableZoom = 3;
			} else if (state.tableZoom - zoomInc <= 0.5) {
				state.tableZoom = 0.5;
			} else state.tableZoom -= zoomInc;
		},
		setManagerWidth: (state, action: PayloadAction<number>) => {
			state.managerWidth = action.payload;
		},
	},
});

export const {
	setSettings,
	toggleFitColMin,
	setSelectedComparison,
	toggleColorCellsByRating,
	updateTableZoom,
	setManagerWidth,
} = settingsSlice.actions;

export default settingsSlice.reducer;
