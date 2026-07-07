import { Keyboard, Text, TextInput, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { styles } from './styles';
import { useAuthNavigation } from '@app/navigation';
import { strings, emailRegex } from '@shared/constants/index';
import { useDispatch } from 'react-redux';
import {
  InputField,
  PrimaryButton,
  ScreenContainer,
  Spacer as SpacerView,
  TitleHeader,
} from '@shared/components';
import { leftBackIcon } from '@shared/assets/icons';
import { ToastManager } from '@shared/utils/toast/ToastManager';
import { forgotPassword } from '@features/auth/services';
import { rootLoader } from '@store';

const ForgotPasswordScreen = () => {
  const dispatch = useDispatch();
  const navigation = useAuthNavigation();
  const emailRef = useRef<TextInput | null>(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (!email.trim()) setEmailError('');
    else if (!emailRegex.test(email))
      setEmailError(strings.pleaseEnterValidEmail);
    else if (/[A-Z]/.test(email)) setEmailError(strings.emailLowercaseOnly);
    else setEmailError('');
  }, [email]);

  const handleForgotPassword = async () => {
    let valid = true;
    Keyboard.dismiss();

    if (!email.trim()) {
      setEmailError(strings.pleaseEnterEmail);
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError(strings.pleaseEnterValidEmail);
      valid = false;
    } else if (/[A-Z]/.test(email)) {
      setEmailError(strings.emailLowercaseOnly);
      valid = false;
    } else {
      setEmailError('');
    }
    if (!valid) return;
    const params = {
      email_address: email,
    };
    await requestForgotPassword(params);
  };

  const requestForgotPassword = async (params: { email_address: string }) => {
    dispatch(rootLoader(true));

    const apiResponse = await forgotPassword(params);
    if (apiResponse.success) {
      ToastManager.showSuccess(apiResponse.message!);
      navigation.navigateToCodeVerification({ email });
    } else {
      ToastManager.showError(apiResponse.message!);
    }
    dispatch(rootLoader(false));
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
        <Text style={styles.forgotPasswordText}>{strings.forgotPassword}</Text>
        <SpacerView height={5} />
        <Text style={styles.forgotPasswordDesc}>
          {strings.forgotPasswordDesc}
        </Text>
        <SpacerView height={25} />
        <InputField
          ref={emailRef}
          value={email}
          onChangeText={setEmail}
          placeholder={strings.emailAddress}
          errorMsg={emailError}
          maxLength={50}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>
      <View style={styles.bottomView}>
        <PrimaryButton title={strings.submit} onPress={handleForgotPassword} />
      </View>
    </ScreenContainer>
  );
};

export default ForgotPasswordScreen;
