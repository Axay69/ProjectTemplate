import Logger from '../logger';

export const handleIncomingUrl = (url: string): void => {
  Logger.log(`Handling deep link URL redirection: ${url}`);
};
