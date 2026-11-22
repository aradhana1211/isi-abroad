import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import loginImg from 'assets/images/log-in.svg'
import http from 'CommonJS/http'
import { useForm } from 'react-hook-form'
import Logo from 'assets/images/ISILOGOPNG.png'
import { LoginErrorType, ResetInputs } from './type'
import { toast } from 'Components/Toast/toast'

export default function ResetPassword() {
  const [loading, setLoading] = useState<boolean>(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<ResetInputs>()

  const [loginError, setLoginError] = useState<LoginErrorType>({})

  useEffect(() => {
    const emailParam = searchParams.get('email')
    const decodedEmail = emailParam ? decodeURIComponent(emailParam) : ''

    const data = {
      email: decodedEmail,
      token: searchParams.get('token')
    }
    http
      .fetch({
        path: '/auth/verify-token',
        method: 'post',
        data: data
      })
      .catch((err) => {
        if (err?.response?.data?.errors?.email && err?.response?.data?.errors?.email.length > 0) {
          toast(err?.response?.data?.errors.email[0], 'error')
        }
        if (err?.response?.data?.errors?.token && err?.response?.data?.errors?.token.length > 0) {
          toast(err?.response?.data?.errors.token[0], 'error')
        }
        setTimeout(() => {
          navigate('/forgot-password')
        }, 2000)
      })
      .then(async (response) => {
        if (response && response.status === 200) {
          if (response.data.success == true) {
            toast(response?.data?.message, 'success')
          } else {
            navigate('/forgot-password')
            toast(response?.data?.message, 'error')
          }
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const onResetPassword = async (data: any) => {
    setLoading(true)
    await http
      .fetch({
        path: '/auth/reset-password',
        method: 'post',
        data: data
      })
      .catch((err) => {
        setLoginError({
          password: err?.response?.data?.message || err.message,
          ...(err?.response?.data?.message || [])
        })
      })
      .then(async (response) => {
        if (response && response.status === 200) {
          setLoginError({ msg: '' })
          toast(response?.data?.status, 'success')
          navigate('/login')
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
          <img className='w-1/2 mx-auto' src={loginImg} alt='' />
        </div>
        <div className='w-1/3 p-4 px-12 flex text-center items-center justify-center lg:w-full md:px-4'>
          <div className='w-full'>
            <div className='mb-4'>
              <img className='w-1/3 md:w-1/2 mx-auto' src={Logo} alt='' />
            </div>
            <h1 className='text-3xl font-bold text-primary mb-7 text-center'>Reset your password</h1>
            <form onSubmit={handleSubmit(onResetPassword)}>
              <div className='mb-3'>
                <label htmlFor='loginEmail' className='form-label'>
                  Email Address
                </label>
                <input
                  type='email'
                  readOnly={true}
                  className='form-input'
                  defaultValue={searchParams.get('email') || ''}
                  {...register('email')}
                  data-cy='email'
                />
                <input
                  type='hidden'
                  className='form-input'
                  {...register('token')}
                  defaultValue={searchParams.get('token') || ''}
                  data-cy='token'
                />
              </div>
              <div className='mb-3'>
                <label htmlFor='password' className='form-label'>
                  Password
                </label>
                <input
                  type='password'
                  className='form-input'
                  data-cy='password'
                  {...register('password', {
                    required: true
                  })}
                />
                {errors?.password?.type == 'required' && <p className='text-left text-red-500 text-sm'>password is required</p>}
                {errors?.email?.type == 'required' && <p className='text-left text-red-500 text-sm'>email is required</p>}
              </div>
              <div className='mb-3'>
                <label htmlFor='password_confirmation' className='form-label'>
                  Confirm Password
                </label>
                <input
                  type='password'
                  className='form-input'
                  data-cy='password_confirmation'
                  {...register('password_confirmation', {
                    required: true,
                    validate: (val: string) => {
                      if (watch('password') != val) {
                        return 'Your passwords do no match'
                      }
                    }
                  })}
                />
                {errors?.password_confirmation?.type == 'required' && (
                  <p className='text-left text-red-500 text-sm'>confirm password is required</p>
                )}
                <p className='text-left text-red-500 text-sm'>{errors.password_confirmation && errors.password_confirmation.message}</p>
              </div>
              {errors?.token?.type == 'required' && <p className='text-left text-red-500 text-sm'>token is not found</p>}
              {loginError.password && (
                <div className='text-left text-red-500 text-sm' data-cy='error'>
                  <p>{loginError?.password}</p>
                </div>
              )}
              <button
                className={`btn-primary w-full flex gap-x-6 items-center justify-center mt-6 
                  ${loading ? 'opacity-50 hover:cursor-not-allowed' : 'hover:cursor-pointer'}`}
                type='submit'
                data-cy='submit'
                disabled={loading}
              >
                Reset Password
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
