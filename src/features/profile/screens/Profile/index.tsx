import { Image, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';

import { styles } from './styles';

import { getSafeAuth } from '@core/firebase';
import { useDashboardNavigation } from '@app/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@store';
import { deleteUserAccount } from '@features/profile/services/profile.service';
import { logoutUser } from '@features/auth/services/auth.service';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Logger from '@core/logger';
import { ToastManager } from '@shared/utils/toast/ToastManager';
import {
  ScreenContainer,
  TitleHeader,
  Spacer as SpacerView,
  FastImage as FastImages,
  DeleteBottomSheet,
} from '@shared/components';
import { editProfileIcon, emailIcon, leftBackIcon } from '@shared/assets/icons';
import { strings } from '@shared/constants/index';
import { colors } from '@theme/index';

const ProfileScreen = () => {
  const navigation = useDashboardNavigation();
  const [showDeleteConfirmation, setDeleteBottomSheetShow] = useState(false);

  const auth = getSafeAuth();
  const dispatch = useDispatch<AppDispatch>();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  const handleDeleteAccount = async () => {
    setDeleteBottomSheetShow(false);
    // TODO: Implement root loader
    // dispatch(rootLoader(true));

    const response = await deleteUserAccount();
    if (response?.success) {
      if (userInfo?.is_social_login) {
        try {
          switch (userInfo?.social_media_type) {
            case 'google':
              await GoogleSignin.signOut();
              if (auth) await auth.signOut();
              break;
            case 'apple':
              if (auth) await auth.signOut();
              break;
          }
        } catch (socialError) {
          Logger.log('Social logout error:', socialError);

          if (userInfo?.social_media_type === 'google') {
            await GoogleSignin.signOut();
          }
        }
      }

      await dispatch(logoutUser());

      ToastManager.showSuccess(response.message!);
    } else {
      ToastManager.showError(response?.message || 'Failed to delete account');
    }

    // dispatch(rootLoader(false));
  };
  const fullName = `${userInfo?.first_name ?? ''} ${
    userInfo?.last_name ?? ''
  }`.trim();

  const handleShowDelete = React.useCallback(() => {
    setDeleteBottomSheetShow(true);
  }, []);

  const handleGoBack = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleNavigateEdit = React.useCallback(() => {
    navigation.navigateToEditProfile();
  }, [navigation]);

  return (
    <>
      <ScreenContainer>
        <TitleHeader
          leftIcon={leftBackIcon}
          title={strings.profile}
          onPressLeft={handleGoBack}
          rightIcon={editProfileIcon}
          onPressRight={handleNavigateEdit}
        />
        <View style={styles.innerMainView}>
          <SpacerView height={25} />
          <View style={styles.imageMainView}>
            <FastImages
              profilePicture={userInfo?.profile_picture}
              style={styles.fastImages}
              styleActivityIndicator={styles.loader}
            />
          </View>
          <SpacerView height={20} />
          <Text style={styles.nameTxt}>{fullName}</Text>
          <SpacerView height={10} />
          <Text style={styles.nickNameTxt}>{userInfo?.user_name}</Text>
          <SpacerView height={10} />
          <View style={styles.viewLine} />
          <SpacerView height={15} />
          <View style={styles.emailView}>
            <Image
              source={emailIcon}
              style={styles.emailIcon}
              tintColor={colors.black50}
            />
            <Text style={styles.emailTxt}>{userInfo?.email_address}</Text>
          </View>
        </View>

        <View style={styles.deleteAccountContainer}>
          <TouchableOpacity
            style={styles.deleteAccountButton}
            onPress={handleShowDelete}
          >
            <Text style={styles.deleteAccountText}>
              {strings.delete_account.toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
      <DeleteBottomSheet
        visible={showDeleteConfirmation}
        onClose={() => setDeleteBottomSheetShow(false)}
        onConfirm={handleDeleteAccount}
        title={strings.delete_account}
        message={strings.deleteAccountConfirmation}
        cancelText={strings.cancel.toUpperCase()}
        confirmText={strings.delete.toUpperCase()}
        isForceClose={false}
        initialIndex={-1}
        description={strings.deleteAccountDesc}
      />
    </>
  );
};

export default ProfileScreen;
