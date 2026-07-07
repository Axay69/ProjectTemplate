export const nameRegex = /^[a-zA-Z\s]{2,}$/;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!@$%^&*-]).{6,}$/;
export const verificationCodeRegex = /^\d{6}$/;
export const nickNameRegex = /^[a-zA-Z0-9\s]{2,}$/;
export const LIMIT = 10;
