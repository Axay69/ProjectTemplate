import { RootState } from '../rootReducer';

export const selectUserInfo = (state: RootState) => state.auth.userInfo;
export const selectApiHeader = (state: RootState) => state.auth.apiHeader;
export const selectIsLoggedIn = (state: RootState) => !!state.auth.apiHeader;
