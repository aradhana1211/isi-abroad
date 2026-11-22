import { Modal } from '@mui/material'
import TextField from '@mui/material/TextField'
import { Controller, useForm } from 'react-hook-form'
import { IoWarningOutline } from 'react-icons/io5'
import Autocomplete from '@mui/material/Autocomplete'
import React, { useState } from 'react'
interface Props {
  isConfirmModalOpen: boolean
  setConfirmModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  deleteButtonText?: string
  advisors?: any
  title: string
  onAction: (data: any) => void
  enableDelete?: boolean
  isRequired?: boolean
}
function ConfirmationModal({
  isConfirmModalOpen,
  setConfirmModalOpen,
  deleteButtonText = 'Delete',
  advisors = [],
  title,
  onAction,
  enableDelete = true,
  isRequired = false
}: Props) {
  const { handleSubmit, control, setValue } = useForm({ shouldUnregister: true })

  const advisorOptions = advisors.map((item: any) => ({
    label: `${item.name}`,
    value: item.user.id
  })) as { label: string; value: any }[]

  const [inputValue, setInputValue] = useState('')

  return (
    <Modal
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      open={isConfirmModalOpen}
      onClose={() => setConfirmModalOpen(false)}
    >
      <div className='bg-white p-5 rounded w-1/4 relative'>
        <div className='flex justify-center w-full items-center'>
          <div className='flex justify-center items-center bg-red-400/35 w-11 h-11 rounded-full'>
            <IoWarningOutline className=' text-red-700' size={25} />
          </div>
        </div>
        <h1 className='font-semibold text-center mt-3'>{title}</h1>
        <form onSubmit={handleSubmit(onAction)}>
          {advisors && advisors?.length > 0 && (
            <div className='flex justify-center w-full mt-3'>
              <Controller
                name='advisor_assign'
                control={control}
                defaultValue={''}
                rules={{ required: { value: isRequired, message: 'This field is required.' } }}
                render={({ field: { ref }, fieldState: { error } }) => {
                  return (
                    <div className='w-3/4'>
                      <Autocomplete
                        ref={ref}
                        inputValue={inputValue}
                        onChange={(event, newValue) => {
                          setValue('advisor_assign', newValue ? newValue.value : '')
                        }}
                        onInputChange={(event, newInputValue) => {
                          if (newInputValue != 'undefined') {
                            setInputValue(newInputValue)
                          }
                        }}
                        options={advisorOptions}
                        getOptionLabel={(option) => option?.label}
                        renderInput={(params) => <TextField {...params} label='Select Advisor' />}
                      />
                      {error && <p className='text-left text-red-500 text-sm'>{error?.message}</p>}
                    </div>
                  )
                }}
              />
            </div>
          )}

          <div className='flex justify-center w-full mt-5 gap-5'>
            {enableDelete && (
              <button className='btn-danger' type='submit'>
                {deleteButtonText}
              </button>
            )}
            <button className='btn-primary' type='reset' onClick={() => setConfirmModalOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default ConfirmationModal
