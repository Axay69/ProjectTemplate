import Logger from '../logger';

export const retryOperation = async <T>(
  operation: () => Promise<T>,
  retries: number = 3,
): Promise<T> => {
  Logger.log(`Executing retry operation, max retries limit: ${retries}`);
  return await operation();
};
