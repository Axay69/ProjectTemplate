import React from 'react';
import { useSelector } from 'react-redux';
import { NativeLoader } from './Loaders/NativeLoader';
import { RootState } from '@store';

const RootActivityIndicator = () => {
  const isLoading = useSelector((state: RootState) => state.ui.rootLoader);
  const loaderTitle = useSelector(
    (state: RootState) => state.ui.rootLoaderTitle,
  );

  return <NativeLoader visible={isLoading} title={loaderTitle} />;
};

export default RootActivityIndicator;
