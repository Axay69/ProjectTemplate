import {
  Keyboard,
  TextInput,
  View,
  AppState,
  AppStateStatus,
} from 'react-native';
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
import { SCREEN_NAMES, useAuthNavigation } from '@app/navigation';
import { leftBackIcon } from '@shared/assets/icons';
import { strings, verificationCodeRegex } from '@shared/constants/index';
import { useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { ToastManager } from '@shared/utils/toast/ToastManager';
import Logger from '@core/logger';
import {
  forgotPassword,
  registerUser,
  sendVerificationEmail,
  verifyEmail,
  verifyOtp,
} from '@features/auth/services';
import { RegisterParams } from '../Register';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '@app/navigation/types';
import { rootLoader } from '@store';

export type CodeVerificationRouteProp = RouteProp<
  AuthStackParamList,
  'CodeVerificationScreen'
>;

const CodeVerificationScreen = () => {
  const dispatch = useDispatch();
  const navigation = useAuthNavigation();
  const route = useRoute<CodeVerificationRouteProp>();
  const { fromPage, registerParams, email } = route.params || {};

  const codeVerificationRef = useRef<TextInput | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationCodeError, setVerificationCodeError] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [counter, setCounter] = useState(59);
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const backgroundTime = useRef<number | null>(null);

  useEffect(() => {
    if (!verificationCode.trim()) {
      setVerificationCodeError('');
    } else if (verificationCode.length !== 6) {
      setVerificationCodeError(strings.verificationCodeLengthError);
    } else {
      setVerificationCodeError('');
    }
  }, [verificationCode]);

  useEffect(() => {
    let interval: number | null = null;

    const startTimer = () => {
      if (counter > 0) {
        interval = setInterval(() => {
          setCounter(prev => {
            if (prev <= 1) {
              clearInterval(interval!);
              setIsDisabled(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setIsDisabled(false);
      }
    };

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (backgroundTime.current) {
          const timeElapsed = Math.floor(
            (Date.now() - backgroundTime.current) / 1000,
          );
          setCounter(prev => {
            const newCounter = prev - timeElapsed;
            if (newCounter <= 0) {
              setIsDisabled(false);
              return 0;
            }
            return newCounter;
          });
          backgroundTime.current = null;
          startTimer();
        }
      } else if (nextAppState.match(/inactive|background/)) {
        if (interval) {
          clearInterval(interval);
        }
        backgroundTime.current = Date.now();
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    startTimer();

    return () => {
      if (interval) clearInterval(interval);
      subscription.remove();
    };
  }, [counter]);

  const handleSendAgain = async () => {
    if (isDisabled) return;

    const params = {
      email_address: (email || registerParams?.email_address)!,
    };

    dispatch(rootLoader(true));

    let response;

    if (fromPage === SCREEN_NAMES.CODE_VERIFICATION) {
      response = await sendVerificationEmail(params);
    } else {
      response = await forgotPassword(params);
    }

    if (response.success) {
      setVerificationCode('');
      ToastManager.showSuccess(response.message!);
      setCounter(59);
      setIsDisabled(true);
    } else {
      ToastManager.showError(response.message!);
    }
    dispatch(rootLoader(false));
  };

  const handleCodeVerification = async () => {
    let valid = true;
    Keyboard.dismiss();
    if (!verificationCode.trim()) {
      setVerificationCodeError(strings.verificationCodeError);
      valid = false;
    } else if (verificationCode.length !== 6) {
      setVerificationCodeError(strings.verificationCodeLengthError);
      valid = false;
    } else if (!verificationCodeRegex.test(verificationCode)) {
      setVerificationCodeError(strings.verificationCodeInvalid);
      valid = false;
    } else {
      setVerificationCodeError('');
    }

    if (!valid) return;
    if (fromPage === SCREEN_NAMES.CODE_VERIFICATION) {
      const params = {
        email_address: registerParams?.email_address || '',
        otp: Number(verificationCode),
      };

      const response = await verifyEmailAction(
        params,
        registerParams as RegisterParams,
      );
      if (response.success) {
        ToastManager.showSuccess(response.message!);
      } else {
        ToastManager.showError(response.message!);
      }
    } else {
      const params = {
        email_address: email || '',
        otp: Number(verificationCode),
      };
      dispatch(rootLoader(true));
      const response = await verifyOtp(params);
      if (response.success) {
        ToastManager.showSuccess(response.message!);
        navigation.navigateToResetPassword({ email: email || '' });
      } else {
        ToastManager.showError(response.message!);
      }
      dispatch(rootLoader(false));
    }
  };

  interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
  }

  const verifyEmailAction = async (
    params: { email_address: string; otp: number },
    registerData: RegisterParams,
  ): Promise<ApiResponse> => {
    try {
      dispatch(rootLoader(true));

      const verifyEmailResponse = await verifyEmail(params);
      if (!verifyEmailResponse?.success) {
        return {
          success: false,
          message: verifyEmailResponse?.message || 'Email verification failed',
        };
      }

      const registerResponse = await dispatch(
        registerUser(registerData) as any,
      );

      if (registerResponse?.success) {
        return {
          success: true,
          message: registerResponse?.message || 'Registration successful',
          data: registerResponse?.data,
        };
      }

      return {
        success: false,
        message: registerResponse?.message || 'Registration failed',
      };
    } catch (error) {
      Logger.error('verifyEmailAction Error:', error);
      return {
        success: false,
        message: 'Something went wrong. Please try again.',
      };
    } finally {
      dispatch(rootLoader(false));
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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
        <MyText style={styles.codeVerificationText}>
          {fromPage === SCREEN_NAMES.CODE_VERIFICATION
            ? strings.verifyEmail
            : strings.codeVerification}
        </MyText>
        <SpacerView height={5} />
        <MyText style={styles.codeVerificationDesc}>
          {strings.codeVerificationDesc}
        </MyText>
        <SpacerView height={25} />
        <InputField
          ref={codeVerificationRef}
          value={verificationCode}
          onChangeText={setVerificationCode}
          placeholder={strings.verificationCodePlaceholder}
          errorMsg={verificationCodeError}
          maxLength={6}
          keyboardType="number-pad"
        />
      </View>
      <View style={styles.bottomView}>
        <PrimaryButton
          title={strings.verify}
          onPress={handleCodeVerification}
        />
        <SpacerView height={20} />
        <View style={styles.didNotReceiveContainer}>
          <MyText style={styles.notReceiveCode}>
            {strings.didNotReceiveCode}{' '}
            <MyText
              onPress={isDisabled ? undefined : handleSendAgain}
              style={styles.sendAgain}
            >
              {isDisabled ? formatTime(counter) : strings.sendAgain}
            </MyText>
          </MyText>
        </View>
      </View>
    </ScreenContainer>
  );
};

export default CodeVerificationScreen;
