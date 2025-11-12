import { combineReducers, configureStore, createAction, PayloadAction } from '@reduxjs/toolkit';
import comparisonReducer from './features/comparison/comparisonSlice';
import displayReducer from './features/comparison/displaySlice';
import managerReducer from './features/comparison/managerSlice';
import settingsReducer from './features/user/settingsSlice';
import userReducer from './features/user/userSlice';

const rootReducer = combineReducers({
	comparison: comparisonReducer,
	display: displayReducer,
	user: userReducer,
	manager: managerReducer,
	settings: settingsReducer,
});

export const resetStore = createAction('store/reset');

export const resettableRootReducer = (
	state: ReturnType<typeof rootReducer> | undefined,
	action: PayloadAction
) => {
	if (action.type === 'store/reset') {
		return rootReducer(undefined, action);
	}
	return rootReducer(state, action);
};

export const makeStore = () => {
	return configureStore({
		reducer: resettableRootReducer,
	});
};
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
