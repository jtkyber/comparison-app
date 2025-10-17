import { AttributeType, IAttribute } from '@/src/types/attributes.types';
import { IComparison } from '@/src/types/comparisons.types';
import { CellValueType, ICellValue, IEntry } from '@/src/types/entries.types';
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
		setComparison: (_state, action: PayloadAction<IComparison>) => {
			return action.payload;
		},
		addAttribute: (state, action: PayloadAction<IAttribute>) => {
			const idExists: boolean = state.attributes.some(attr => attr.id === action.payload.id);
			if (!idExists) {
				state.attributes.push(action.payload);

				for (let i = 0; i < state.entries.length; i++) {
					state.entries[i].cells = {
						...state.entries[i].cells,
						[action.payload.id]: {
							value: '',
							rating: null,
						},
					};
				}
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
		removeEntry: (state, action: PayloadAction<number>) => {
			const idExists: boolean = state.entries.some(entry => entry.id === action.payload);
			if (idExists) {
				state.entries = state.entries.filter(entry => entry.id !== action.payload);
			}
		},
		setEntryName: (state, action: PayloadAction<{ index: number; value: string }>) => {
			state.entries[action.payload.index].name = action.payload.value;
		},
		setEntryValue: (
			state,
			action: PayloadAction<{ index: number; valueKey: number; value: CellValueType }>
		) => {
			const cellExists: boolean =
				state.entries[action.payload.index].cells?.[action.payload.valueKey]?.value !== undefined;

			if (!cellExists) {
				state.entries[action.payload.index].cells[action.payload.valueKey] = {
					value: action.payload.value,
					rating: null,
				};
			} else state.entries[action.payload.index].cells[action.payload.valueKey].value = action.payload.value;
		},
		setEntryRating: (
			state,
			action: PayloadAction<{ index: number; valueKey: number; rating: number | null }>
		) => {
			const cellExists: boolean =
				state.entries[action.payload.index].cells?.[action.payload.valueKey]?.value !== undefined;

			if (!cellExists) {
				state.entries[action.payload.index].cells[action.payload.valueKey] = {
					value: '',
					rating: action.payload.rating,
				};
			} else
				state.entries[action.payload.index].cells[action.payload.valueKey].rating = action.payload.rating;
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
	removeEntry,
	setEntryName,
	setEntryValue,
	setEntryRating,
} = comparisonSlice.actions;
export default comparisonSlice.reducer;
