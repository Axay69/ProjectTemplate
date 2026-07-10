import { Keyboard, Text, TextInput, View } from 'react-native';
import React, { useRef } from 'react';
import { styles } from './styles';
import { useAuthNavigation } from '@app/navigation';
import { strings } from '@shared/constants/index';
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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ForgotPasswordSchema,
  ForgotPasswordFormData,
} from '@core/validators/auth.validators';

const ForgotPasswordScreen = () => {
  const dispatch = useDispatch();
  const navigation = useAuthNavigation();
  const emailRef = useRef<TextInput | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    Keyboard.dismiss();
    const params = {
      email_address: data.email,
    };
    await requestForgotPassword(params, data.email);
  };

  const requestForgotPassword = async (
    params: { email_address: string },
    email: string,
  ) => {
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
              maxLength={50}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          )}
        />
      </View>
      <View style={styles.bottomView}>
        <PrimaryButton
          title={strings.submit}
          onPress={handleSubmit(handleForgotPassword)}
        />
      </View>
    </ScreenContainer>
  );
};

export default ForgotPasswordScreen;
