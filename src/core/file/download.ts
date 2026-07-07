import Logger from '../logger';

export const downloadFile = async (
  url: string,
  localPath: string,
): Promise<string | null> => {
  Logger.log(
    `Downloading file from URL: ${url} to local path destination: ${localPath}`,
  );
  return localPath;
};
