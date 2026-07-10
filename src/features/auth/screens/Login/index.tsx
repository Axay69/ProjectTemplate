import {
  Image,
  Keyboard,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fonts, colors } from '@theme/index';
import { strings } from '@shared/constants/index';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginFormData } from '@core/validators/auth.validators';
import { ToastManager } from '@shared/utils/toast/ToastManager';
import { useDispatch } from 'react-redux';
import { useAuthNavigation } from '@app/navigation';
import { styles } from './styles';
import DeviceInfo from 'react-native-device-info';
import { AuthData } from '@features/auth/types/api';
import { appleIcon, googleIcon } from '@shared/assets/icons';
import {
  AppleAuthProvider,
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
} from '@react-native-firebase/auth';
import { getToken } from '@react-native-firebase/messaging';
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
import { getSafeAuth, getSafeMessaging } from '@core/firebase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const LoginScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useAuthNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const passwordRef = useRef<TextInput | null>(null);
  const [passwordSecure, setPasswordSecure] = React.useState(true);
  const [deviceToken, setDeviceToken] = React.useState<string | undefined>('');

  useEffect(() => {
    const fetchFCM = async () => {
      const token = await initFCM();
      setDeviceToken(token);
    };

    fetchFCM();
  }, []);

  const clickToForgotPassword = async () => {
    navigation.navigateToForgotPassword();
    reset();
    setPasswordSecure(true);
  };

  const onSubmit = async (data: LoginFormData) => {
    Keyboard.dismiss();

    const tokenForPayload: string | undefined = deviceToken
      ? deviceToken
      : (await DeviceInfo.isEmulator())
      ? 'emulator'
      : undefined;

    const params: AuthData = {
      email_address: data.email,
      password: data.password,
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
      const auth = getSafeAuth();
      if (!auth) {
        ToastManager.showError('Firebase not configured');
        return;
      }

      await GoogleSignin.hasPlayServices();

      const existingUser = await GoogleSignin.getCurrentUser();
      if (existingUser) {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }

      const googleUser = (await GoogleSignin.signIn()) as any;
      if (!googleUser.data.idToken) throw new Error('Google Sign-In failed');

      const googleCredential = GoogleAuthProvider.credential(
        googleUser.data.idToken,
      );

      try {
        await signInWithCredential(auth, googleCredential);
      } catch (firebaseError) {
        Logger.error('Firebase Auth Error:', firebaseError);
        return;
      }

      let token = deviceToken;
      if (!token) {
        const messaging = getSafeMessaging();
        if (messaging) {
          token = await getToken(messaging);
        }
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
      const authInstance = getSafeAuth();
      if (!authInstance) {
        ToastManager.showError('Firebase not configured');
        return;
      }

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
        const messaging = getSafeMessaging();
        if (messaging) {
          token = await getToken(messaging);
        }
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
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder={strings.emailAddress}
                  errorMsg={errors.email?.message}
                  textInputStyle={{ fontFamily: fonts.Regular }}
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
                />
              )}
            />
            <SpacerView height={12} />
            <MyText
              onPress={() => {
                clickToForgotPassword();
              }}
              style={styles.forgotPasswordText}
            >
              {strings.forgotPassword}
            </MyText>
            <SpacerView height={35} />
            <PrimaryButton
              title={strings.loginCapital}
              onPress={handleSubmit(onSubmit)}
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
