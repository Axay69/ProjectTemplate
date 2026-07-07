import {
  Keyboard,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';

import { styles } from './styles';

import { ImageData } from './types';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo, RootState } from '@store';
import { strings, nameRegex, nickNameRegex } from '@shared/constants/index';
import { ToastManager } from '@shared/utils/toast/ToastManager';
import {
  ScreenContainer,
  TitleHeader,
  Spacer as SpacerView,
  FastImage as FastImages,
  InputField,
  PrimaryButton,
} from '@shared/components';
import { leftBackIcon } from '@shared/assets/icons';
import NetInfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import Logger from '@core/logger';
import { pickAndCompressImage } from '@modules/imagePicker/ImagePicker';
import { deleteImageToS3Bucket, uploadImageToS3Bucket } from '@core/file';
import { editProfile } from '@features/profile/services/profile.service';
const EditProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  const nameRef = useRef<TextInput | null>(null);
  const nickNameRef = useRef<TextInput | null>(null);
  const lastNameRef = useRef<TextInput | null>(null);

  const [name, setName] = useState(userInfo?.first_name ?? '');
  const [nickName, setNickName] = useState(userInfo?.user_name ?? '');
  const [lastName, setLastName] = useState(userInfo?.last_name ?? '');

  const [nameError, setNameError] = useState('');
  const [nickNameError, setNickNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');

  // Track profile image
  const [profilePicture, setProfilePicture] = useState<ImageData>({
    uri: userInfo?.profile_picture || '',
    name: '',
    type: '',
  });

  // Name validation
  useEffect(() => {
    if (!name.trim()) setNameError('');
    else if (name.trim().length < 3)
      setNameError(strings.minLengthErrFullNameError);
    else if (!nameRegex.test(name.trim()))
      setNameError(strings.validFullNameError);
    else if (name.startsWith(' ')) setNameError(strings.fullName_error);
    else if (name.includes('  '))
      setNameError(strings.nameCannotHaveMultipleSpaces);
    else if (name.trim().endsWith(' '))
      setNameError(strings.nameCannotEndWithSpace);
    else setNameError('');
  }, [name]);

  useEffect(() => {
    if (!lastName.trim()) {
      setLastNameError('');
    } else if (lastName.trim().length < 3) {
      setLastNameError(strings.minLengthErrLastNameError);
    } else if (!nameRegex.test(lastName?.trim())) {
      setLastNameError(strings.validLastNameError);
    } else if (lastName.startsWith(' ')) {
      setLastNameError(strings.lastName_error);
    } else if (lastName.includes('  ')) {
      setLastNameError(strings.lastNameCannotHaveMultipleSpaces);
    } else if (lastName.trim().endsWith(' ')) {
      setLastNameError(strings.lastNameCannotEndWithSpace);
    } else {
      setLastNameError('');
    }
  }, [lastName]);

  // Nickname validation
  useEffect(() => {
    if (!nickName.trim()) setNickNameError('');
    else if (nickName.trim().length < 3)
      setNickNameError(strings.nickName_length);
    else if (!nickNameRegex.test(nickName.trim()))
      setNickNameError(strings.enter_nick_name);
    else if (nickName.startsWith(' '))
      setNickNameError(strings.lastName_cannot_start_space);
    else if (nickName.includes('  '))
      setNickNameError(strings.nickName_multiple_space);
    else if (nickName.trim().endsWith(' '))
      setNickNameError(strings.nickName_cannot_end_space);
    else setNickNameError('');
  }, [nickName]);

  const openImagePicker = async () => {
    const imageData = await pickAndCompressImage();
    if (imageData) {
      let fileUri = imageData.path;

      // iOS requires file:// prefix
      if (Platform.OS === 'ios' && !fileUri.startsWith('file://')) {
        fileUri = `file://${fileUri}`; // ✅ use template literal instead of +
      }

      const file: ImageData = {
        uri: fileUri,
        name: imageData.filename,
        type: imageData.mime,
      };
      setProfilePicture(file);
    }
  };

  const handleEditProfile = async () => {
    Keyboard.dismiss();

    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      ToastManager.showError(strings.currentlyOffline);
      return;
    }

    // -------- Validate Name --------
    let valid = true;
    if (!name.trim()) {
      setNameError(strings.pleaseEnterFullName);
      valid = false;
    } else if (name.trim().length < 3) {
      setNameError(strings.minLengthErrFullNameError);
      valid = false;
    } else if (!nameRegex.test(name?.trim())) {
      setNameError(strings.validFullNameError);
      valid = false;
    } else if (name.startsWith(' ')) {
      setNameError(strings.fullName_error);
      valid = false;
    } else if (name.includes('  ')) {
      setNameError(strings.nameCannotHaveMultipleSpaces);
      valid = false;
    } else if (name.trim().endsWith(' ')) {
      setNameError(strings.nameCannotEndWithSpace);
      valid = false;
    } else {
      setNameError('');
    }

    if (!lastName.trim()) {
      setLastNameError(strings.pleaseEnterLastName);
      valid = false;
    } else if (lastName.trim().length < 3) {
      setLastNameError(strings.minLengthErrLastNameError);
      valid = false;
    } else if (!nameRegex.test(lastName?.trim())) {
      setLastNameError(strings.validLastNameError);
      valid = false;
    } else if (lastName.startsWith(' ')) {
      setLastNameError(strings.lastName_error);
      valid = false;
    } else if (lastName.includes('  ')) {
      setLastNameError(strings.lastNameCannotHaveMultipleSpaces);
      valid = false;
    } else if (lastName.trim().endsWith(' ')) {
      setLastNameError(strings.lastNameCannotEndWithSpace);
      valid = false;
    } else {
      setLastNameError('');
    }

    if (!nickName.trim()) {
      setNickNameError(strings.enter_nickName);
      valid = false;
    } else if (nickName.trim().length < 3) {
      setNickNameError(strings.nickName_length);
      valid = false;
    } else if (!nickNameRegex.test(nickName?.trim())) {
      setNickNameError(strings.enter_nick_name);
      valid = false;
    } else if (nickName.startsWith(' ')) {
      setNickNameError(strings.lastName_cannot_start_space);
      valid = false;
    } else if (nickName.includes('  ')) {
      setNickNameError(strings.nickName_multiple_space);
      valid = false;
    } else if (nickName.trim().endsWith(' ')) {
      setNickNameError(strings.nickName_cannot_end_space);
      valid = false;
    } else {
      setNickNameError('');
    }
    if (!valid) return;

    // TODO: Implement root loader
    // dispatch(rootLoader(true));

    let uploadedPath: string | null = null;

    const isNewImagePicked =
      profilePicture.uri &&
      profilePicture.uri !== userInfo?.profile_picture &&
      profilePicture.name;

    if (isNewImagePicked) {
      uploadedPath = await uploadImageToS3Bucket(profilePicture);

      if (!uploadedPath) {
        ToastManager.showError(strings.imageUploadFailed);
        Logger.log(strings.imageUploadFailed);
        // dispatch(rootLoader(false));
        return;
      }
    }

    const request = {
      first_name: name.trim(),
      last_name: lastName.trim(),
      user_name: nickName.trim(),
      profile_picture: uploadedPath || userInfo?.profile_picture || '',
    };

    const response = await editProfile(request);

    if (response.success) {
      if (userInfo?.profile_picture && uploadedPath) {
        await deleteImageToS3Bucket(userInfo.profile_picture);
      }

      const updatedUserInfo = {
        ...userInfo,
        first_name: response.data?.first_name || name,
        last_name: response.data?.last_name || lastName,
        user_name: response.data?.user_name || nickName,
        profile_picture:
          response.data?.profile_picture || userInfo?.profile_picture,
      };

      dispatch(setUserInfo(updatedUserInfo));

      ToastManager.showSuccess(response.message!);
      navigation.goBack();
    } else {
      ToastManager.showError(response.message!);
    }

    // dispatch(rootLoader(false));
  };

  return (
    <ScreenContainer>
      <TitleHeader
        leftIcon={leftBackIcon}
        title={strings.edit_profile}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.innerMainView}>
        <SpacerView height={25} />
        <View style={styles.imageMainView}>
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={openImagePicker}
          >
            <FastImages
              profilePicture={profilePicture.uri}
              style={styles.fastImages}
              styleActivityIndicator={styles.loader}
            />
          </TouchableOpacity>

          <>
            <SpacerView height={10} />
            <Text style={styles.changeProfileImage}>
              {strings.changeProfileImage}
            </Text>
          </>
        </View>
        <SpacerView height={30} />
        <InputField
          ref={nameRef}
          value={name}
          onChangeText={setName}
          placeholder={strings.firstName}
          errorMsg={nameError}
          maxLength={15}
          autoCapitalize="none"
          onSubmitEditing={() => lastNameRef.current?.focus()}
        />
        <SpacerView height={20} />
        <InputField
          ref={lastNameRef}
          value={lastName}
          onChangeText={setLastName}
          placeholder={strings.lastName}
          errorMsg={lastNameError}
          maxLength={15}
          autoCapitalize="none"
          onSubmitEditing={() => nickNameRef.current?.focus()}
        />
        <SpacerView height={20} />

        <InputField
          ref={nickNameRef}
          value={nickName ?? ''}
          onChangeText={setNickName}
          placeholder={strings.enter_nickname}
          errorMsg={nickNameError}
          keyboardType="default"
          autoCapitalize="none"
          maxLength={25}
        />

        <SpacerView height={100} />
      </View>

      <View style={styles.bottomView}>
        <PrimaryButton title={strings.save} onPress={handleEditProfile} />
      </View>
    </ScreenContainer>
  );
};

export default EditProfileScreen;
