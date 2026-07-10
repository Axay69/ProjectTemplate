import {
  TouchableOpacity,
  View,
  TextInput,
  Image,
  Keyboard,
  Platform,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
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
import { strings } from '@shared/constants/index';
import { colors } from '@theme/index';
import { rootLoader } from '@store';

import { selectedSquareIcon, unSelectedSquareIcon } from '@shared/assets/icons';

import { initFCM } from '@core/permissions';
import Logger from '@core/logger';
import { checkEmail, sendVerificationEmail } from '@features/auth/services';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  RegisterSchema,
  RegisterFormData,
} from '@core/validators/auth.validators';

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

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const firstNameRef = useRef<TextInput | null>(null);
  const lastNameRef = useRef<TextInput | null>(null);
  const userNameRef = useRef<TextInput | null>(null);
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  const confirmPasswordRef = useRef<TextInput | null>(null);

  const [passwordSecure, setPasswordSecure] = React.useState(true);
  const [confirmPasswordSecure, setConfirmPasswordSecure] =
    React.useState(true);
  const [selectedCondition, setSelectedCondition] = React.useState(false);
  const [deviceToken, setDeviceToken] = React.useState<string | undefined>('');

  useEffect(() => {
    const fetchFCM = async () => {
      const token = await initFCM();
      setDeviceToken(token);
    };

    fetchFCM();
  }, []);

  const handleSignup = async (data: RegisterFormData) => {
    Keyboard.dismiss();

    if (!selectedCondition) {
      ToastManager.showError(strings.conditionsError);
      return;
    }

    const params = {
      email_address: data.email,
    };
    const device_token = deviceToken || '';

    const registerParams: RegisterParams = {
      first_name: data.firstName,
      email_address: data.email,
      is_social_login: false,
      password: data.password,
      device_token,
      device_type: Platform.OS,
      user_name: data.userName,
      last_name: data.lastName,
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
    reset();
    setConfirmPasswordSecure(true);
    setPasswordSecure(true);
    setSelectedCondition(false);
  };

  const handleToggleCondition = React.useCallback(() => {
    setSelectedCondition(!selectedCondition);
  }, [selectedCondition]);

  const handlePrivacyPolicy = React.useCallback(() => {
    navigation.navigateToWebViewScreen({
      title: strings.privacy_policy,
      uriType: strings.privacy_policy_type,
    });
  }, [navigation]);

  const handleTermsCondition = React.useCallback(() => {
    navigation.navigateToWebViewScreen({
      title: strings.terms_conditions,
      uriType: strings.terms_and_condition_type,
    });
  }, [navigation]);

  const handleGoBack = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <ScreenContainer>
      <View style={styles.contentContainer}>
        <SpacerView height={20} />
        <MyText style={styles.welcomeText}>{strings.createAccount}</MyText>
        <SpacerView height={30} />
        <View style={styles.rawView}>
          <View style={styles.fullView}>
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  ref={firstNameRef}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder={strings.firstName}
                  errorMsg={errors.firstName?.message}
                  maxLength={15}
                  autoCapitalize="none"
                  onSubmitEditing={() => lastNameRef.current?.focus()}
                />
              )}
            />
          </View>
          <SpacerView width={10} />

          <View style={styles.fullView}>
            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  ref={lastNameRef}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder={strings.lastName}
                  errorMsg={errors.lastName?.message}
                  maxLength={15}
                  autoCapitalize="none"
                  onSubmitEditing={() => userNameRef.current?.focus()}
                />
              )}
            />
          </View>
        </View>
        <SpacerView height={20} />
        <Controller
          control={control}
          name="userName"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              ref={userNameRef}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={strings.userName}
              errorMsg={errors.userName?.message}
              keyboardType="default"
              autoCapitalize="none"
              maxLength={25}
              onSubmitEditing={() => emailRef.current?.focus()}
            />
          )}
        />

        <SpacerView height={20} />
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              ref={emailRef}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={strings.emailAddress}
              errorMsg={errors.email?.message}
              maxLength={40}
              autoCapitalize="none"
              keyboardType="email-address"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
          )}
        />
        <SpacerView height={20} />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              ref={passwordRef}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={strings.password}
              maxLength={16}
              secureText={passwordSecure}
              secureTextOption={true}
              setSecureText={setPasswordSecure}
              errorMsg={errors.password?.message}
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            />
          )}
        />
        <SpacerView height={20} />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              ref={confirmPasswordRef}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={strings.confirmPassword}
              maxLength={16}
              secureText={confirmPasswordSecure}
              secureTextOption={true}
              setSecureText={setConfirmPasswordSecure}
              errorMsg={errors.confirmPassword?.message}
            />
          )}
        />
        <SpacerView height={20} />
        <View style={styles.termsAndConditionMainView}>
          <TouchableOpacity
            style={styles.unSelectedView}
            onPress={handleToggleCondition}
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
              <MyText onPress={handlePrivacyPolicy} style={styles.linkText}>
                {strings.privacy_policy}
              </MyText>
              {''} {strings.and}
              <MyText onPress={handleTermsCondition} style={styles.linkText}>
                {strings.terms_conditions}
              </MyText>
            </MyText>
          </View>
        </View>
        <SpacerView height={35} />
        <PrimaryButton
          title={strings.signUpCapital}
          onPress={handleSubmit(handleSignup)}
        />
        <SpacerView height={50} />
        <MyText style={styles.alreadyAccountText}>
          {strings.alreadyHaveAccount}
          <MyText onPress={handleGoBack} style={styles.signUpText}>
            {strings.login}
          </MyText>
        </MyText>
      </View>
    </ScreenContainer>
  );
};

export default RegisterScreen;
