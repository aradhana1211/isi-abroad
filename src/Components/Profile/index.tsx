import { GrUpdate } from 'react-icons/gr'
import { UserContext } from 'Context/UserContext'
import { SetStateAction, useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import http from 'CommonJS/http'
import { removeBlankPairs } from 'CommonJS/common'
import { useNavigate } from 'react-router-dom'
import ImageSelector from 'Components/ImageSelector'
import Loading from 'Components/Loading'
import { AppContext } from 'Context/AppContext'
import { AppContextType } from 'Context/AppTypes'
import { LoginErrorType, PasswordInputs, ProfileInputs } from './type'
import { toast } from 'Components/Toast/toast'

export default function Profile() {
  const { data } = useContext(UserContext)
  const navigate = useNavigate()

  const [loginError, setLoginError] = useState<LoginErrorType>({})
  const [file, setFile] = useState<File>()
  const [imageSrc, setImageSrc] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const { uploadFile } = useContext(AppContext) as AppContextType

  const {
    register: registerForm1,
    handleSubmit: handleSubmitForm1,
    formState: { errors },
    setError: setErrorReg1
  } = useForm<PasswordInputs>()

  const {
    register: registerForm2,
    handleSubmit: handleSubmitForm2,
    formState: { errors: errorsForm2 },
    reset,
    setError
  } = useForm<ProfileInputs>()

  useEffect(() => {
    userData()
  }, [])

  const userData = () => {
    http
      .checkLogin()
      .then((rsp) => {
        if (rsp.status === 200 && rsp.data?.id) {
          if (data.roles.includes('advisor')) {
            reset({
              name: rsp.data.name,
              email: rsp.data.email,
              phoneNumber: rsp?.data?.advisor?.phoneNumber
            })
            setImageSrc(rsp?.data?.advisor?.photoLink)
          } else {
            reset({
              name: rsp.data.name,
              email: rsp.data.email
            })
          }
        }
      })
      .catch((error) => {
        if (error.respons && error.response.status === 401) {
          localStorage.clear()
          navigate('/login')
        }
      })
  }
  const onChangePassword = async (info: any) => {
    try {
      await setLoading(true)
      await http
        .fetch({
          path: `/user/${data.id}/changePassword`,
          method: 'put',
          data: info
        })
        .catch((err) => {
          let isOtherError = true
          if (err?.response?.data?.errors?.currentPassword && err?.response?.data?.errors?.currentPassword?.length > 0) {
            setErrorReg1('currentPassword', { message: err?.response?.data?.errors?.currentPassword[0] })
            isOtherError = false
          }
          if (err?.response?.data?.errors?.password && err?.response?.data?.errors?.password?.length > 0) {
            setErrorReg1('password', { message: err?.response?.data?.errors?.password[0] })
            isOtherError = false
          }
          if (err?.response?.data?.errors?.password_confirmation && err?.response?.data?.errors?.password_confirmation?.length > 0) {
            setErrorReg1('password_confirmation', { message: err?.response?.data?.errors?.password_confirmation[0] })
            isOtherError = false
          }
          if (isOtherError) {
            setLoginError({
              message: err?.response?.data?.message || err.message,
              ...(err?.response?.data?.errors || [])
            })
          }
          setLoading(false)
        })
        .then(async (response) => {
          if (response && response.status === 200) {
            setLoginError({ message: '' })
            toast(response?.data?.message, 'success')
          }
          setLoading(false)
        })
    } catch (error) {
      setLoading(false)
    }
  }

  const onSaveUserInfo = async (info: any) => {
    try {
      await setLoading(true)
      if (data.roles.includes('advisor')) {
        if (file) {
          const response = await uploadFile(file)
          if (response) {
            info.photoLink = await response?.document?.id
            await http
              .fetch({
                path: `/user/${data.id}`,
                method: 'put',
                data: removeBlankPairs(info)
              })
              .catch((err) => {
                if (err?.response?.data?.errors?.phoneNumber && err?.response?.data?.errors?.phoneNumber?.length > 0) {
                  setError('phoneNumber', { message: err?.response?.data?.errors?.phoneNumber[0] })
                } else if (err?.response?.data?.errors?.email && err?.response?.data?.errors?.email?.length > 0) {
                  setError('email', { message: err?.response?.data?.errors?.email[0] })
                } else if (err?.response?.data?.errors?.name && err?.response?.data?.errors?.name?.length > 0) {
                  setError('name', { message: err?.response?.data?.errors?.name[0] })
                } else {
                  setLoginError({
                    message: err?.response?.data?.message || err.message,
                    ...(err?.response?.data?.errors || [])
                  })
                }
                setLoading(false)
              })
              .then(async (response) => {
                if (response && response.status === 200) {
                  userData()
                  setLoginError({ message: '' })
                  toast(response?.data?.message, 'success')
                  setLoading(false)
                }
              })
          }
        }
      } else {
        await http
          .fetch({
            path: `/user/${data.id}`,
            method: 'put',
            data: removeBlankPairs(info)
          })
          .catch((err) => {
            if (err?.response?.data?.errors?.email && err?.response?.data?.errors?.email?.length > 0) {
              setError('email', { message: err?.response?.data?.errors?.email[0] })
            } else if (err?.response?.data?.errors?.name && err?.response?.data?.errors?.name?.length > 0) {
              setError('name', { message: err?.response?.data?.errors?.name[0] })
            } else {
              setLoginError({
                message: err?.response?.data?.message || err.message,
                ...(err?.response?.data?.errors || [])
              })
            }
          })
          .then(async (response) => {
            if (response && response.status === 200) {
              userData()
              setLoginError({ message: '' })
              toast(response?.data?.message, 'success')
            }
          })
      }
      await setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const changeFileState = (f: File) => {
    setFile(f)
  }

  const changeImageSrcState = (f: SetStateAction<null>) => {
    setImageSrc(f)
  }

  return (
    <div className='w-full' data-cy='profile-page'>
      {isLoading && <Loading />}
      <h1 className='px-7 pt-5 w-full lg:px-4 text-3xl font-bold'>Profile</h1>
      <div className='grid grid-cols-2 gap-12 w-full px-7 py-10 lg:grid-cols-1 lg:py-5 lg:px-4'>
        <div>
          <h2 className='text-xl font-bold decoration-1 mb-6'>Edit Profile</h2>
          <form
            className='w-full p-7 md:p-4 rounded-md border border-slate-200 shadow-2xl shadow-primary/20'
            onSubmit={handleSubmitForm2(onSaveUserInfo)}
          >
            <div className='w-full mb-6 md:mb-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-base font-semibold mb-2' htmlFor='grid-first-name'>
                Name
              </label>
              <input
                className='form-input'
                id='grid-first-name'
                {...registerForm2('name', {
                  required: true
                })}
                type='text'
                name='name'
                placeholder='Enter name'
                data-cy='name'
              />
              {errorsForm2?.name?.type == 'required' && (
                <p className='text-left text-red-500 text-sm' data-cy='error'>
                  Name is required
                </p>
              )}
              {errorsForm2?.name?.message && (
                <p className='text-left text-red-500 text-sm' data-cy='error'>
                  {errorsForm2?.name?.message}
                </p>
              )}
            </div>

            <div className='w-full mb-6 md:mb-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-base font-semibold mb-2' htmlFor='grid-last-name'>
                Email
              </label>
              <input
                className='form-input'
                id='grid-last-name'
                type='email'
                {...registerForm2('email', {
                  required: true
                })}
                name='email'
                placeholder='Enter email address'
                data-cy='email'
              />
              {errorsForm2?.email?.type == 'required' && (
                <p className='text-left text-red-500 text-sm' data-cy='error'>
                  Email is required
                </p>
              )}
              {errorsForm2?.email?.message && <p className='text-left text-red-500 text-sm'>{errorsForm2?.email?.message}</p>}
            </div>
            {data.roles.includes('advisor') && (
              <>
                <div className='w-full mb-6 md:mb-3'>
                  <label className='block uppercase tracking-wide text-gray-700 text-base font-semibold mb-2' htmlFor='grid-last-name'>
                    Phone Number
                  </label>
                  <input
                    className='form-input'
                    id='grid-phone-number'
                    {...registerForm2('phoneNumber')}
                    type='text'
                    name='phoneNumber'
                    placeholder='Enter phone number'
                    data-cy='phone'
                  />
                  {errorsForm2?.phoneNumber && <p className='text-left text-red-500 text-sm'>{errorsForm2?.phoneNumber?.message}</p>}
                </div>
                <div className='flex flex-wrap mb-6 md:mb-3'>
                  <label className='block uppercase tracking-wide text-gray-700 text-base font-semibold mb-2' htmlFor='file_input'>
                    Profile image
                  </label>
                  <div className='mr-3 block w-full bg-white rounded-lg text-sm focus:z-10 focus:border-primary file:border-0 file:bg-gray-100 file:me-4 file:py-3 file:px-4'>
                    <ImageSelector changeFileState={changeFileState} changeImageSrcState={changeImageSrcState} imageSrc={imageSrc} />
                  </div>
                </div>
              </>
            )}

            <div className='flex justify-center'>
              <button type='submit' className='btn-primary flex items-center gap-x-3' data-cy='save-btn'>
                Update <GrUpdate />
              </button>
            </div>
          </form>
        </div>

        <div>
          <h2 className='text-xl font-bold decoration-1 mb-6'>Change Password</h2>
          <form
            className='w-full p-7 md:p-4 rounded-md border border-slate-200 shadow-2xl shadow-primary/20'
            onSubmit={handleSubmitForm1(onChangePassword)}
          >
            <div className='w-full mb-6 md:mb-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-base font-semibold mb-2' htmlFor='grid-password'>
                Current Password
              </label>
              <input
                className='form-input pr-12 peer'
                id='grid-password'
                type='password'
                placeholder='******************'
                autoComplete='off'
                readOnly={true}
                data-cy='currentPassword'
                {...registerForm1('currentPassword', {
                  required: true
                })}
                onFocus={(e) => e.target.removeAttribute('readonly')}
              />
              {errors?.currentPassword?.type == 'required' && (
                <p className='text-left text-red-500 text-sm'>Current Password is required</p>
              )}
              {errors?.currentPassword?.message && <p className='text-left text-red-500 text-sm'>{errors?.currentPassword?.message}</p>}
            </div>

            <div className='w-full mb-6 md:mb-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-base font-semibold mb-2' htmlFor='grid-password'>
                New Password
              </label>
              <input
                className='form-input pr-12 peer'
                id='grid-new-password'
                type='password'
                placeholder='******************'
                autoComplete='off'
                readOnly={true}
                {...registerForm1('password', {
                  required: true
                })}
                data-cy='password'
                onFocus={(e) => e.target.removeAttribute('readonly')}
              />
              {errors?.password?.type == 'required' && <p className='text-left text-red-500 text-sm'>Password is required</p>}
              {errors?.password?.message && <p className='text-left text-red-500 text-sm'>{errors?.password?.message}</p>}
            </div>

            <div className='w-full mb-6 md:mb-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-base font-semibold mb-2' htmlFor='grid-password'>
                Confirm Password
              </label>
              <input
                className='form-input pr-12 peer'
                id='grid-confirm-password'
                type='password'
                placeholder='******************'
                autoComplete='off'
                {...registerForm1('password_confirmation', {
                  required: true
                })}
                readOnly={true}
                data-cy='password_confirmation'
                onFocus={(e) => e.target.removeAttribute('readonly')}
              />
              {errors?.password_confirmation?.type == 'required' && (
                <p className='text-left text-red-500 text-sm'>Confirmation password is required</p>
              )}
              {errors?.password_confirmation?.message && (
                <p className='text-left text-red-500 text-sm'>{errors?.password_confirmation?.message}</p>
              )}
            </div>
            {loginError.message && (
              <div className='text-left text-red-500 text-sm' data-cy='error'>
                <p>{loginError?.message}</p>
              </div>
            )}
            <div className='flex justify-center '>
              <button type='submit' className='btn-primary flex items-center gap-x-3' data-cy='change-save-btn'>
                Update <GrUpdate />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
