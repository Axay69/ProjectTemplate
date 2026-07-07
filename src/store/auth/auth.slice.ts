import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInfo, UserState } from './auth.types';

const initialState: UserState = {
  userInfo: null,
  apiHeader: null,
};

const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<Partial<UserInfo>>) => {
      if (state.userInfo) {
        state.userInfo = { ...state.userInfo, ...action.payload };
      } else {
        state.userInfo = { ...action.payload } as UserInfo;
      }
    },
    setApiHeader: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken?: string }>,
    ) => {
      state.apiHeader = action.payload.accessToken;
      if (action.payload.refreshToken && state.userInfo) {
        state.userInfo.token = action.payload.accessToken;
        state.userInfo.refresh_token = action.payload.refreshToken;
      }
    },
    resetUser: state => {
      state.userInfo = null;
      state.apiHeader = null;
    },
  },
});

export const { setUserInfo, setApiHeader, resetUser } = userSlice.actions;
export const authReducer = userSlice.reducer;
