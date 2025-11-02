import { EditingIndex, TableManagerMode } from '@/src/types/table_manager.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IManager {
	mode: TableManagerMode;
	editingIndex: EditingIndex;
	entryAttributeID: number | null;
}

const initialState: IManager = {
	mode: 'attributes',
	editingIndex: null,
	entryAttributeID: null,
};

export const managerSlice = createSlice({
	name: 'manager',
	initialState,
	reducers: {
		setMode: (state, action: PayloadAction<TableManagerMode>) => {
			state.mode = action.payload;
		},
		setEditingIndex: (state, action: PayloadAction<EditingIndex>) => {
			state.editingIndex = action.payload;
		},
		setEntryAttributeID: (state, action: PayloadAction<number | null>) => {
			state.entryAttributeID = action.payload;
		},
	},
});

export const { setMode, setEditingIndex, setEntryAttributeID } = managerSlice.actions;

export default managerSlice.reducer;
