import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ISettings {
	autoResize: boolean;
	selectedComparison: number;
}

const initialState: ISettings = {
	autoResize: false,
	selectedComparison: 0,
};

export const settingsSlice = createSlice({
	name: 'settings',
	initialState,
	reducers: {
		setSettings: (state, action: PayloadAction<ISettings>) => {
			return action.payload;
		},
		toggleAutoResize: state => {
			state.autoResize = !state.autoResize;
		},
		setSelectedComparison: (state, action: PayloadAction<number>) => {
			state.selectedComparison = action.payload;
		},
	},
});

export const { setSettings, toggleAutoResize, setSelectedComparison } = settingsSlice.actions;

export default settingsSlice.reducer;
