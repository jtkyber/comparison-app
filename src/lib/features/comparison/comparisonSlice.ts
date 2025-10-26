import { AttributeType, IAttribute, IKeyRatingPair, TextRatingType } from '@/src/types/attributes.types';
import { IComparison } from '@/src/types/comparisons.types';
import { CellValueType, ICellValue, IEntry } from '@/src/types/entries.types';
import { moveArrayItem } from '@/src/utils/arrays';
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
		// Attributes -----------------------------------------------------
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
		toggleAttributeHidden: (state, action: PayloadAction<number>) => {
			state.attributes[action.payload].hidden = !state.attributes[action.payload].hidden;
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
		setAttributeTextRatingType: (state, action: PayloadAction<{ index: number; value: TextRatingType }>) => {
			state.attributes[action.payload.index].textRatingType = action.payload.value;
		},
		setAttributeImportance: (state, action: PayloadAction<{ index: number; value: number }>) => {
			state.attributes[action.payload.index].importance = action.payload.value;
		},
		setNewAttributeIndex: (state, action: PayloadAction<{ to: number; from: number }>) => {
			const { to, from } = action.payload;
			state.attributes = moveArrayItem(state.attributes, to, from);
		},
		setAttributeKeyRatingPairKey: (
			state,
			action: PayloadAction<{ attrIndex: number; pairID: number; key: string }>
		) => {
			const { attrIndex, pairID, key } = action.payload;

			const keyRatingPairIndex: number = state.attributes[attrIndex].keyRatingPairs.findIndex(
				pair => pair.id === pairID
			);
			if (keyRatingPairIndex === -1) return;

			state.attributes[attrIndex].keyRatingPairs[keyRatingPairIndex].key = key;
		},
		setAttributeKeyRatingPairRating: (
			state,
			action: PayloadAction<{ attrIndex: number; pairID: number; rating: number }>
		) => {
			const { attrIndex, pairID, rating } = action.payload;

			const keyRatingPairIndex: number = state.attributes[attrIndex].keyRatingPairs.findIndex(
				pair => pair.id === pairID
			);
			if (keyRatingPairIndex === -1) return;

			state.attributes[attrIndex].keyRatingPairs[keyRatingPairIndex].rating = rating;
		},
		addKeyRatingPair: (state, action: PayloadAction<number>) => {
			const attrIndex = action.payload;

			const tempIDs = state.attributes[attrIndex].keyRatingPairs
				.filter(pair => pair.id < 0)
				.map(pair => pair.id);

			const smallestTempID = Math.min(...tempIDs);

			const newTempID = smallestTempID < 0 ? smallestTempID - 1 : -1;

			state.attributes[attrIndex].keyRatingPairs.push({
				id: newTempID,
				key: '',
				rating: 5,
			});
		},
		removeKeyRatingPair: (state, action: PayloadAction<{ attrIndex: number; pairIndex: number }>) => {
			const { attrIndex, pairIndex } = action.payload;

			state.attributes[attrIndex].keyRatingPairs.splice(pairIndex, 1);
		},
		// Entries ------------------------------------------------------
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
			action: PayloadAction<{ index: number; attrID: number; rating: number | null }>
		) => {
			const cellExists: boolean =
				state.entries[action.payload.index].cells?.[action.payload.attrID]?.value !== undefined;

			if (!cellExists) {
				state.entries[action.payload.index].cells[action.payload.attrID] = {
					value: '',
					rating: action.payload.rating,
				};
			} else state.entries[action.payload.index].cells[action.payload.attrID].rating = action.payload.rating;
		},
		toggleEntryHidden: (state, action: PayloadAction<number>) => {
			state.entries[action.payload].hidden = !state.entries[action.payload].hidden;
		},
		setNewEntryIndex: (state, action: PayloadAction<{ to: number; from: number }>) => {
			const { to, from } = action.payload;
			state.entries = moveArrayItem(state.entries, to, from);
		},
	},
});

export const {
	setComparison,
	// Attributes
	addAttribute,
	removeAttribute,
	setAttributeName,
	toggleAttributeHidden,
	setAttributePrefix,
	setAttributeSuffix,
	setAttributeType,
	setAttributeRangeLength,
	setAttributeRangeValue,
	setAttributeBestIndex,
	setAttributeTextRatingType,
	setAttributeImportance,
	setNewAttributeIndex,
	setAttributeKeyRatingPairKey,
	setAttributeKeyRatingPairRating,
	addKeyRatingPair,
	removeKeyRatingPair,
	// Entries
	addEntry,
	removeEntry,
	setEntryName,
	setEntryValue,
	setEntryRating,
	toggleEntryHidden,
	setNewEntryIndex,
} = comparisonSlice.actions;
export default comparisonSlice.reducer;
