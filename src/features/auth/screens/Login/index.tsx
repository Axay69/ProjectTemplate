import {
  Image,
  Keyboard,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fonts, colors } from '@theme/index';
import { strings, emailRegex, passwordRegex } from '@shared/constants/index';
import { ToastManager } from '@shared/utils/toast/ToastManager';
import { useDispatch } from 'react-redux';
import { useAuthNavigation } from '@app/navigation';
import { styles } from './styles';
import DeviceInfo from 'react-native-device-info';
import { AuthData } from '@features/auth/types/api';
import { appleIcon, googleIcon } from '@shared/assets/icons';
import {
  AppleAuthProvider,
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
} from '@react-native-firebase/auth';
import {
  GoogleSignin,
  SignInSuccessResponse,
} from '@react-native-google-signin/google-signin';
import { getMessaging, getToken } from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';
import Logger from '@core/logger';
import appleAuth from '@invertase/react-native-apple-authentication';
import { initFCM } from '@core/permissions';
import { rootLoader } from '@store';
import {
  InputField,
  MyText,
  PrimaryButton,
  ScreenContainer,
  Spacer as SpacerView,
} from '@shared/components';
import { loginUser } from '@features/auth/services';
import { AppDispatch } from '@store';

const LoginScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useAuthNavigation();

  const emailRef = useRef<TextInput | null>(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const passwordRef = useRef<TextInput | null>(null);
  const [password, setPassword] = useState('');
  const [passwordSecure, setPasswordSecure] = useState(true);
  const [passwordError, setPasswordError] = useState('');
  const [deviceToken, setDeviceToken] = useState<string | null>('');

  useEffect(() => {
    const fetchFCM = async () => {
      const token = await initFCM();
      setDeviceToken(token);
    };

    fetchFCM();
  }, []);

  useEffect(() => {
    if (!email.trim()) setEmailError('');
    else if (!emailRegex.test(email))
      setEmailError(strings.pleaseEnterValidEmail);
    else if (/[A-Z]/.test(email)) setEmailError(strings.emailLowercaseOnly);
    else setEmailError('');
  }, [email]);

  const clickToForgotPassword = async () => {
    navigation.navigateToForgotPassword();
    setEmail('');
    setPassword('');
    setPasswordSecure(true);
    setEmailError('');
    setPasswordError('');
  };

  const handleUserLogin = async () => {
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

    if (!valid) return;
    const tokenForPayload: string | undefined = deviceToken
      ? deviceToken
      : (await DeviceInfo.isEmulator())
      ? 'emulator'
      : undefined;

    const params: AuthData = {
      email_address: email,
      password,
      is_social_login: false,
      device_token: tokenForPayload,
      device_type: Platform.OS,
    };

    return performLogin(params);
  };

  const performLogin = async (loginParams: AuthData) => {
    dispatch(rootLoader(true));

    const response = await dispatch(loginUser(loginParams));

    if (response.success) {
      ToastManager.showSuccess(response.message!);
    } else {
      ToastManager.showError(response.message!);
    }
    dispatch(rootLoader(false));
  };

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      const existingUser = await GoogleSignin.getCurrentUser();
      if (existingUser) {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }

      const googleUser = (await GoogleSignin.signIn()) as SignInSuccessResponse;
      if (!googleUser.data.idToken) throw new Error('Google Sign-In failed');

      const googleCredential = GoogleAuthProvider.credential(
        googleUser.data.idToken,
      );

      try {
        const auth = getAuth();
        await signInWithCredential(auth, googleCredential);
      } catch (firebaseError) {
        Logger.error('Firebase Auth Error:', firebaseError);
        return;
      }

      let token = deviceToken;
      if (!token) {
        const messaging = getMessaging(getApp());
        token = await getToken(messaging);
      }

      const googleLoginParams = {
        email_address: googleUser.data.user.email,
        first_name: googleUser.data.user.givenName?.toLowerCase() || '',
        last_name: googleUser.data.user.familyName?.toLowerCase() || '',
        is_social_login: true,
        social_id: googleUser.data.user.id,
        social_platform: 'google',
        device_token: token,
        device_type: Platform.OS,
      };
      return performLogin(googleLoginParams);
    } catch (error) {
      Logger.log('Google Sign-In Error:', error);
      ToastManager.showError('Google Sign-In failed');
    }
  };

  const handleAppleLogin = async () => {
    try {
      const authInstance = getAuth();

      if (authInstance.currentUser) {
        await signOut(authInstance);
      }

      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identity token returned');
      }

      const { identityToken, nonce } = appleAuthRequestResponse;

      const appleCredential = AppleAuthProvider.credential(
        identityToken,
        nonce,
      );

      const data = await signInWithCredential(authInstance, appleCredential);
      console.log('datadata', JSON.stringify(data));

      const userEmail =
        data.user?.email ||
        (data.additionalUserInfo?.profile?.email as string) ||
        '';

      const nameParts: string[] | undefined = data.user.displayName?.split(' ');
      const firstNameFromDisplay = nameParts?.[0]?.trim();
      const firstName = (
        firstNameFromDisplay || getNameFromEmail(userEmail)
      ).toLowerCase();

      const lastName =
        nameParts && nameParts.length > 1
          ? nameParts
              .slice(1)
              .map(part => part.trim())
              .join(' ')
          : '';

      let token = deviceToken;
      if (!token) {
        const messaging = getMessaging(getApp());
        token = await getToken(messaging);
      }

      const appleLoginParams = {
        email_address: userEmail,
        first_name: firstName.toLowerCase(),
        last_name: lastName.toLowerCase(),
        is_social_login: true,
        social_id: data.user?.uid,
        social_platform: 'apple',
        device_token: token,
        device_type: Platform.OS,
      };
      return performLogin(appleLoginParams);
    } catch (error) {
      Logger.error('Apple Sign-In Error:', error);
      ToastManager.showError('Apple Sign-In failed');
    }
  };
  const getNameFromEmail = (
    emailAddress: string | null | undefined,
  ): string => {
    if (!emailAddress) return '';

    const nameFromEmail = emailAddress.split('@')[0];
    const lettersOnly = nameFromEmail.replace(/[^a-zA-Z]/g, '');

    if (!lettersOnly) return '';

    return lettersOnly.charAt(0).toUpperCase() + lettersOnly.slice(1);
  };

  return (
    <>
      <ScreenContainer>
        <View style={styles.contentContainer}>
          <SpacerView height={20} />
          <View
            style={{
              justifyContent: 'center',
              marginTop: 30,
            }}
          >
            <MyText style={styles.welcomeText}>{strings.welcome}</MyText>
            <SpacerView height={5} />
            <MyText style={styles.descriptionText}>
              {strings.loginDescription}
            </MyText>
          </View>
          <View style={styles.inputContainer}>
            <InputField
              ref={emailRef}
              value={email}
              onChangeText={setEmail}
              placeholder={strings.emailAddress}
              errorMsg={emailError}
              textInputStyle={{ fontFamily: fonts.Regular }}
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
            />
            <SpacerView height={12} />
            <MyText
              onPress={() => {
                clickToForgotPassword();
                navigation.navigateToForgotPassword();
              }}
              style={styles.forgotPasswordText}
            >
              {strings.forgotPassword}
            </MyText>
            <SpacerView height={35} />
            <PrimaryButton
              title={strings.loginCapital}
              onPress={handleUserLogin}
            />
          </View>

          <SpacerView height={35} />
          <View style={styles.continueWithContainer}>
            <View style={styles.separatorLine} />
            <MyText style={styles.continueWithText}>
              {strings.orContinueWith}
            </MyText>
            <View style={styles.separatorLine} />
          </View>
          <SpacerView height={25} />
          <View style={styles.socialContainer}>
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleAppleLogin}
              >
                <Image
                  source={appleIcon}
                  style={styles.socialIcon}
                  tintColor={colors.BLACK}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleGoogleLogin}
            >
              <Image source={googleIcon} style={styles.socialIcon} />
            </TouchableOpacity>
          </View>
          <SpacerView height={25} />
          <MyText style={styles.noAccountText}>
            {strings.noAccount}
            {''}
            <MyText
              onPress={() => {
                navigation.navigateToRegister();
              }}
              style={styles.signUpText}
            >
              {strings.signUp}
            </MyText>
          </MyText>
        </View>
        <SafeAreaView edges={['bottom']} />
      </ScreenContainer>
    </>
  );
};

export default LoginScreen;
