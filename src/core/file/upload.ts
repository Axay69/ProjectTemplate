import Logger from '../logger';

export const uploadFile = async (
  uri: string,
  destPath: string,
): Promise<string | null> => {
  Logger.log(
    `Uploading file from local URI: ${uri} to target destination: ${destPath}`,
  );
  return destPath;
};
