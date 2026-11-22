/* eslint-disable no-useless-escape */
import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import loginImg from 'assets/images/log-in.svg'
import Logo from 'assets/images/ISILOGOPNG.png'
import http from 'CommonJS/http'
import { setToken } from 'CommonJS/common'
import { AuthContext } from '../../Context/AuthContext'
import { UserContext } from '../../Context/UserContext'
import { useForm } from 'react-hook-form'
import { LoginErrorType, LoginInputs } from './type'

export default function Login() {
  const { setAuthenticated } = useContext(AuthContext)
  const { dispatch } = useContext(UserContext)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginInputs>()

  const navigate = useNavigate()

  const [loginError, setLoginError] = useState<LoginErrorType>({})
  const [disabled, setDisabled] = useState<boolean>(false)

  const onSaveChanges = async (data: LoginInputs) => {
    await http
      .login(data)
      .catch((err) => {
        setLoginError({
          message: err?.response?.data?.message || err.message,
          ...(err?.response?.data?.errors || [])
        })

        if (err?.response?.data?.disabledLogin) {
          setDisabled(true)
        }
      })
      .then(async (response) => {
        if (response && response.status === 200 && response.data?.token) {
          await setAuthenticated(true)
          await dispatch({
            type: 'ADD',
            payload: response.data.user
          })
          await localStorage.setItem('user', JSON.stringify(response.data.user))
          await setToken(response.data.token)
          await navigate(
            response.data.user.roles.includes('superadmin') || response.data.user.roles.includes('advisor') ? '/dashboard' : '/'
          )
        }
      })
  }

  const wordpressUrl = process.env.REACT_APP_WORDPRESS_URL ?? ''

  return (
    <section className='w-full' data-cy='login-page'>
      <div className='flex h-screen'>
        <div className='bg-primary flex items-center justify-center w-2/3 lg:hidden'>
          <img className='w-1/2' src={loginImg} alt='' />
        </div>

        <div className='w-1/3 p-4 flex text-center items-center justify-center lg:w-full'>
          <div className='w-10/12'>
            <div className='text-center mb-4'>
              <img className='w-1/2 mx-auto' src={Logo} alt='' />
            </div>
            <h1 className='text-3xl font-bold text-primary mb-3'>Welcome to ISI Abroad</h1>
            <p className='mb-8'> </p>
            <hr />
            <div className='-mt-4 mb-8'>
              <span className='bg-white px-2 text-2xl'>or sign in with</span>
            </div>

            <form onSubmit={handleSubmit(onSaveChanges)}>
              <div className='mb-3'>
                <label htmlFor='loginEmail' className='form-label'>
                  Email
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
                {errors?.email?.type == 'pattern' && (
                  <p className='text-left text-red-500 text-sm' data-cy='error'>
                    Invalid email
                  </p>
                )}
                {errors?.email?.type == 'required' && (
                  <p className='text-left text-red-500 text-sm' data-cy='error'>
                    Email is required
                  </p>
                )}
                {loginError?.email && loginError?.email[0] !== loginError?.message && (
                  <div className='text-left text-red-500 text-sm' data-cy='error'>
                    <p>{loginError?.email}</p>
                  </div>
                )}
              </div>

              <div className='mb-4'>
                <label htmlFor='loginPass' className='form-label'>
                  Password
                </label>
                <input
                  type='password'
                  {...register('password', {
                    required: true
                  })}
                  className='form-input'
                  data-cy='password'
                />
                {errors?.password?.type == 'required' && (
                  <p className='text-left text-red-500 text-sm' data-cy='error'>
                    Password is required
                  </p>
                )}
                {loginError?.password && loginError?.password[0] !== loginError?.message && (
                  <div className='text-left text-red-500 text-sm' data-cy='error'>
                    <p>{loginError?.password}</p>
                  </div>
                )}
              </div>

              <div className='flex items-center justify-between mb-1 gap-2 md:gap-4 flex-wrap'>
                <div className='flex items-center gap-2'>
                  <input className='border border-gray-300 accent-primary w-4 h-4 rounded-2xl' type='checkbox' id='CheckChecked' />
                  <label htmlFor='CheckChecked'>Remember this Device</label>
                </div>
                <Link to='/forgot-password' className='underline font-medium'>
                  Forgot Password ?
                </Link>
              </div>

              {loginError.message && (
                <div className='text-left text-red-500 text-sm' data-cy='error'>
                  <p>{loginError?.message}</p>
                </div>
              )}
              <button
                className={`btn-primary w-full block mt-6 ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                disabled={disabled}
                type='submit'
                data-cy='submit'
              >
                Sign In
              </button>
              {wordpressUrl ? (
                <div className='flex gap-3 items-center justify-center mt-7'>
                  <p className='font-medium text-2xl'>New to ISI Abroad?</p>
                  <Link to={wordpressUrl} target='_blank'>
                    Create an account
                  </Link>
                </div>
              ) : (
                ''
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
