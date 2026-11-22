import { Modal } from '@mui/material'
import { IoWarningOutline } from 'react-icons/io5'
import React from 'react'
import { useForm } from 'react-hook-form'

interface Props {
  isConfirmModalOpen: boolean
  setConfirmModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  ButtonText?: string
  title?: string
  onAction: (data: any) => void
  enableDelete?: boolean
  isRequired?: boolean
  actionName?: string
}

function ConfirmationAlert({
  isConfirmModalOpen,
  setConfirmModalOpen,
  ButtonText = 'Yes I am sure.',
  title = 'Are you sure you perform this action ?',
  onAction,
  actionName
}: Props) {
  const { handleSubmit } = useForm({ shouldUnregister: true })

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
        {actionName && <h1 className='font-semibold text-center mt-3'>Action : {actionName}</h1>}
        <h1 className='font-semibold text-center mt-3 whitespace-break-spaces'>{title}</h1>
        <form onSubmit={handleSubmit(onAction)}>
          <div className='flex justify-center w-full mt-5 gap-5'>
            <button className='btn-danger' type='submit'>
              {ButtonText}
            </button>
            <button className='btn-primary' type='reset' onClick={() => setConfirmModalOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default ConfirmationAlert
