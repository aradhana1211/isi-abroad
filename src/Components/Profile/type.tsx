export type ProfileInputs = {
  name: string
  email: string
  phoneNumber: string
  photoLink: string
}

export type PasswordInputs = {
  currentPassword: string
  password: string
  password_confirmation: string
}

export interface LoginErrorType {
  message?: string
  email?: Array<string>
}
