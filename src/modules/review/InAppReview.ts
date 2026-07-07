import { Linking, NativeModules, Platform } from 'react-native';
import SpInAppUpdates, {
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';
import DeviceInfo from 'react-native-device-info';
import { ToastManager } from '@shared/utils/toast/ToastManager';

const { InAppStorePage } = NativeModules;

// Debug mode flag - set to true to simulate in-app updates in debug builds
// NOTE: This will NOT actually perform updates, just simulate the flow
const ENABLE_DEBUG_MOCK_MODE = __DEV__ && false; // Set to true to enable mock mode

const openPlayStorePage = async (packageName: string): Promise<void> => {
  try {
    const playStoreUrl = `market://details?id=${packageName}`;
    const canOpen = await Linking.canOpenURL(playStoreUrl);

    if (canOpen) {
      await Linking.openURL(playStoreUrl);
    } else {
      const webUrl = `https://play.google.com/store/apps/details?id=${packageName}`;
      await Linking.openURL(webUrl);
    }
  } catch (error) {
    console.error('Failed to open Play Store:', error);
    ToastManager.showError('Failed to open Play Store');
  }
};

const isInstalledFromPlayStore = async (): Promise<boolean> => {
  try {
    const installerPackageName = await DeviceInfo.getInstallerPackageName();
    return installerPackageName === 'com.android.vending';
  } catch (error) {
    console.log('Could not check installer package:', error);
    return true;
  }
};

export const openStorePage = async (appId: string): Promise<void> => {
  if (Platform.OS === 'ios') {
    if (InAppStorePage) {
      InAppStorePage.open(appId);
    } else {
      console.warn('InAppStorePage native module is not available.');
    }
    return;
  }
  if (Platform.OS === 'android') {
    try {
      const packageName = await DeviceInfo.getBundleId();
      const installedFromPlayStore = await isInstalledFromPlayStore();

      // Debug Mock Mode - Simulate in-app update flow for testing
      if (ENABLE_DEBUG_MOCK_MODE && !installedFromPlayStore) {
        console.log('🔧 DEBUG MOCK MODE: Simulating in-app update flow...');
        ToastManager.showInfo('🔧 Debug Mode: Simulating update check...');

        // Simulate update check delay
        await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));

        // Simulate update available scenario
        const simulateUpdate = true; // Change to false to test "no update" scenario

        if (simulateUpdate) {
          ToastManager.showInfo(
            '🔧 Debug Mode: Update available! (This is a simulation)',
          );
          console.log('🔧 DEBUG: Would start in-app update here');
          // In real scenario, this would trigger the update dialog
          // For now, we'll just show a message and open Play Store
          setTimeout(() => {
            ToastManager.showInfo(
              'In production, update dialog would appear here',
            );
            openPlayStorePage(packageName);
          }, 2000);
        } else {
          ToastManager.showInfo('🔧 Debug Mode: App is up to date (simulated)');
        }
        return;
      }

      if (!installedFromPlayStore) {
        console.log(
          'App not installed from Play Store. Opening Play Store directly...',
        );
        ToastManager.showInfo('Opening Play Store to check for updates...');
        await openPlayStorePage(packageName);
        return;
      }

      console.log('Attempting in-app update check...');
      const inAppUpdates = new SpInAppUpdates(true);
      const currentVersion = await DeviceInfo.getVersion();

      inAppUpdates
        .checkNeedsUpdate({ curVersion: currentVersion })
        .then(result => {
          if (result.shouldUpdate) {
            let updateOptions: StartUpdateOptions = {};
            if (Platform.OS === 'android') {
              updateOptions = {
                updateType: IAUUpdateKind.FLEXIBLE,
              };
            }
            console.log(
              'Update available. Starting in-app update...',
              updateOptions,
            );

            inAppUpdates.startUpdate(updateOptions);
          } else {
            console.log('No update available:', result.reason);
            if (result.reason) {
              ToastManager.showInfo(result.reason || 'App is up to date');
            } else {
              ToastManager.showInfo('App is up to date');
            }
          }
        })
        .catch(async e => {
          console.error('Android in-app update error:', e);

          if (e?.code === -10 || e?.message?.includes('ERROR_APP_NOT_OWNED')) {
            console.log(
              'App not installed from Play Store (ERROR_APP_NOT_OWNED). Opening Play Store page instead',
            );
            ToastManager.showInfo('Opening Play Store to check for updates...');
            await openPlayStorePage(packageName);
          } else {
            console.log('In-app update failed, opening Play Store as fallback');
            ToastManager.showInfo('Opening Play Store to check for updates...');
            await openPlayStorePage(packageName);
          }
        });
    } catch (error) {
      console.error('Android in-app update failed:', error);
      try {
        const packageName = await DeviceInfo.getBundleId();
        await openPlayStorePage(packageName);
      } catch (fallbackError) {
        console.error('Failed to open Play Store:', fallbackError);
        ToastManager.showError(
          'Failed to check for updates. Please visit Play Store manually.',
        );
      }
    }
  }
};
