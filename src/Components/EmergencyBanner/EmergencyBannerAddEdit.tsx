import http from 'CommonJS/http'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { FaSave } from 'react-icons/fa'
import { useContext, useEffect, useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { removeBlankPairs } from 'CommonJS/common'
import AdminSetting from 'Components/AdminSetting'
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import Select from '@mui/material/Select'
import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem } from '@mui/material'
import OutlinedInput from '@mui/material/OutlinedInput'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { useForm } from 'react-hook-form'
import Loading from 'Components/Loading'
import { AppContext } from 'Context/AppContext'
import { AppContextType } from 'Context/AppTypes'
import { DataItem, FormDataFields, LoginErrorType } from './type'
import { toast } from 'Components/Toast/toast'

export default function EmergencyBannerAddEdit() {
  dayjs.extend(utc)
  dayjs.extend(timezone)
  const [error, setError] = useState<LoginErrorType>({})

  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname
  const hasView = pathname.includes('view')
  const { id } = useParams()
  const [startDateOpen, setStartDateOpen] = useState<boolean>(false)
  const [endDateOpen, setEndDateOpen] = useState<boolean>(false)

  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  }

  const [data, setData] = useState<Partial<DataItem>>()

  const defaultValues: FormDataFields = {
    endDatetime: null,
    startDatetime: null,
    bannerText: '',
    instituteIds: [],
    sessionIds: [],
    programIds: [],
    studentIds: []
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
    setValue
  } = useForm<FormDataFields>({ defaultValues })

  const [selected_institute, setSelectedInstitute] = useState<number[]>([])
  const [selected_session, setSelectedSession] = useState<number[]>([])
  const [selected_program, setSelectedProgram] = useState<number[]>([])
  const [selected_student, setSelectedStudent] = useState<number[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const { institutes, programs, sessions, getInstitute, getPrograms, getSession } = useContext(AppContext) as AppContextType

  useEffect(() => {
    if (id) getIndividualBanner()
    if (institutes?.length === 0) getInstitute()
    if (programs?.length === 0) getPrograms()
    if (sessions?.length === 0) getSession()
  }, [])

  const getIndividualBanner = async () => {
    setLoading(true)
    await http
      .fetch({ path: `banners/${id}` })
      .catch(() => {
        toast('Internal Server Error.', 'error')
      })
      .then((response: any) => {
        setLoading(false)
        if (response && response.status === 200) {
          reset({
            bannerText: response?.data?.banner?.bannerText,
            startDatetime: dayjs.utc(response?.data?.banner?.startDatetime).local(),
            endDatetime: dayjs.utc(response?.data?.banner?.endDatetime).local(),
            instituteIds: response?.data?.banner?.instituteIds,
            sessionIds: response?.data?.banner?.sessionIds,
            programIds: response?.data?.banner?.programIds,
            studentIds: response?.data?.banner?.studentIds
          })
          setSelectedInstitute(response?.data?.banner?.instituteIds)
          setSelectedSession(response?.data?.banner?.sessionIds)
          setSelectedProgram(response?.data?.banner?.programIds)
          setSelectedStudent(response?.data?.banner?.studentIds)
        }
      })
  }

  const getStudent = async () => {
    await setLoading(true)
    const searchData = {
      institute_ids: getValues('instituteIds').filter((value) => value !== 0),
      session_ids: getValues('sessionIds').filter((value) => value !== 0),
      program_ids: getValues('programIds').filter((value) => value !== 0)
    }

    await http
      .fetch({ method: `post`, path: 'setting/students', data: searchData })
      .catch(() => {
        toast('Internal server error.', 'error')
        setLoading(false)
      })
      .then((response) => {
        setLoading(false)
        if (response && response.status === 200) {
          setData((prevData) => ({
            ...prevData,
            students: response.data.students
          }))
        }
      })
    await setLoading(false)
  }

  useEffect(() => {
    if (getValues('instituteIds').length > 0 || getValues('sessionIds').length > 0 || getValues('programIds').length > 0) {
      getStudent()
    }
  }, [getValues('instituteIds'), getValues('sessionIds'), getValues('programIds')])

  const handleSave = async (info: FormDataFields) => {
    await setLoading(true)
    const newData = {
      banner_text: info?.bannerText,
      start_datetime: dayjs.utc(info?.startDatetime),
      end_datetime: dayjs.utc(info?.endDatetime),
      institute_ids: info?.instituteIds,
      session_ids: info?.sessionIds,
      program_ids: info?.programIds,
      student_ids: info?.studentIds
    }
    const method = id ? 'put' : 'post'
    const path = id ? `/banners/${id}` : `/banners`
    await http
      .fetch({ method: method, path: path, data: removeBlankPairs(newData) })
      .catch((error) => {
        setError({
          message: error?.response?.data?.message || error.message,
          ...(error?.response?.data?.errors || [])
        })
        setLoading(false)
      })
      .then((response: any) => {
        setLoading(false)
        if (response && response.status === 200) {
          navigate('/admin/setting/emergency-banner')
          toast(response?.data?.message || 'Successfully added data', 'success')
        }
      })
    await setLoading(false)
  }

  return (
    <div className='flex w-full min-h-screen md:flex-wrap md:min-h-full'>
      {loading && <Loading />}
      <AdminSetting />
      <div className='m-10 px-4 w-full md:m-2' data-cy='emergency-banner-add-edit-page'>
        <div className='flex justify-between items-center'>
          <h1 className='text-3xl font-bold' data-cy='title'>
            Emergency Banner
          </h1>
          <Link to='/admin/setting/emergency-banner'>
            <button className='btn-primary flex items-center gap-x-2' data-cy='go-back'>
              <IoIosArrowBack />
              Back
            </button>
          </Link>
        </div>
        <form
          className='p-7 md:p-4 rounded-md border border-slate-200 shadow-2xl shadow-primary/20	 mt-10'
          onSubmit={handleSubmit(handleSave)}
        >
          <div className='mb-6 md:mb-0'>
            <div className='mb-6 md:mb-0'>
              <label className='block uppercase tracking-wide text-gray-700 text-base font-semibold mb-2' htmlFor='grid-first-name'>
                Title
              </label>
              <input
                className='form-input'
                type='text'
                {...register('bannerText', {
                  required: true
                })}
                name='bannerText'
                data-cy='title'
                placeholder='Enter Banner Text'
              />
              {errors?.bannerText?.type == 'required' && (
                <p className='text-left text-red-500 text-sm' data-cy='error'>
                  Banner text is required
                </p>
              )}
            </div>
            <div className='mb-6 md:mb-0' data-cy='start-date'>
              <label className='block uppercase tracking-wide text-gray-700 text-base font-semibold mb-2' htmlFor='grid-first-name'>
                Start Date
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DesktopDateTimePicker']}>
                  <DesktopDateTimePicker
                    label='Start DateTime'
                    value={getValues('startDatetime')}
                    {...register('startDatetime', {
                      required: true
                    })}
                    onChange={(newvalue: any) => {
                      setValue('startDatetime', newvalue)
                    }}
                    open={startDateOpen}
                    onClose={() => setStartDateOpen(false)}
                    slotProps={{
                      textField: {
                        onClick: () => setStartDateOpen(true)
                      }
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
              {errors?.startDatetime?.type == 'required' && (
                <p className='text-left text-red-500 text-sm' data-cy='error'>
                  Start date and time is required
                </p>
              )}
            </div>
            <div className='mb-6 md:mb-0' data-cy='end-date'>
              <label className='block uppercase tracking-wide text-gray-700 text-base font-semibold mb-2' htmlFor='grid-first-name'>
                End Date
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DesktopDateTimePicker']}>
                  <DesktopDateTimePicker
                    label='End DateTime'
                    value={getValues('endDatetime')}
                    minDate={getValues('startDatetime')}
                    {...register('endDatetime', {
                      required: true
                    })}
                    onChange={(newvalue) => {
                      setValue('endDatetime', newvalue)
                    }}
                    open={endDateOpen}
                    onClose={() => setEndDateOpen(false)}
                    slotProps={{
                      textField: {
                        onClick: () => setEndDateOpen(true)
                      }
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
              {errors?.endDatetime?.type == 'required' && (
                <p className='text-left text-red-500 text-sm' data-cy='error'>
                  End date and time is required
                </p>
              )}
            </div>
            <div className='flex gap-3 w-full md:flex-wrap'>
              <FormControl sx={{ m: 1 }}>
                <InputLabel id='emergency-banner-institutes-label'>Institutes</InputLabel>
                <Select
                  className='min-w-40'
                  data-cy='institute'
                  labelId='emergency-banner-institutes-label'
                  id='emergency-banner-institutes'
                  multiple
                  value={getValues('instituteIds')}
                  {...register('instituteIds')}
                  onChange={(event) => {
                    const { value } = event.target
                    setValue('instituteIds', value?.length > 0 ? value.toString().split(',').map(Number) : [])
                    setSelectedInstitute(value?.length > 0 ? value.toString().split(',').map(Number) : [])
                  }}
                  input={<OutlinedInput label='Institutes' />}
                  renderValue={(selected) => {
                    const selectedNames = institutes
                      ?.filter((institute) => selected.includes(institute.id))
                      .map((institute) => institute.name)
                    return selectedNames ? selectedNames.join(', ') : ''
                  }}
                  MenuProps={MenuProps}
                >
                  {institutes?.map((institute) => {
                    return (
                      <MenuItem key={institute?.id} value={institute?.id}>
                        <Checkbox
                          checked={getValues('instituteIds')?.indexOf(institute?.id) > -1 && selected_institute.includes(institute?.id)}
                        />
                        <ListItemText primary={institute?.name + institute?.id} />
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
              <FormControl sx={{ m: 1 }}>
                <div className='mb-6 md:mb-0'>
                  <InputLabel id='emergency-banner-sessions-label'>Sessions</InputLabel>
                  <Select
                    className='min-w-40'
                    data-cy='sessions'
                    labelId='emergency-banner-sessions-label'
                    id='emergency-banner-sessions'
                    multiple
                    value={getValues('sessionIds')}
                    {...register('sessionIds')}
                    onChange={(event) => {
                      const { value } = event.target
                      setValue('sessionIds', value?.length > 0 ? value.toString().split(',').map(Number) : [])
                      setSelectedSession(value?.length > 0 ? value.toString().split(',').map(Number) : [])
                    }}
                    input={<OutlinedInput label='Sessions' />}
                    renderValue={(selected) => {
                      const selectedNames = sessions?.filter((session) => selected.includes(session.id)).map((session) => session.name)
                      return selectedNames ? selectedNames.join(', ') : ''
                    }}
                    MenuProps={MenuProps}
                  >
                    {sessions?.map((indvidualsession) => (
                      <MenuItem key={indvidualsession?.id} value={indvidualsession?.id}>
                        <Checkbox
                          checked={
                            getValues('sessionIds').indexOf(indvidualsession?.id) > -1 && selected_session.includes(indvidualsession?.id)
                          }
                        />
                        <ListItemText primary={indvidualsession?.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </FormControl>
              <FormControl sx={{ m: 1 }}>
                <InputLabel id='emergency-banner-programs-label'>Programs</InputLabel>
                <Select
                  labelId='emergency-banner-programs-label'
                  id='emergency-banner-programs'
                  data-cy='programs'
                  className='min-w-40'
                  multiple
                  value={getValues('programIds')}
                  {...register('programIds')}
                  onChange={(event) => {
                    const { value } = event.target
                    setValue('programIds', value?.length > 0 ? value.toString().split(',').map(Number) : [])
                    setSelectedProgram(value?.length > 0 ? value.toString().split(',').map(Number) : [])
                  }}
                  input={<OutlinedInput label='Programs' />}
                  renderValue={(selected) => {
                    const selectedNames = programs?.filter((program) => selected.includes(program.id)).map((program) => program.name)
                    return selectedNames ? selectedNames.join(', ') : ''
                  }}
                  placeholder='Select Session'
                  MenuProps={MenuProps}
                >
                  {programs?.map((program) => (
                    <MenuItem key={program?.id} value={program?.id}>
                      <Checkbox checked={getValues('programIds').indexOf(program?.id) > -1 && selected_program.includes(program?.id)} />
                      <ListItemText primary={program?.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ m: 1 }}>
                <InputLabel id='emergency-banner-students-label'>Students</InputLabel>
                <Select
                  labelId='emergency-banner-students-label'
                  id='emergency-banner-students'
                  className='min-w-40'
                  data-cy='students'
                  multiple
                  value={getValues('studentIds')}
                  onChange={(event) => {
                    const { value } = event.target
                    setValue('studentIds', value?.length > 0 ? value.toString().split(',').map(Number) : [])
                    setSelectedStudent(value?.length > 0 ? value.toString().split(',').map(Number) : [])
                  }}
                  input={<OutlinedInput label='Students' />}
                  renderValue={(selected) => {
                    const selectedNames = data?.students
                      ?.filter((student) => selected.includes(student.id))
                      .map((student) => student.firstName + student.lastName)
                    return selectedNames ? selectedNames.join(', ') : ''
                  }}
                  MenuProps={MenuProps}
                >
                  {data?.students &&
                    data?.students.map((studentrender) => (
                      <MenuItem key={studentrender?.id} value={studentrender?.id}>
                        <Checkbox
                          checked={getValues('studentIds').indexOf(studentrender?.id) > -1 && selected_student.includes(studentrender?.id)}
                        />
                        <ListItemText primary={(studentrender?.firstName ?? studentrender?.id) + ' ' + (studentrender.lastName ?? '')} />
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
          </div>
          {error.message && (
            <div className='text-left text-red-500 text-sm' data-cy='error'>
              <p>{error?.message}</p>
            </div>
          )}
          {!hasView && (
            <div className='flex justify-center mt-4'>
              <button type='submit' className='btn-primary flex items-center gap-x-3' data-cy='save-btn'>
                Save <FaSave />
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
