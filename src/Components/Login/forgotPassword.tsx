/* eslint-disable no-useless-escape */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import loginImg from 'assets/images/log-in.svg'
import http from 'CommonJS/http'
import { useForm } from 'react-hook-form'
import Logo from 'assets/images/ISILOGOPNG.png'
import { ForgotInputs, LoginErrorType } from './type'
import { toast } from 'Components/Toast/toast'

export default function ForgotPassword() {
  const [loading, setLoading] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotInputs>()

  const [loginError, setLoginError] = useState<LoginErrorType>({})

  const onForgotPassword = async (data: ForgotInputs) => {
    setLoading(true)
    await http
      .fetch({
        path: '/auth/forgot-password',
        method: 'post',
        data: data
      })
      .catch((err) => {
        setLoginError({
          message: err?.response?.data?.message || err.message,
          ...(err?.response?.data?.errors || [])
        })
      })
      .then(async (response) => {
        if (response && response.status === 200) {
          setLoginError({ message: '' })
          toast(response?.data?.message, 'success')
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <section className='w-full' data-cy='login-page'>
      <div className='flex h-screen'>
        <div className='bg-primary flex items-center justify-center w-2/3 lg:hidden'>
          <img className='w-1/2' src={loginImg} alt='' />
        </div>
        <div className='w-1/3 py-4 px-12 flex text-center items-center justify-center lg:w-full md:px-4'>
          <div className=''>
            <div className='mb-4'>
              <img className='w-1/3 md:w-1/2 mx-auto' src={Logo} alt='' />
            </div>
            <h1 className='text-3xl font-bold text-primary mb-3 text-center'>Forgot your password?</h1>
            <p className='mb-14 text-center mx-9 md:mb-5 md:mx-0'>
              Please enter the email address associated with your account and We will email you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit(onForgotPassword)}>
              <div className='mb-3'>
                <label htmlFor='loginEmail' className='form-label'>
                  Email Address
                </label>
                <input
                  type='name'
                  {...register('email', {
                    required: true,
                    pattern:
                      /^(([^<>()[\].,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
                  })}
                  className='form-input'
                  data-cy='email'
                />
                {errors?.email?.type == 'pattern' && <p className='text-left text-red-500 text-sm'>Invalid email</p>}
                {errors?.email?.type == 'required' && <p className='text-left text-red-500 text-sm'>email is required</p>}
                {loginError?.email && loginError?.email[0] !== loginError?.message && (
                  <div className='text-left text-red-500 text-sm' data-cy='error'>
                    <p>{loginError?.email}</p>
                  </div>
                )}
              </div>

              {loginError.message && (
                <div className='text-left text-red-500 text-sm' data-cy='error'>
                  <p>{loginError?.message}</p>
                </div>
              )}
              <button
                className={`btn-primary w-full flex gap-x-6 items-center justify-center mt-6 
                  ${loading ? 'opacity-50 hover:cursor-not-allowed' : 'hover:cursor-pointer'}`}
                type='submit'
                data-cy='submit'
                disabled={loading}
              >
                Forgot Password
                <div className={`spinner ${loading ? '' : 'hidden'}`}></div>
              </button>
              <Link to='/login' className='btn-primary bg-primary text-white w-full block mt-6' data-cy='to-login'>
                Back to Login
              </Link>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
