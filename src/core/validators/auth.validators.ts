import { z } from 'zod';
import { strings } from '@shared/constants/index';
import {
  emailRegex,
  nameRegex,
  nickNameRegex,
  passwordRegex,
} from '@shared/constants/index';

export const REGEX = {
  EMAIL: emailRegex,
  NAME: nameRegex,
  NICKNAME: nickNameRegex,
  PASSWORD: passwordRegex,
};

// Helper for validating no leading spaces, no double spaces, no trailing spaces
const noInvalidSpaces = (
  messageLeading: string,
  messageDouble: string,
  messageTrailing: string,
) =>
  z
    .string()
    .refine(val => !val.startsWith(' '), messageLeading)
    .refine(val => !val.includes('  '), messageDouble)
    .refine(val => !val.trimEnd().endsWith(' '), messageTrailing);

export const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, strings.pleaseEnterEmail)
    .regex(REGEX.EMAIL, strings.pleaseEnterValidEmail)
    .refine(email => !/[A-Z]/.test(email), strings.emailLowercaseOnly),
  password: z
    .string()
    .min(1, strings.pleaseEnterPassword)
    .min(6, strings.confirmPasswordMinLength)
    .regex(REGEX.PASSWORD, strings.changePasswordText)
    .refine(
      password => !/\s/.test(password),
      strings.passwordCannotContainSpaces,
    ),
});

export const RegisterSchema = LoginSchema.extend({
  firstName: z
    .string()
    .trim()
    .min(1, strings.pleaseEnterFullName)
    .min(3, strings.minLengthErrFullNameError)
    .regex(REGEX.NAME, strings.validFullNameError)
    .pipe(
      noInvalidSpaces(
        strings.fullName_error,
        strings.nameCannotHaveMultipleSpaces,
        strings.nameCannotEndWithSpace,
      ),
    ),
  lastName: z
    .string()
    .trim()
    .min(1, strings.pleaseEnterLastName)
    .min(3, strings.minLengthErrLastNameError)
    .regex(REGEX.NAME, strings.validLastNameError)
    .pipe(
      noInvalidSpaces(
        strings.lastName_error,
        strings.lastNameCannotHaveMultipleSpaces,
        strings.lastNameCannotEndWithSpace,
      ),
    ),
  userName: z
    .string()
    .trim()
    .min(1, strings.enter_nickName)
    .min(3, strings.nickName_length)
    .regex(REGEX.NICKNAME, strings.enter_nick_name)
    .refine(val => !val.startsWith(' '), strings.lastName_cannot_start_space)
    .refine(val => !val.includes('  '), strings.nickName_multiple_space)
    .refine(
      val => !val.trimEnd().endsWith(' '),
      strings.nickName_cannot_end_space,
    ),
  confirmPassword: z
    .string()
    .min(1, strings.enterConfirmPassword)
    .min(6, strings.confirmPasswordMinLength)
    .regex(REGEX.PASSWORD, strings.changeConfirmPasswordText)
    .refine(
      confirmPassword => !/\s/.test(confirmPassword),
      strings.confirmPasswordCannotContainSpaces,
    ),
}).refine(data => data.password === data.confirmPassword, {
  message: strings.passwordsDoNotMatch,
  path: ['confirmPassword'],
});

export const EditProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, strings.pleaseEnterFullName)
    .min(3, strings.minLengthErrFullNameError)
    .regex(REGEX.NAME, strings.validFullNameError)
    .pipe(
      noInvalidSpaces(
        strings.fullName_error,
        strings.nameCannotHaveMultipleSpaces,
        strings.nameCannotEndWithSpace,
      ),
    ),
  lastName: z
    .string()
    .trim()
    .min(1, strings.pleaseEnterLastName)
    .min(3, strings.minLengthErrLastNameError)
    .regex(REGEX.NAME, strings.validLastNameError)
    .pipe(
      noInvalidSpaces(
        strings.lastName_error,
        strings.lastNameCannotHaveMultipleSpaces,
        strings.lastNameCannotEndWithSpace,
      ),
    ),
  userName: z
    .string()
    .trim()
    .min(1, strings.enter_nickName)
    .min(3, strings.nickName_length)
    .regex(REGEX.NICKNAME, strings.enter_nick_name)
    .refine(val => !val.startsWith(' '), strings.lastName_cannot_start_space)
    .refine(val => !val.includes('  '), strings.nickName_multiple_space)
    .refine(
      val => !val.trimEnd().endsWith(' '),
      strings.nickName_cannot_end_space,
    ),
  email: z
    .string()
    .trim()
    .min(1, strings.pleaseEnterEmail)
    .regex(REGEX.EMAIL, strings.pleaseEnterValidEmail)
    .refine(email => !/[A-Z]/.test(email), strings.emailLowercaseOnly),
});

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, strings.pleaseEnterEmail)
    .regex(REGEX.EMAIL, strings.pleaseEnterValidEmail),
});

export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;
export type EditProfileFormData = z.infer<typeof EditProfileSchema>;
export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;
