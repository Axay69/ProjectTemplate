import { Keyboard, TextInput, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  InputField,
  MyText,
  PrimaryButton,
  ScreenContainer,
  Spacer as SpacerView,
  TitleHeader,
} from '@shared/components';
import { styles } from './styles';
import { useAuthNavigation } from '@app/navigation';
import { fonts } from '@theme/index';
import { leftBackIcon } from '@shared/assets/icons';
import { strings, passwordRegex } from '@shared/constants/index';
import { useRoute } from '@react-navigation/native';
import { ToastManager } from '@shared/utils/toast/ToastManager';
import { resetPassword } from '@features/auth/services';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '@app/navigation/types';

export type ResetPasswordRouteProp = RouteProp<
  AuthStackParamList,
  'ResetPasswordScreen'
>;

const ResetPasswordScreen = () => {
  const route = useRoute<ResetPasswordRouteProp>();

  const { email } = route.params || {};

  const navigation = useAuthNavigation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const passwordRef = useRef<TextInput | null>(null);
  const confirmPasswordRef = useRef<TextInput | null>(null);

  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [passwordSecure, setPasswordSecure] = useState(true);
  const [confirmPasswordSecure, setConfirmPasswordSecure] = useState(true);

  useEffect(() => {
    if (!password.trim()) setPasswordError('');
    else if (!passwordRegex.test(password))
      setPasswordError(strings.changePasswordText);
    else if (/\s/.test(password))
      setPasswordError(strings.passwordCannotContainSpaces);
    else setPasswordError('');
  }, [password]);

  useEffect(() => {
    if (!confirmPassword.trim()) setConfirmPasswordError('');
    else if (!passwordRegex.test(confirmPassword))
      setConfirmPasswordError(strings.changeConfirmPasswordText);
    else if (/\s/.test(confirmPassword))
      setConfirmPasswordError(strings.confirmPasswordCannotContainSpaces);
    else if (confirmPassword !== password)
      setConfirmPasswordError(strings.passwordsDoNotMatch);
    else setConfirmPasswordError('');
  }, [confirmPassword, password]);

  const handleResetPassword = async () => {
    let valid = true;
    Keyboard.dismiss();

    if (!password.trim()) {
      setPasswordError(strings.pleaseEnterPassword);
      valid = false;
    } else if (password.length < 6) {
      setPasswordError(strings.confirmPasswordMinLength);
      valid = false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError(strings.changePasswordText);
      valid = false;
    } else if (/\s/.test(password)) {
      setPasswordError(strings.passwordCannotContainSpaces);
      valid = false;
    } else {
      setPasswordError('');
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError(strings.enterConfirmPassword);
      valid = false;
    } else if (confirmPassword.length < 6) {
      setConfirmPasswordError(strings.confirmPasswordMinLength);
      valid = false;
    } else if (!passwordRegex.test(confirmPassword)) {
      setConfirmPasswordError(strings.changeConfirmPasswordText);
      valid = false;
    } else if (/\s/.test(confirmPassword)) {
      setConfirmPasswordError(strings.confirmPasswordCannotContainSpaces);
      valid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError(strings.passwordsDoNotMatch);
      valid = false;
    } else {
      setConfirmPasswordError('');
    }
    if (!valid) return;
    const params = {
      email_address: email || '',
      password,
    };
    await requestResetPassword(params);
  };

  const requestResetPassword = async (params: {
    email_address: string;
    password: string;
  }) => {
    // dispatch(rootLoader(true));

    const response = await resetPassword(params);
    if (response.success) {
      // ToastManager.showSuccess(response.message!);
    } else {
      ToastManager.showError(response.message!);
    }
    // dispatch(rootLoader(false));
  };

  return (
    <ScreenContainer>
      <TitleHeader
        leftIcon={leftBackIcon}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.marginContainer}>
        <SpacerView height={15} />
        <MyText style={styles.resetYourPasswordText}>
          {strings.resetYourPassword}
        </MyText>
        <SpacerView height={5} />
        <MyText style={styles.resetYourPasswordDesc}>
          {strings.resetYourPasswordDesc}
        </MyText>
        <SpacerView height={25} />
        <InputField
          ref={passwordRef}
          value={password}
          onChangeText={setPassword}
          placeholder={strings.password}
          maxLength={16}
          textInputStyle={{ fontFamily: fonts.Medium }}
          secureText={passwordSecure}
          secureTextOption={true}
          setSecureText={setPasswordSecure}
          errorMsg={passwordError}
          onSubmitEditing={() => confirmPasswordRef.current?.focus()}
        />
        <SpacerView height={20} />
        <InputField
          ref={confirmPasswordRef}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder={strings.confirmPassword}
          maxLength={16}
          secureText={confirmPasswordSecure}
          secureTextOption={true}
          setSecureText={setConfirmPasswordSecure}
          errorMsg={confirmPasswordError}
        />
      </View>
      <View style={styles.bottomView}>
        <PrimaryButton
          title={strings.resetPassword}
          onPress={handleResetPassword}
        />
      </View>
      <SpacerView height={100} />
    </ScreenContainer>
  );
};

export default ResetPasswordScreen;
