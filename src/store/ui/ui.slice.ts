import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActivityIndicatorState } from './ui.types';

const initialState: ActivityIndicatorState = {
  rootLoader: false,
  rootLoaderTitle: '',
};

const activityIndicatorSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showActivityIndicator: (state, action: PayloadAction<string>) => {
      state.rootLoader = true;
      state.rootLoaderTitle = action.payload;
    },
    hideActivityIndicator: state => {
      state.rootLoader = false;
      state.rootLoaderTitle = '';
    },
  },
});

export const { showActivityIndicator, hideActivityIndicator } =
  activityIndicatorSlice.actions;

export const uiReducer = activityIndicatorSlice.reducer;

// Action creators for compatibility / convenience
export const setLoader = (show: boolean, text: string = '') => {
  return show ? showActivityIndicator(text) : hideActivityIndicator();
};

export const rootLoader = setLoader;
