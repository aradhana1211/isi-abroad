export type ForgotInputs = {
  email: string
}

export interface LoginErrorType {
  msg?: string
  message?: string
  email?: Array<string>
  password?: Array<string>
}

export type LoginInputs = {
  email: string
  password: string
}

export type ResetInputs = {
  email: string
  password: string
  password_confirmation: string
  token: string
}
