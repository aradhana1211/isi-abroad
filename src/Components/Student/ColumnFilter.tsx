import Checkbox from '@mui/material/Checkbox'
import React, { useContext, useEffect, useState } from 'react'
import { MdClose } from 'react-icons/md'
import { studentContext } from './context'
import { ActionType, Fields } from './types'
import http from 'CommonJS/http'
import { toast } from 'Components/Toast/toast'
import Loading from 'Components/Loading'

interface Props {
  setOpenColumnFilter: React.Dispatch<React.SetStateAction<boolean>>
  isToggleFilter?: boolean
  show?: boolean
}

function ColumnFilter({ setOpenColumnFilter, isToggleFilter, show }: Props) {
  const { state, dispatch } = useContext(studentContext)
  const { fields, column, filters } = state
  const [checkedIds, setCheckedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const handleCheckboxChange = (id: string) => {
    if (checkedIds.includes(id)) {
      setCheckedIds(checkedIds.filter((checkedId) => checkedId !== id))
    } else {
      setCheckedIds([...checkedIds, id])
    }
  }

  const saveChange = async () => {
    setLoading(true)
    return http
      .fetch({ method: 'post', path: '/setting/fields', data: { fields: checkedIds } })
      .catch((error: any) => {
        toast(error.response?.data?.message || 'Internal server error', 'error')
        setLoading(false)
      })
      .then((response: any) => {
        setLoading(false)
        if (response && response.status === 200) {
          toast(response?.data?.message || 'Successfully updated data', 'success')
        }
      })
  }

  const filterColumn = async () => {
    if (isToggleFilter) {
      // make api call to save user settings
      await saveChange()

      // update Show Filters menu on the left side of the page
      const filters = fields.filter((n) => checkedIds.includes(n.id))
      dispatch({ type: ActionType.SET_FILTERS, payload: filters })

      // close popup
      setOpenColumnFilter(false)

      return
    }
    await dispatch({ type: ActionType.SET_COLUMN, payload: checkedIds })
    await setOpenColumnFilter(false)
  }

  const selectDeselect = (action: boolean) => {
    const idsToCheck = action
      ? isToggleFilter
        ? fields.filter((n) => !n.isDisabled).map((item) => item.id)
        : fields.map((item) => item.id)
      : isToggleFilter
        ? []
        : fields.filter((n) => n.isDisabled).map((item: Fields) => item.id)

    setCheckedIds(idsToCheck)
  }

  useEffect(() => {
    if (isToggleFilter) {
      setCheckedIds(filters.map((filter) => filter.fieldName))
    } else {
      setCheckedIds(column)
    }
  }, [column])

  return (
    <>
      {loading && <Loading />}

      <div
        className={`fixed right-0 bg-white p-3 rounded-sm w-1/5 h-[calc(100vh-77px)] top-20 shadow-lg md:w-9/12 z-50 transition-all duration-300 ease-in-out ${show ? '' : 'translate-x-full'}`}
      >
        <div className='flex flex-col mb-3 border-b gap-1'>
          <div className='flex justify-between items-center overflow-auto'>
            <h1 className='font-semibold'>{isToggleFilter ? 'Toggle Filter Columns' : 'Show/Hide Columns'}</h1>
            <MdClose size={'20px'} className=' cursor-pointer' onClick={() => setOpenColumnFilter(false)} />
          </div>
          <div key={`id_all`} className='flex gap-2 items-center pb-2'>
            <label
              className='text-secondary cursor-pointer hover:underline underline-offset-2'
              onClick={() => {
                selectDeselect(true)
              }}
            >
              Select All
            </label>
            <span className='text-secondary'>{'/'}</span>
            <label
              className='text-secondary cursor-pointer hover:underline underline-offset-2'
              onClick={() => {
                selectDeselect(false)
              }}
            >
              Deselect All
            </label>
          </div>
        </div>
        <div className='overflow-auto h-[calc(100%-130px)]'>
          {fields
            ?.sort(function (a, b) {
              return a.filterColumnOrder - b.filterColumnOrder
            })
            .map((item, index) => {
              return (
                <div key={index} className='flex pb-3 gap-2 items-center'>
                  <Checkbox
                    id={`id_${item.id}`}
                    checked={checkedIds.includes(item.id)}
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }}
                    onChange={() => handleCheckboxChange(item.id)}
                    disabled={item.isDisabled}
                  />
                  <label htmlFor={`id_${item.id}`}>{item.label}</label>
                </div>
              )
            })}
        </div>
        <div className='flex absolute bottom-0 p-3 right-0 left-0 justify-center border-t bg-white'>
          <button className='bg-white btn-secondary w-[-webkit-fill-available]' onClick={filterColumn}>
            Submit
          </button>
        </div>
      </div>
    </>
  )
}

export default ColumnFilter
