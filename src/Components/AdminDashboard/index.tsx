import { useContext, useEffect, useState } from 'react'
import http from 'CommonJS/http'
import './index.css'
import { ReactComponent as NewApplication } from 'assets/images/new-application.svg'
import { ReactComponent as WithdrawnApplication } from 'assets/images/withdrawn-application.svg'
import { ReactComponent as CompleteApplication } from 'assets/images/complete-application.svg'
import { ReactComponent as TotalApplication } from 'assets/images/total-application.svg'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import Loading from 'Components/Loading'
import { AppContext } from 'Context/AppContext'
import { AppContextType } from 'Context/AppTypes'
import { DataItem, IconBgMap, IconMap, valueType } from './type'
import { toast } from 'Components/Toast/toast'

export default function AdminDashboard() {
  const [data, setValue] = useState<Partial<valueType>>({
    instituteId: '',
    programId: '',
    sessionId: ''
  })

  const [loading, setLoading] = useState<boolean>(false)

  const iconBgMap: IconBgMap = {
    ai_outline_appstore_add: 'bg-primary/15',
    md_settings_applications: 'bg-blue-600/15',
    go_shield_check: 'bg-green-600/15',
    bi_money_withdraw: 'bg-red-600/15'
  }
  const iconMap: IconMap = {
    ai_outline_appstore_add: <NewApplication className='w-14' />,
    md_settings_applications: <TotalApplication className='fill-blue-600 w-14' />,
    go_shield_check: <CompleteApplication className='fill-green-600 w-14' />,
    bi_money_withdraw: <WithdrawnApplication className='fill-red-600 w-14' />
  }

  const { institutes, sessions, programs, getInstitute, getPrograms, getSession } = useContext(AppContext) as AppContextType
  const [stats, setData] = useState<any>([])

  useEffect(() => {
    const init = async () => {
      await setLoading(true)
      if (institutes?.length === 0) getInstitute()
      if (programs?.length === 0) getPrograms()
      if (sessions?.length === 0) getSession()
      await setLoading(false)
    }
    init()
  }, [])

  useEffect(() => {
    const init = async () => {
      await getDashboard()
    }
    init()
  }, [data])

  const getDashboard = () => {
    const paramsStringObject: Record<string, string> = {}
    if (data) {
      setLoading(true)
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          paramsStringObject[key] = String(value)
        }
      })
    }
    http
      .fetch({ path: 'stats', options: { params: paramsStringObject } })
      .catch(() => {
        toast('Internal server error.', 'error')
        setLoading(false)
      })
      .then((response) => {
        setLoading(false)
        if (response && response.status === 200) {
          setData(Object.values(response.data.data))
        }
      })
  }

  return (
    <div className='px-7 w-full lg:px-4 py-5 relative'>
      <h1 className='text-3xl font-bold mb-7'>Dashboard</h1>
      {loading && <Loading />}

      <div className='flex gap-4 justify-end mb-5'>
        <FormControl sx={{ m: 1, minWidth: 80 }} className='!min-w-36'>
          <InputLabel id='admin-dashboard-institute-filter-label'>Institutes</InputLabel>
          <Select
            labelId='admin-dashboard-institute-filter-label'
            id='admin-dashboard-institute-filter'
            value={data?.instituteId}
            onChange={(e) => {
              setValue((prevValue) => ({
                ...prevValue,
                instituteId: e.target.value
              }))
            }}
            autoWidth
            label='Institutes'
          >
            <MenuItem value=''> None</MenuItem>
            {institutes?.map((institute) => (
              <MenuItem key={institute.id} value={institute.id}>
                {institute.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 80 }} className='!min-w-36'>
          <InputLabel id='admin-dashboard-program-filter-label'>Programs</InputLabel>
          <Select
            labelId='admin-dashboard-program-filter-label'
            id='admin-dashboard-program-filter'
            value={data?.programId}
            onChange={(e) => {
              setValue((prevValue) => ({
                ...prevValue,
                programId: e.target.value
              }))
            }}
            autoWidth
            label='Programs'
          >
            <MenuItem value=''> None</MenuItem>
            {programs?.map((institute) => (
              <MenuItem key={institute.id} value={institute.id}>
                {institute.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 80 }} className='!min-w-36'>
          <InputLabel id='admin-dashboard-session-filter-label'>Sessions</InputLabel>
          <Select
            labelId='admin-dashboard-session-filter-label'
            id='admin-dashboard-session-filter'
            value={data?.sessionId}
            onChange={(e) => {
              setValue((prevValue) => ({
                ...prevValue,
                sessionId: e.target.value
              }))
            }}
            autoWidth
            label='Sessions'
          >
            <MenuItem value=''> None</MenuItem>
            {sessions?.map((institute) => (
              <MenuItem key={institute.id} value={institute.id}>
                {institute.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className='grid grid-cols-4 lg:grid-cols-2 md:grid-cols-1 gap-7'>
        {stats.length === 0 && (
          <>
            {[...Array(4)].map((item, index: number) => (
              <div key={index}>
                <div className='profile_card animate-pulse text-center'>
                  <div className='icon h-11 w-11 bg-primary/15'></div>
                  <div className='number h-9 w-14 rounded-sm bg-primary/15 mx-auto'></div>
                  <h3 className='title rounded-sm h-8 w-80 bg-primary/15 mx-auto'></h3>
                </div>
              </div>
            ))}
          </>
        )}

        {stats?.map((item: DataItem, index: number) => (
          <div key={index} className='profile_card text-center'>
            <div className={`icon ${iconBgMap[item.icon]}`}>{iconMap[item?.icon]}</div>
            <div className='number'>{item.total}</div>
            <h3 className='title'>{item.name}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}
