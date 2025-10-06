import { configureStore } from '@reduxjs/toolkit';
import attributesReducer from './features/attributes/attributesSlice';
import entriesReducer from './features/entries/entriesSlice';

export const makeStore = () => {
	return configureStore({
		reducer: {
			attributes: attributesReducer,
			entries: entriesReducer,
		},
	});
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
