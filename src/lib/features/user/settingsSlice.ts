import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ISettings {
	autoResize: boolean;
}

const initialState: ISettings = {
	autoResize: false,
};

export const settingsSlice = createSlice({
	name: 'settings',
	initialState,
	reducers: {
		toggleAutoResize: state => {
			state.autoResize = !state.autoResize;
		},
	},
});

export const { toggleAutoResize } = settingsSlice.actions;

export default settingsSlice.reducer;
