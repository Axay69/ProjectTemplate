import {
  TouchableOpacity,
  View,
  TextInput,
  Image,
  Keyboard,
  Platform,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  InputField,
  MyText,
  PrimaryButton,
  ScreenContainer,
  Spacer as SpacerView,
} from '@shared/components';

import { ToastManager } from '@shared/utils/toast/ToastManager';
import { useDispatch } from 'react-redux';
import { SCREEN_NAMES, useAuthNavigation } from '@app/navigation';

import { styles } from './styles';
import {
  strings,
  emailRegex,
  nameRegex,
  nickNameRegex,
  passwordRegex,
} from '@shared/constants/index';
import { colors } from '@theme/index';
import { rootLoader } from '@store';

import { selectedSquareIcon, unSelectedSquareIcon } from '@shared/assets/icons';

import { initFCM } from '@core/permissions';
import Logger from '@core/logger';
import { checkEmail, sendVerificationEmail } from '@features/auth/services';

export interface RegisterParams {
  first_name: string;
  email_address: string;
  is_social_login: boolean;
  password: string;
  device_token: string;
  device_type: string;
  user_name: string;
  last_name: string;
}

const RegisterScreen = () => {
  const dispatch = useDispatch();
  const navigation = useAuthNavigation();

  const firstNameRef = useRef<TextInput | null>(null);
  const [firstName, setFirstName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');

  const lastNameRef = useRef<TextInput | null>(null);
  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState('');

  const userNameRef = useRef<TextInput | null>(null);
  const [userName, setUserName] = useState('');
  const [userNameError, setUserNameError] = useState('');

  const emailRef = useRef<TextInput | null>(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const passwordRef = useRef<TextInput | null>(null);
  const [password, setPassword] = useState('');
  const [passwordSecure, setPasswordSecure] = useState(true);
  const [passwordError, setPasswordError] = useState('');

  const confirmPasswordRef = useRef<TextInput | null>(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordSecure, setConfirmPasswordSecure] = useState(true);
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [selectedCondition, setSelectedCondition] = useState(false);

  const [deviceToken, setDeviceToken] = useState<string | null>('');

  useEffect(() => {
    const fetchFCM = async () => {
      const token = await initFCM();
      setDeviceToken(token);
    };

    fetchFCM();
  }, []);

  useEffect(() => {
    if (!firstName.trim()) {
      setFirstNameError('');
    } else if (firstName.trim().length < 3) {
      setFirstNameError(strings.minLengthErrFullNameError);
    } else if (!nameRegex.test(firstName?.trim())) {
      setFirstNameError(strings.validFullNameError);
    } else if (firstName.startsWith(' ')) {
      setFirstNameError(strings.fullName_error);
    } else if (firstName.includes('  ')) {
      setFirstNameError(strings.nameCannotHaveMultipleSpaces);
    } else if (firstName.trim().endsWith(' ')) {
      setFirstNameError(strings.nameCannotEndWithSpace);
    } else {
      setFirstNameError('');
    }
  }, [firstName]);

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

  useEffect(() => {
    if (!userName.trim()) {
      setUserNameError('');
    } else if (userName.trim().length < 3) {
      setUserNameError(strings.nickName_length);
    } else if (!nickNameRegex.test(userName?.trim())) {
      setUserNameError(strings.enter_nick_name);
    } else if (userName.startsWith(' ')) {
      setUserNameError(strings.lastName_cannot_start_space);
    } else if (userName.includes('  ')) {
      setUserNameError(strings.nickName_multiple_space);
    } else {
      setUserNameError('');
    }
  }, [userName]);

  useEffect(() => {
    if (!email.trim()) setEmailError('');
    else if (!emailRegex.test(email))
      setEmailError(strings.pleaseEnterValidEmail);
    else if (/[A-Z]/.test(email)) setEmailError(strings.emailLowercaseOnly);
    else setEmailError('');
  }, [email]);

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

  const handleSignup = async () => {
    let valid = true;
    Keyboard.dismiss();

    if (!firstName.trim()) {
      setFirstNameError(strings.pleaseEnterFullName);
      valid = false;
    } else if (firstName.trim().length < 3) {
      setFirstNameError(strings.minLengthErrFullNameError);
      valid = false;
    } else if (!nameRegex.test(firstName?.trim())) {
      setFirstNameError(strings.validFullNameError);
      valid = false;
    } else if (firstName.startsWith(' ')) {
      setFirstNameError(strings.fullName_error);
      valid = false;
    } else if (firstName.includes('  ')) {
      setFirstNameError(strings.nameCannotHaveMultipleSpaces);
      valid = false;
    } else if (firstName.trim().endsWith(' ')) {
      setFirstNameError(strings.nameCannotEndWithSpace);
      valid = false;
    } else {
      setFirstNameError('');
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

    if (!userName.trim()) {
      setUserNameError(strings.enter_nickName);
      valid = false;
    } else if (userName.trim().length < 3) {
      setUserNameError(strings.nickName_length);
      valid = false;
    } else if (!nickNameRegex.test(userName?.trim())) {
      setUserNameError(strings.enter_nick_name);
      valid = false;
    } else if (userName.startsWith(' ')) {
      setUserNameError(strings.lastName_cannot_start_space);
      valid = false;
    } else if (userName.includes('  ')) {
      setUserNameError(strings.nickName_multiple_space);
      valid = false;
    } else if (userName.trim().endsWith(' ')) {
      setUserNameError(strings.nickName_cannot_end_space);
      valid = false;
    } else {
      setUserNameError('');
    }

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
    if (!selectedCondition) {
      ToastManager.showError(strings.conditionsError);
      return;
    }

    const params = {
      email_address: email,
    };
    const device_token = deviceToken || '';

    const registerParams: RegisterParams = {
      first_name: firstName,
      email_address: email,
      is_social_login: false,
      password,
      device_token,
      device_type: Platform.OS,
      user_name: userName,
      last_name: lastName,
    };

    dispatch(rootLoader(true));
    const response = await registerAction(params);
    if (response.success) {
      ToastManager.showSuccess(response.message!);
      navigation.navigateToCodeVerification({
        fromPage: SCREEN_NAMES.CODE_VERIFICATION,
        registerParams,
      });
      resetSignupForm();
    } else {
      ToastManager.showError(response.message!);
    }
    dispatch(rootLoader(false));
  };

  const registerAction = async (params: { email_address: string }) => {
    let response = {
      success: false,
      message: 'Sign-up failed',
    };

    try {
      // Step 1: Check email
      const checkEmailResponse = await checkEmail(params);
      if (!checkEmailResponse.success) {
        return { success: false, message: checkEmailResponse.message };
      }

      // Step 2: Send verification email
      const sendEmailResponse = await sendVerificationEmail(params);
      if (sendEmailResponse.success) {
        response = {
          success: true,
          message: sendEmailResponse.message || 'Sign-up failed',
        };
      } else {
        response = {
          success: false,
          message: sendEmailResponse.message || 'Sign-up failed',
        };
      }
    } catch (error) {
      Logger.error('Register Error:', error);
      response = { success: false, message: 'Something went wrong' };
    }
    return response;
  };

  const resetSignupForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setConfirmPasswordSecure(true);
    setPasswordSecure(true);
    setSelectedCondition(false);
    setUserNameError('');
    setUserName('');
  };
  return (
    <ScreenContainer>
      <View style={styles.contentContainer}>
        <SpacerView height={20} />
        <MyText style={styles.welcomeText}>{strings.createAccount}</MyText>
        <SpacerView height={30} />
        <View style={styles.rawView}>
          <View style={styles.fullView}>
            <InputField
              ref={firstNameRef}
              value={firstName}
              onChangeText={setFirstName}
              placeholder={strings.firstName}
              errorMsg={firstNameError}
              maxLength={15}
              autoCapitalize="none"
              onSubmitEditing={() => lastNameRef.current?.focus()}
            />
          </View>
          <SpacerView width={10} />

          <View style={styles.fullView}>
            <InputField
              ref={lastNameRef}
              value={lastName}
              onChangeText={setLastName}
              placeholder={strings.lastName}
              errorMsg={lastNameError}
              maxLength={15}
              autoCapitalize="none"
              onSubmitEditing={() => userNameRef.current?.focus()}
            />
          </View>
        </View>
        <SpacerView height={20} />
        <InputField
          ref={userNameRef}
          value={userName}
          onChangeText={setUserName}
          placeholder={strings.userName}
          errorMsg={userNameError}
          keyboardType="default"
          autoCapitalize="none"
          maxLength={25}
          onSubmitEditing={() => emailRef.current?.focus()}
        />

        <SpacerView height={20} />
        <InputField
          ref={emailRef}
          value={email}
          onChangeText={setEmail}
          placeholder={strings.emailAddress}
          errorMsg={emailError}
          maxLength={40}
          autoCapitalize="none"
          keyboardType="email-address"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <SpacerView height={20} />
        <InputField
          ref={passwordRef}
          value={password}
          onChangeText={setPassword}
          placeholder={strings.password}
          maxLength={16}
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
        <SpacerView height={20} />
        <View style={styles.termsAndConditionMainView}>
          <TouchableOpacity
            style={styles.unSelectedView}
            onPress={() => {
              setSelectedCondition(!selectedCondition);
            }}
          >
            <Image
              source={
                selectedCondition ? selectedSquareIcon : unSelectedSquareIcon
              }
              resizeMode="contain"
              tintColor={colors.black40}
            />
          </TouchableOpacity>
          <View style={styles.termsAndConditionView}>
            <MyText style={styles.normalText}>
              {strings.iAgree}
              <MyText
                onPress={() => {
                  navigation.navigateToWebViewScreen({
                    title: strings.privacy_policy,
                    uriType: strings.privacy_policy_type,
                  });
                }}
                style={styles.linkText}
              >
                {strings.privacy_policy}
              </MyText>
              {''} {strings.and}
              <MyText
                onPress={() => {
                  navigation.navigateToWebViewScreen({
                    title: strings.terms_conditions,
                    uriType: strings.terms_and_condition_type,
                  });
                }}
                style={styles.linkText}
              >
                {strings.terms_conditions}
              </MyText>
            </MyText>
          </View>
        </View>
        <SpacerView height={35} />
        <PrimaryButton title={strings.signUpCapital} onPress={handleSignup} />
        <SpacerView height={50} />
        <MyText style={styles.alreadyAccountText}>
          {strings.alreadyHaveAccount}
          {''}
          <MyText onPress={() => navigation.goBack()} style={styles.signUpText}>
            {strings.login}
          </MyText>
        </MyText>
      </View>
    </ScreenContainer>
  );
};

export default RegisterScreen;
