import { configureStore } from '@reduxjs/toolkit';
import comparisonReducer from './features/comparison/comparisonSlice';
import displayReducer from './features/comparison/displaySlice';
import managerReducer from './features/comparison/managerSlice';
import userReducer from './features/userSlice';

export const makeStore = () => {
	return configureStore({
		reducer: {
			comparison: comparisonReducer,
			display: displayReducer,
			user: userReducer,
			manager: managerReducer,
		},
	});
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
