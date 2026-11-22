import { Autocomplete, TextField } from '@mui/material'
import React, { useState, useContext } from 'react'
import { MdAdd, MdClose } from 'react-icons/md'
import { studentContext } from './context'

interface Props {
  setOPenFilter: React.Dispatch<React.SetStateAction<boolean>>
  submit: (arg: any) => void
  show?: boolean
}

function Filter({ setOPenFilter, submit, show }: Props) {
  const [ismenuExpand, setMenuExpand] = useState<number[]>([])
  const [refresh, setRefresh] = useState(true)
  const { state } = useContext(studentContext)
  const [multipleValue, setMultipleValue] = useState<Record<string, unknown>>({})

  const handleSelectChange = (value: any, itemId: string) => {
    setMultipleValue((prevState) => ({
      ...prevState,
      [itemId]: value
    }))
    if ((typeof value == 'string' || Array.isArray(value)) && value.length == 0) {
      setMultipleValue((prevState) => {
        const newState = { ...prevState }
        delete newState[itemId]
        return newState
      })
    }
  }

  async function expandMenu(index: number) {
    if (ismenuExpand?.includes(index)) {
      const temp_arr = await ismenuExpand?.filter((i) => i !== index)
      await setMenuExpand(temp_arr)
    } else {
      const temp = ismenuExpand
      temp.push(index)
      await setMenuExpand(temp)
    }
    await setRefresh(!refresh)
  }

  const handelSubmit = () => {
    submit(multipleValue)
  }

  return (
    <div
      className={`fixed px-3 py-5 border w-1/5 h-[calc(100vh-77px)] md:w-9/12 left-0 bg-white z-10 md:h-[94vh] transition-all duration-300 ease-in-out ${show ? '' : '-translate-x-full'}`}
    >
      <div className='flex justify-between items-center pb-4'>
        <h1 className='font-bold'>Filters</h1>
        <div className='flex gap-6 items-center'>
          <div
            className='font-semibold text-xs text-cyan-800 cursor-pointer'
            onClick={async () => {
              await setMultipleValue({})
              submit({})
              setOPenFilter(false)
            }}
          >
            Clear Filters
          </div>
          <MdClose
            size={'20px'}
            className='font-semibold text-xl text-cyan-800 cursor-pointer flex gap-1'
            onClick={() => {
              setOPenFilter(false)
            }}
          />
        </div>
      </div>
      {/* <div className='flex mt-3 border p-2 justify-between items-center mb-3 rounded-sm'>
        <input placeholder='Search' className='outline-none ring-0' />
        <MdSearch />
      </div> */}
      <div className='overflow-auto h-[81%]'>
        {state?.filters?.map((item, index) => {
          return (
            <div key={index} className='py-3 border-y'>
              <div className='flex justify-between items-center cursor-pointer' onClick={() => expandMenu(index)}>
                <h1 className='text-base text-gray-600'>{item?.label}</h1>
                <MdAdd color='#4b5563' size={'14px'} />
              </div>
              {ismenuExpand.includes(index) && (
                <div className='flex justify-center mt-2'>
                  {item.choices ? (
                    <>
                      <Autocomplete
                        className='w-full'
                        sx={{ m: 1, minWidth: 120 }}
                        multiple
                        size='small'
                        disabled={item.choices.length === 0}
                        options={item.choices || []}
                        onChange={(event, selectedOptions) => {
                          const selectedIds = selectedOptions.map((option) => option.id)
                          handleSelectChange(selectedIds, item.fieldName)
                        }}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => <TextField {...params} label={item.label} />}
                      />
                    </>
                  ) : (
                    <input
                      className='form-input w-70 mt-2'
                      type='text'
                      placeholder={item.label}
                      onBlur={(event) => handleSelectChange(event, item.fieldName)}
                    />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className='flex absolute bottom-0 p-3 right-0 left-0 justify-center border-t bg-white'>
        <button className='btn-secondary w-full' onClick={handelSubmit}>
          Submit
        </button>
      </div>
    </div>
  )
}

export default Filter
