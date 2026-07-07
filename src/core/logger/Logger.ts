import { Platform } from 'react-native';

const isDev = __DEV__; // React Native built-in flag

class Logger {
  private static format(level: string, message: string) {
    const timestamp = new Date().toISOString();
    const platform = Platform.OS.toUpperCase();
    return `[${timestamp}] [${platform}] [${level}] ${message}`;
  }

  static log(message: string, data?: any) {
    if (!isDev) return; // skip in production
    const logMessage = this.format('log', message);
    console.log(logMessage, data ?? '');
  }

  static debug(message: string, data?: any) {
    if (!isDev) return; // skip in production
    const logMessage = this.format('DEBUG', message);
    console.debug(logMessage, data ?? '');
  }

  static warn(message: string, data?: any) {
    const logMessage = this.format('WARN', message);
    console.warn(logMessage, data ?? '');
  }

  static error(message: string, error?: any) {
    const logMessage = this.format('ERROR', message);
    console.error(logMessage, error ?? '');

    // TODO: Integrate with monitoring service (Sentry, Crashlytics, etc.)
    // Example: Sentry.captureException(error, { extra: { message } });
    // Example: crashlytics().recordError(new Error(message));
  }
}

export default Logger;
export { Logger };
