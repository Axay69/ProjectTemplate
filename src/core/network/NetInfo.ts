import Logger from '../logger';

export interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: string;
}

export const getNetworkState = async (): Promise<NetworkState> => {
  Logger.log('Retrieving active network state information');
  return {
    isConnected: true,
    isInternetReachable: true,
    type: 'wifi',
  };
};
