import http from 'CommonJS/http'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash, FaSave } from 'react-icons/fa'
import { SetStateAction, useContext, useEffect, useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { removeBlankPairs } from 'CommonJS/common'
import noImagePlaceholder from '../../assets/images/no-image-placeholder.png'
import { useForm } from 'react-hook-form'
import ImageSelector from 'Components/ImageSelector'
import Loading from 'Components/Loading'
import { AppContext } from 'Context/AppContext'
import { AppContextType } from 'Context/AppTypes'
import { AdvisorInputs } from './type'
import { toast } from 'Components/Toast/toast'

export default function AdvisorAddEdit() {
  const [showPassword, setShowPassword] = useState(false)
  interface Errors {
    name?: string[]
    email?: string[]
    phoneNumber?: string[]
    password?: string[]
    message?: string
  }
  const [error, setError] = useState<Errors>({})
  // const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const pathname = location.pathname
  const hasView = pathname.includes('view')
  const userId = searchParams.get('userId')
  const { uploadFile } = useContext(AppContext) as AppContextType

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue
  } = useForm<AdvisorInputs>()

  const [file, setFile] = useState<File>()
  const [imageSrc, setImageSrc] = useState(null)

  useEffect(() => {
    if (userId !== undefined && userId !== null) {
      getAdvisorData()
    } else {
      reset({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        photoId: ''
      })
    }
  }, [userId])

  const getAdvisorData = async () => {
    setLoading(true)
    await http
      .fetch({ path: `advisors/${userId}` })
      .catch(() => {
        toast('Internal Server Error.', 'error')
      })
      .then((response: any) => {
        setLoading(false)
        if (response && response.status === 200) {
          reset({
            name: response?.data?.advisor?.name,
            email: response?.data?.advisor?.user.email,
            phoneNumber: response?.data?.advisor?.phoneNumber,
            password: '',
            photoId: response?.data?.advisor?.photoLink
          })
          setImageSrc(response?.data?.advisor?.photoLink)
        }
      })
  }

  const handleSave = async (info: any) => {
    const newData = info

    const path = userId ? `/advisors/${userId}` : '/advisors'
    const method = userId ? `put` : `post`
    await setLoading(true)

    if (file) {
      const fileRes = await uploadFile(file)
      if (fileRes) {
        setValue('photoId', fileRes?.document?.id)
        newData.photoLink = fileRes?.document?.id
        toast(fileRes?.message, 'success')
        await http
          .fetch({ method: method, path: path, data: removeBlankPairs(newData) })
          .then((response: any) => {
            if (response && response.status === 200) {
              navigate('/admin/advisors')
              toast(response?.data?.message || 'Successfully added data', 'success')
            }
          })
          .catch((error) => {
            setError(error.response.data.errors)
          })
      }
      await setLoading(false)
    } else {
      await http
        .fetch({ method: method, path: path, data: removeBlankPairs(newData) })
        .catch((error) => {
          setError(error.response.data.errors)
          setLoading(false)
        })
        .then((response: any) => {
          if (response && response.status === 200) {
            navigate('/admin/advisors')
            toast(response?.data?.message || 'Successfully added data', 'success')
          }
          setLoading(false)
        })
    }
    setLoading(false)
  }

  const changeFileState = (f: SetStateAction<File | undefined>) => {
    setFile(f)
  }

  const changeImageSrcState = (f: SetStateAction<null>) => {
    setImageSrc(f)
  }

  return (
    <div className='m-10 px-4 mx-auto lg:w-full' data-cy='advisor-add-edit-page'>
      {loading && <Loading />}
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold' data-cy='title'>
          {hasView ? 'View Advisor' : 'Add Advisor'}{' '}
        </h1>
        <Link to='/admin/advisors'>
          <button className='btn-primary flex items-center gap-x-2' data-cy='go-back'>
            <IoIosArrowBack />
            Back
          </button>
        </Link>
      </div>
      <form
        className='w-full p-7 md:p-4 rounded-md border border-slate-200 shadow-2xl shadow-primary/20 mt-10'
        onSubmit={handleSubmit(handleSave)}
      >
        <div className='flex flex-wrap mb-6 md:mb-3'>
          <div className='w-full mb-6 md:mb-3'>
            <label className='block uppercase tracking-wide text-gray-700 text-base font-semibold mb-2' htmlFor='grid-first-name'>
              Name
            </label>
            <input
              className='form-input'
              id='grid-first-name'
              {...register('name', {
                required: true
              })}
              type='text'
              name='name'
              placeholder='Enter name'
              disabled={hasView}
              data-cy='name'
            />
            {errors?.name?.type == 'required' && (
              <p className='text-left text-red-500 text-sm' data-cy='error'>
                Name is required
              </p>
            )}
            {error.name && (
              <p className='text-red-500 text-xs italic' data-cy='error'>
                {error.name[0]}
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
              disabled={hasView}
              {...register('email', {
                required: true
              })}
              placeholder='Enter email address'
              data-cy='email'
            />
            {errors?.email?.type == 'required' && (
              <p className='text-left text-red-500 text-sm' data-cy='error'>
                Email is required
              </p>
            )}
            {error.email && (
              <p className='text-red-500 text-xs italic' data-cy='error'>
                {error.email[0]}
              </p>
            )}
          </div>
          <div className='w-full'>
            <label className='block uppercase tracking-wide text-gray-700 text-base font-semibold mb-2' htmlFor='grid-last-name'>
              Phone Number
            </label>
            <input
              className='form-input'
              id='grid-phone-number'
              type='text'
              disabled={hasView}
              {...register('phoneNumber', {
                required: true
              })}
              placeholder='Enter phone number'
              data-cy='phone-number'
              onChange={(e) => {
                const isValid = /^\(?([2-9][0-8][0-9])\)?([2-9][0-9]{2})([0-9]{4})$/.test(e.target.value)
                setError({
                  ...error,
                  phoneNumber: isValid ? undefined : ['Invalid phone number format']
                })
              }}
            />
            {errors?.phoneNumber?.type == 'required' && (
              <p className='text-left text-red-500 text-sm' data-cy='error'>
                Phone number is required
              </p>
            )}
            {error.phoneNumber && (
              <p className='text-red-500 text-xs italic' data-cy='error'>
                {error.phoneNumber[0]}
              </p>
            )}
          </div>
        </div>
        {!hasView ? (
          <>
            <div className='flex flex-wrap mb-6'>
              <div className='w-full'>
                <label className='block uppercase tracking-wide text-gray-700 text-base font-semibold mb-2' htmlFor='grid-password'>
                  Password
                </label>
                <div className='relative'>
                  <input
                    className='form-input pr-12 peer'
                    id='grid-password'
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: userId ? false : true
                    })}
                    name='password'
                    placeholder='******************'
                    autoComplete='off'
                    readOnly={true}
                    data-cy='password'
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                  />
                  <div
                    className='absolute top-0 right-0 bottom-0 border-l bg-white border border-gray-300 px-4 cursor-pointer rounded-r-md z-20 flex items-center [&_svg]:text-xl peer-focus:border-primary peer-focus:!border-l-gray-300'
                    data-cy='toggle-password'
                    onClick={() => {
                      setShowPassword(!showPassword)
                    }}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </div>
                </div>
                {errors?.password?.type == 'required' && (
                  <p className='text-left text-red-500 text-sm' data-cy='error'>
                    Password is required
                  </p>
                )}
                {error.password && (
                  <p className='text-red-500 text-xs italic' data-cy='error'>
                    {error.password[0]}
                  </p>
                )}
              </div>
            </div>
            <div className='block'>
              <label className='block mb-2 text-sm font-medium text-gray-900' htmlFor='file_input'>
                Upload file
              </label>
              <ImageSelector size='110px' changeFileState={changeFileState} changeImageSrcState={changeImageSrcState} imageSrc={imageSrc} />
            </div>
            {error.message && (
              <div className='text-left text-red-500 text-sm' data-cy='error'>
                <p>{error?.message}</p>
              </div>
            )}
            <div className='flex justify-center'>
              <button type='submit' className='btn-primary flex items-center gap-x-3' data-cy='save-btn'>
                Save <FaSave />
              </button>
            </div>
          </>
        ) : (
          <>
            {getValues('photoId') && (
              <div className='flex flex-col mb-6'>
                <label className='block uppercase tracking-wide text-gray-700 text-base font-semibold mb-2' htmlFor='grid-first-name'>
                  Image
                </label>
                <ImageSelector size='110px' isViewOnly={true} imageSrc={getValues('photoId') ?? noImagePlaceholder} />
              </div>
            )}
          </>
        )}
      </form>
    </div>
  )
}
