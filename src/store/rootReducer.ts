import { combineReducers, UnknownAction } from '@reduxjs/toolkit';
import { authReducer } from './auth/auth.slice';
import { uiReducer } from './ui/ui.slice';

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const rootReducerWithReset = (
  state: RootState | undefined,
  action: UnknownAction,
) => {
  return rootReducer(state, action);
};

export default rootReducerWithReset;
