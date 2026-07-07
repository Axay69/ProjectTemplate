import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { mmkvStorage } from '@core/storage';
import rootReducer from './rootReducer';

const persistConfig = {
  key: 'root',
  storage: mmkvStorage,
  whitelist: ['auth'], // Persist auth state only
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: __DEV__,
});

export const persistor = persistStore(store);

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;

export * from './auth';
export * from './ui';
export type { RootState } from './rootReducer';
