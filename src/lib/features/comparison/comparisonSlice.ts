import { AttributeType, IAttribute } from '@/src/types/attributes.types';
import { IComparison } from '@/src/types/comparisons.types';
import { CellType, IEntry } from '@/src/types/entries.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: IComparison = {
	id: 0,
	name: '',
	attributes: [],
	entries: [],
};

export const comparisonSlice = createSlice({
	name: 'comparison',
	initialState,
	reducers: {
		setComparison: (state, action: PayloadAction<IComparison>) => {
			return action.payload;
		},
		addAttribute: (state, action: PayloadAction<{ attribute: IAttribute; value: CellType }>) => {
			const idExists: boolean = state.attributes.some(attr => attr.id === action.payload.attribute.id);
			if (!idExists) {
				state.attributes.push(action.payload.attribute);

				const newEntries = state.entries.map(entry => {
					entry.values[action.payload.attribute.id] = action.payload.value;
					return entry;
				});
				state.entries = newEntries;
			}
		},
		removeAttribute: (state, action: PayloadAction<number>) => {
			const idExists: boolean = state.attributes.some(attr => attr.id === action.payload);
			if (idExists) {
				state.entries.forEach(entry => {
					delete (entry as any)[action.payload];
				});

				state.attributes = state.attributes.filter(attr => attr.id !== action.payload);
			}
		},
		setAttributeName: (state, action: PayloadAction<{ index: number; value: string }>) => {
			state.attributes[action.payload.index].name = action.payload.value;
		},
		setAttributePrefix: (state, action: PayloadAction<{ index: number; value: string }>) => {
			state.attributes[action.payload.index].prefix = action.payload.value;
		},
		setAttributeSuffix: (state, action: PayloadAction<{ index: number; value: string }>) => {
			state.attributes[action.payload.index].suffix = action.payload.value;
		},
		setAttributeType: (state, action: PayloadAction<{ index: number; value: AttributeType }>) => {
			state.attributes[action.payload.index].type = action.payload.value;
		},
		setAttributeRangeLength: (state, action: PayloadAction<{ index: number; value: 2 | 3 }>) => {
			const rangeDefault: [number, number] | [number, number, number] =
				action.payload.value === 2 ? [0, 50] : [0, 50, 100];
			state.attributes[action.payload.index].range = rangeDefault;
		},
		setAttributeRangeValue: (
			state,
			action: PayloadAction<{ index: number; rangeIndex: 0 | 1 | 2; value: number }>
		) => {
			state.attributes[action.payload.index].range[action.payload.rangeIndex] = action.payload.value;
		},
		setAttributeBestIndex: (state, action: PayloadAction<{ index: number; value: 0 | 1 | 2 }>) => {
			state.attributes[action.payload.index].bestIndex = action.payload.value;
		},
		setAttributeSelfRated: (state, action: PayloadAction<{ index: number; value: boolean }>) => {
			state.attributes[action.payload.index].selfRated = action.payload.value;
		},
		setAttributeImportance: (state, action: PayloadAction<{ index: number; value: number }>) => {
			state.attributes[action.payload.index].importance = action.payload.value;
		},
		addEntry: (state, action: PayloadAction<IEntry>) => {
			const idExists: boolean = state.entries.some(e => e.id === action.payload.id);
			if (!idExists) state.entries.push(action.payload);
		},
		setEntryName: (state, action: PayloadAction<{ index: number; value: string }>) => {
			state.entries[action.payload.index].name = action.payload.value;
		},
	},
});

export const {
	setComparison,
	addAttribute,
	removeAttribute,
	setAttributeName,
	setAttributePrefix,
	setAttributeSuffix,
	setAttributeType,
	setAttributeRangeLength,
	setAttributeRangeValue,
	setAttributeBestIndex,
	setAttributeSelfRated,
	setAttributeImportance,
	addEntry,
	setEntryName,
} = comparisonSlice.actions;
export default comparisonSlice.reducer;
