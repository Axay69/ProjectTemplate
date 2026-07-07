import { RootState } from '../rootReducer';

export const selectRootLoader = (state: RootState) => state.ui.rootLoader;
export const selectRootLoaderTitle = (state: RootState) =>
  state.ui.rootLoaderTitle;
