import { IAttribute } from '@/src/types/attributes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: IAttribute[] = [];

export const attributesSlice = createSlice({
	name: 'attributes',
	initialState,
	reducers: {
		setAttributes: (state, action: PayloadAction<IAttribute[]>) => {
			return action.payload;
		},
		addAttribute: (state, action: PayloadAction<IAttribute>) => {
			state.push(action.payload);
		},
	},
});

export const { setAttributes, addAttribute } = attributesSlice.actions;
export default attributesSlice.reducer;
