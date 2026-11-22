import React, { useState } from 'react'
import { MdClose } from 'react-icons/md'
import { FormStep } from './type'
import TinyEditor from 'Components/TinyEditor'
import http from 'CommonJS/http'
import { Link } from 'react-router-dom'
import { FaEye, FaPaperPlane } from 'react-icons/fa'
import { IoIosArrowBack } from 'react-icons/io'
import { toast } from 'Components/Toast/toast'

type AdditionalInfo = {
  savedLetterLink?: string
}
interface Props {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  formSubStep: FormStep | null
  isView: boolean
  type: string
  label: string
  initialValue: string
  callSave: (value: any, settingType: any) => Promise<string | null>
  additionalInfo?: AdditionalInfo
  sendLetter?: (type: string) => Promise<any>
}

function Step({ setOpenModal, formSubStep, isView, type, label, initialValue, callSave, additionalInfo, sendLetter }: Props) {
  const [loading, setLoading] = useState(false)
  const [viewLetterLink, setViewLetterLink] = useState(additionalInfo?.savedLetterLink)
  const [viewLetter, setViewLetter] = useState(viewLetterLink && isView ? true : false)

  const handleSaveStepData = async (value: string, settingType: string) => {
    const payload = {
      [settingType]: value
    }
    if (settingType == 'visaLetter' || settingType == 'acceptanceLetter') {
      if (loading) return
      setLoading(true)
      const newUrl = await callSave(value, settingType)
      if (newUrl) {
        setLoading(false)
        setViewLetterLink(newUrl)
        setViewLetter(true)
      }
    } else {
      http
        .fetch({ method: 'put', path: `setting/formStep/${formSubStep?.id}`, data: payload })
        .catch((error) => {
          toast(error?.response?.data?.message, 'error')
        })
        .then((response) => {
          if (response && response.status === 200) {
            toast(response?.data?.message, 'success')
            setOpenModal(false)
            callSave(value, settingType)
          }
        })
    }
  }

  const handleSendLetter = () => {
    if (typeof sendLetter === 'function') {
      sendLetter(type)
    }
  }

  const SendLetterLink = () => {
    return (
      <Link
        to={'#'}
        className={`btn btn-secondary flex justify-between items-center text-nowrap gap-3 mr-4 ${!viewLetterLink ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={`${!viewLetterLink ? 'No letter generated.' : ''}`}
        onClick={handleSendLetter}
      >
        Send <FaPaperPlane />
      </Link>
    )
  }

  return (
    <div
      className={`h-full w-auto fixed justify-center  items-center bg-black/50  inset-x-0 inset-y-0 border z-[190] p-10 model-open ${loading ? '[&_.tiny-save-btn]:opacity-50 [&_.tiny-save-btn]:cursor-progress' : ''}`}
    >
      <div className='bg-white w-10/12 rounded-md p-5 mx-auto h-[85%] overflow-hidden absolute top-1/2 left-1/2 -translate-y-2/4 -translate-x-2/4'>
        <div className='flex justify-between'>
          <h3 className='text-xl mb-4'>{label}</h3>
          <MdClose className='cursor-pointer size-7 ' onClick={() => setOpenModal(false)} />
        </div>
        {viewLetterLink && viewLetter ? (
          <>
            {!isView && (
              <div className='flex justify-end'>
                <div className='flex gap-3'>
                  <SendLetterLink />
                  <button
                    className='btn-primary flex justify-between items-center gap-x-2 ml-auto mr-4 min-w-[121px]'
                    onClick={() => setViewLetter(false)}
                  >
                    <IoIosArrowBack /> Back
                  </button>
                </div>
              </div>
            )}

            <div className='mt-4 h-[calc(100%-100px)]'>
              <embed
                src={`${viewLetterLink}#view=FitH&toolbar=1&scrollbar=1&statusbar=1&messages=1&navpanes=0&pagemode=none`}
                type='application/pdf'
                className='size-full min-h-full min-w-full bg-loader'
              />
            </div>
          </>
        ) : (
          <TinyEditor
            initialValue={initialValue || ''}
            type={type}
            label={true}
            callSubmit={handleSaveStepData}
            isView={isView}
            variable={[]}
            reSize={true}
            height={'95%'}
            slots={{
              header: (
                <>
                  {viewLetterLink && (
                    <Link
                      to={'#'}
                      className={`btn btn-secondary flex justify-between items-center text-nowrap gap-3 mr-4 ${!viewLetterLink ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title={`${!viewLetterLink ? 'No letter generated.' : ''}`}
                      onClick={() => setViewLetter(true)}
                    >
                      View <FaEye />
                    </Link>
                  )}
                </>
              )
            }}
            classes={{
              editorBlock: viewLetterLink ? '!h-[calc(100%-150px)]' : '!h-[calc(100%-135px)]',
              submitBtnBlock: '!fixed !p-5'
            }}
          />
        )}
      </div>
    </div>
  )
}

export default Step
