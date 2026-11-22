import { Switch } from '@mui/material'
import http from 'CommonJS/http'
import AdminSetting from 'Components/AdminSetting'
import { useEffect, useState } from 'react'
import { CiSquarePlus } from 'react-icons/ci'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import ReactJsPagination from 'react-js-pagination'
import { Link } from 'react-router-dom'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo/DemoContainer'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { IoSearch } from 'react-icons/io5'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { RxCross2 } from 'react-icons/rx'
import Loading from 'Components/Loading'
import { DateFormat, Template, TemplateData } from './type'
import { toast } from 'Components/Toast/toast'
import ConfirmationAlert from 'Components/ConfirmationAlert'

export default function EmergencyBanner() {
  const [banners, setBanners] = useState<Template>()
  dayjs.extend(utc)
  dayjs.extend(timezone)
  const [searchData, setSearchData] = useState<DateFormat>({
    endDatetime: null,
    startDatetime: null
  })
  const [startDateOpen, setStartDateOpen] = useState<boolean>(false)
  const [endDateOpen, setEndDateOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [deleteBannerId, setDeleteBannerId] = useState<string>('')
  const [isConfirmAlertOpen, setConfirmAlertOpen] = useState<boolean>(false)

  interface SearchErrors {
    startDatetime?: string | undefined | null
    endDatetime?: string | undefined | null
  }
  const [searchErrors, setSearchErrors] = useState<SearchErrors>({})

  useEffect(() => {
    getTemplateData()
  }, [])

  const getTemplateData = async (pageNumber = 1, doSearch = false) => {
    await setLoading(true)
    let setParamToPath = `?page=${pageNumber}`
    if (doSearch && searchData?.endDatetime && searchData?.startDatetime) {
      if (searchData?.startDatetime > searchData?.endDatetime) {
        await setSearchData((prevData) => ({
          ...prevData,
          endDatetime: null
        }))
        return false
      }
      const start = await dayjs.utc(searchData?.startDatetime).format()
      const end = await dayjs.utc(searchData?.endDatetime).format()
      setParamToPath += `&filter[startDatetime]=${start}&filter[endDatetime]=${end}`
    }
    await http
      .fetch({ path: `banners${setParamToPath}` })
      .catch(() => {
        toast('Internal Server Error.', 'error')
        setLoading(false)
      })
      .then((response: any) => {
        setLoading(false)
        if (response && response.status === 200) {
          setBanners(response.data.banners)
        }
      })
    await setLoading(false)
  }

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>, banner: TemplateData) => {
    const isChecked = event.target.checked
    await setLoading(true)
    const newData = {
      isEnabled: isChecked
    }

    await http
      .fetch({ method: `put`, path: `/banners/${banner?.id}`, data: newData })
      .catch(() => {
        toast('internal server error', 'error')
        setLoading(false)
      })
      .then((response: any) => {
        setLoading(false)
        if (response && response.status === 200) {
          toast(response?.data?.message || 'Successfully updated data', 'success')
          getTemplateData(1, true)
        }
      })
    await setLoading(false)
  }

  const handleDeleteBanner = async () => {
    if (!deleteBannerId) {
      toast('Something went wrong please try again', 'error')
      return
    }
    await setLoading(true)
    await http
      .fetch({ method: 'delete', path: `/banners/${deleteBannerId}` })
      .catch((error) => {
        toast(error?.data?.message ?? 'Internal server error', 'error')
        setLoading(false)
        setConfirmAlertOpen(false)
        setDeleteBannerId('')
      })
      .then((response: any) => {
        setLoading(false)
        if (response && response.status === 200) {
          toast(response?.data?.message || 'Successfully deleted banner', 'success')
          getTemplateData(1, true)
          setConfirmAlertOpen(false)
          setDeleteBannerId('')
        }
      })
    await setLoading(false)
  }

  const filterBanners = () => {
    const errors: SearchErrors = { startDatetime: null, endDatetime: null }
    if (!searchData?.startDatetime) {
      errors.startDatetime = 'Start datetime is required'
    }
    if (!searchData?.endDatetime) {
      errors.endDatetime = 'End datetime is required'
    }
    setSearchErrors(errors)

    if (!errors.startDatetime && !errors.endDatetime) {
      getTemplateData(1, true)
    }
  }

  return (
    <>
      {loading && <Loading />}
      <div className='flex w-full min-h-screen md:flex-wrap md:min-h-full'>
        <AdminSetting />
        <div className='px-7 py-5 w-full lg:px-4' data-cy='emergency-banner-page'>
          <div className='flex justify-between items-center gap-3 md:flex-wrap md:pb-4'>
            <h1 className='text-3xl font-bold decoration-1'>Emergency Banner</h1>
            <Link
              to='/admin/setting/emergency-banner/add'
              className='btn-primary bg-primary hover:bg-primary/90  text-white flex gap-x-2 items-center'
              data-cy='add-emergency-banner-link'
            >
              Add Emergency Banner
              <CiSquarePlus className='w-6 h-6' />
            </Link>
          </div>
          <div className='flex items-start gap-5 md:flex-wrap'>
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateTimePicker']}>
                  <DateTimePicker
                    label='Start DateTime'
                    value={searchData?.startDatetime}
                    onChange={(newValue: any) => {
                      setSearchData((prevData) => ({
                        ...prevData,
                        startDatetime: newValue
                      }))
                      if (newValue) {
                        setSearchErrors({
                          ...searchErrors,
                          startDatetime: ''
                        })
                      }
                    }}
                    open={startDateOpen}
                    onClose={() => setStartDateOpen(false)}
                    slotProps={{
                      textField: {
                        onClick: () => setStartDateOpen(true)
                      },
                      actionBar: {
                        actions: ['today', 'clear']
                      }
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
              {searchErrors?.startDatetime && <span className='text-sm text-red-600'>{searchErrors?.startDatetime}</span>}
            </div>
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateTimePicker']}>
                  <DateTimePicker
                    label='End DateTime'
                    value={searchData?.endDatetime}
                    minDate={searchData?.startDatetime}
                    onChange={(newValue: any) => {
                      setSearchData((prevData) => ({
                        ...prevData,
                        endDatetime: newValue
                      }))
                      if (newValue) {
                        setSearchErrors({
                          ...searchErrors,
                          endDatetime: ''
                        })
                      }
                    }}
                    open={endDateOpen}
                    onClose={() => setEndDateOpen(false)}
                    slotProps={{
                      textField: {
                        onClick: () => setEndDateOpen(true)
                      },
                      actionBar: {
                        actions: ['today', 'clear']
                      }
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
              {searchErrors?.endDatetime && <span className='text-sm text-red-600'>{searchErrors?.endDatetime}</span>}
            </div>
            <button className='btn-primary px-4 py-3 mt-2 flex gap-1' onClick={filterBanners}>
              SEARCH <IoSearch className='text-2xl' />
            </button>
            <button
              className='btn-primary px-4 py-3 mt-2 flex gap-1'
              onClick={() => {
                setSearchData({
                  startDatetime: null,
                  endDatetime: null
                })
                if (!searchErrors?.startDatetime && !searchErrors?.endDatetime) {
                  getTemplateData()
                }
                setSearchErrors({})
              }}
            >
              RESET <RxCross2 className='text-2xl ' />
            </button>
          </div>

          <div className='overflow-auto'>
            <table className='w-full mt-5 lg:w-max' data-cy='emergency-banner-table'>
              <thead>
                <tr className='[&>*]:bg-primary [&>*]:text-white [&>*]:tracking-wider [&>*]:py-3 [&>*]:border-slate-500 [&>*]:text-left'>
                  <th>Id</th>
                  <th>Banner Text</th>
                  <th>Start Date Time</th>
                  <th>End Date Time</th>
                  <th>Enabled?</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {banners?.data.length === 0 || !banners ? (
                  <>
                    <tr>
                      <td colSpan={6}>No Emergency Banner Found</td>
                    </tr>
                  </>
                ) : (
                  <>
                    {banners?.data?.map((banner) => (
                      <tr key={banner.id}>
                        <td>
                          <strong>{banner?.id}</strong>
                        </td>
                        <td>{banner?.bannerText}</td>
                        <td>{banner?.startDatetime}</td>
                        <td>{banner?.endDatetime}</td>
                        <td>
                          <Switch
                            checked={banner?.isEnabled}
                            inputProps={{ 'aria-label': 'controlled' }}
                            onChange={(e) => {
                              handleChange(e, banner)
                            }}
                          />
                        </td>
                        <td>
                          <div className='flex gap-5 items-center'>
                            <Link
                              to={`/admin/setting/emergency-banner/edit/${banner?.id}`}
                              className='btn btn-primary flex items-center gap-x-3'
                              data-cy='emergency-banner-edit'
                            >
                              Edit <FaEdit />
                            </Link>
                            <button
                              className='btn btn-danger flex items-center gap-x-3'
                              onClick={() => {
                                setDeleteBannerId(banner.id)
                                setConfirmAlertOpen(true)
                              }}
                            >
                              Delete <FaTrashAlt size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
          {Boolean(banners?.data?.length ?? 0 > 0) && (
            <div className='mr-10 [&>ul]:flex [&>ul]:gap-3 [&>*_a]:py-2 [&>*_a]:px-4 [&>*_a]:lg:py-1 [&>*_a]:lg:px-3 [&>*_a]:inline-block mt-4 [&>*_a]:border [&>*_a:hover]:bg-primary [&>*_a:hover]:text-white [&>*_li.active>a]:bg-primary [&>*_li.active>a]:text-white'>
              <ReactJsPagination
                activePage={banners?.currentPage || 1}
                itemsCountPerPage={banners?.perPage}
                totalItemsCount={banners?.total || 0}
                pageRangeDisplayed={banners?.to}
                onChange={(pageNumber) => {
                  getTemplateData(pageNumber)
                }}
              />
            </div>
          )}
        </div>
      </div>

      <ConfirmationAlert
        title='Are you sure you perform this action ?'
        isConfirmModalOpen={isConfirmAlertOpen}
        setConfirmModalOpen={(val) => {
          setConfirmAlertOpen(val)
          if (!val) setDeleteBannerId('')
        }}
        ButtonText={'Yes I am sure'}
        actionName='Delete emergency banner'
        onAction={handleDeleteBanner}
      />
    </>
  )
}
