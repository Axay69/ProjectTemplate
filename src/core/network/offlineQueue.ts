import Logger from '../logger';

export const queueOfflineRequest = async (request: any): Promise<void> => {
  Logger.log('Queuing request for offline sync', request);
};

export const syncOfflineRequests = async (): Promise<void> => {
  Logger.log('Syncing all queued offline requests with remote servers');
};
