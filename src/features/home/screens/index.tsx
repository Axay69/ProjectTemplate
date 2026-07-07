import { View } from 'react-native';
import React, { useState } from 'react';
import { useAuthNavigation, useDashboardNavigation } from '@app/navigation';
import {
  ScreenContainer,
  PrimaryButton,
  Spacer as SpacerView,
  LogoutBottomSheet,
} from '@shared/components';
import { styles } from './styles';
import { strings } from '@shared/constants/index';
import { ToastManager } from '@shared/utils/toast/ToastManager';
import Logger from '@core/logger';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@store';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getAuth } from '@react-native-firebase/auth';
import {
  logoutUser,
  logoutUserAccount,
} from '@features/auth/services/auth.service';

const HomeScreen = () => {
  const navigation = useDashboardNavigation();
  const authNavigation = useAuthNavigation();

  const [showLogoutModel, setShowLogoutModel] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  const auth = getAuth();

  const handleLogoutAccount = async () => {
    setShowLogoutModel(false);
    // TODO: Implement root loader
    // dispatch(rootLoader(true));

    const response = await logoutUserAccount();
    if (response.success) {
      try {
        if (userInfo?.is_social_login) {
          if (userInfo.social_media_type === 'google') {
            await GoogleSignin.signOut();
            await auth.signOut();
          } else if (userInfo.social_media_type === 'apple') {
            await auth.signOut();
          }
        }
        await dispatch(logoutUser());
        ToastManager.showSuccess(response.message!);
      } catch (error) {
        Logger.log('Logout error:', error);
      }
    } else {
      ToastManager.showError(response?.message || 'Something went wrong');
    }
    // dispatch(rootLoader(false));
  };

  return (
    <>
      <ScreenContainer>
        <View style={styles.container}>
          <SpacerView height={50} />
          <PrimaryButton
            title={strings.profile}
            onPress={() => navigation.navigateToProfile()}
          />
          <SpacerView height={10} />
          <PrimaryButton
            title={strings.logOut}
            onPress={() => setShowLogoutModel(true)}
          />

          <SpacerView height={10} />
          <PrimaryButton
            title={strings.terms_conditions}
            onPress={() => {
              authNavigation.navigateToWebViewScreen({
                title: strings.terms_conditions,
                uriType: strings.terms_and_condition_type,
              });
            }}
          />
          <SpacerView height={10} />
          <PrimaryButton
            title={strings.privacy_policy}
            onPress={() => {
              authNavigation.navigateToWebViewScreen({
                title: strings.privacy_policy,
                uriType: strings.privacy_policy_type,
              });
            }}
          />
        </View>
      </ScreenContainer>
      <LogoutBottomSheet
        visible={showLogoutModel}
        onClose={() => setShowLogoutModel(false)}
        onConfirm={handleLogoutAccount}
        title={strings.logOut}
        message={strings.logoutConfirmation}
        cancelText={strings.logOut.toUpperCase()}
        confirmText={strings.cancel.toUpperCase()}
        isForceClose={false}
        initialIndex={-1}
        description={strings.logoutDesc}
      />
    </>
  );
};

export default HomeScreen;
