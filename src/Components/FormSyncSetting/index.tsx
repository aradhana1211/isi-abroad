import { SetStateAction, useContext, useEffect, useState } from 'react'
import http from 'CommonJS/http'
import { FaEdit, FaEye, FaSave } from 'react-icons/fa'
import { MdCloudSync } from 'react-icons/md'
import AdminSetting from 'Components/AdminSetting'
import TinyEditor from 'Components/TinyEditor'
import ImageSelector from 'Components/ImageSelector'
import Loading from 'Components/Loading'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import './index.css'
import { AppContext } from 'Context/AppContext'
import { AppContextType } from 'Context/AppTypes'
import { FormSubStep, FormStep, Setting } from './type'
import { toast } from 'Components/Toast/toast'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { IoCloseSharp } from 'react-icons/io5'

declare global {
  interface Event {
    submitter?: HTMLElement
  }
}

export default function FormSyncSetting() {
  const [formData, setFormData] = useState<FormStep[]>([])
  const [setting, setSetting] = useState<Setting>({})
  const [showEditor, setShowEditor] = useState<boolean>(false)
  const [stepData, setstepData] = useState<FormStep>()
  const [view, setView] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const { uploadFile } = useContext(AppContext) as AppContextType
  const [open, setOpen] = useState(false)
  const [action, setAction] = useState('')
  const [label, setLabel] = useState('')

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    borderRadius: 1,
    p: 4
  }

  useEffect(() => {
    getformStep()
  }, [])

  const getformStep = async () => {
    setLoading(true)
    http
      .fetch({ path: 'setting/formStep' })
      .catch(() => {
        setLoading(false)
        toast('Internal Server Error.', 'error')
      })
      .then((response) => {
        setLoading(false)
        if (response && response.status === 200) {
          setFormData(response.data.formSteps)
          setSetting(response.data.setting)
        }
      })
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>, subStep: FormSubStep, field: string) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    let response
    if (field == 'icon') {
      setLoading(true)
      const file = data.get(field)
      if (file instanceof File && file.type) {
        response = await uploadFile(file)
      }
    }
    if (response?.success || field != 'icon') {
      const iconUpload = response?.document.id
      const clickedButton = e.nativeEvent.submitter as HTMLButtonElement
      const payload = {
        [field]: field == 'icon' ? iconUpload : data.get(field),
        flag: clickedButton.name
      }
      setLoading(true)
      http
        .fetch({ method: 'post', path: `setting/formSubStep/${subStep.id}`, data: payload })
        .catch((error) => {
          setLoading(false)
          toast(error?.response?.data?.message, 'error')
        })
        .then((response) => {
          setLoading(false)
          if (response && response.status === 200) {
            getformStep()
            toast(response?.data?.message, 'success')
          }
        })
    }
  }

  const changeFileState = async (file: SetStateAction<File | undefined>, subStepId: number | string) => {
    try {
      await setLoading(true)
      if (file instanceof File && file.type) {
        const fileRes = await uploadFile(file)
        if (fileRes) {
          const iconUpload = await fileRes?.document.id
          if (fileRes?.document.id) {
            const payload = {
              icon: iconUpload,
              flag: 'save'
            }
            http
              .fetch({ method: 'post', path: `setting/formSubStep/${subStepId}`, data: payload })
              .catch((error) => {
                toast(error?.response?.data?.message, 'error')
              })
              .then((response) => {
                if (response && response.status === 200) {
                  getformStep()
                  setLoading(false)
                  toast(response?.data?.message, 'success')
                }
              })
          }
        }
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const handleSaveStepData = (value: string, settingType: string) => {
    setLoading(true)
    const payload = {
      [settingType]: value
    }
    http
      .fetch({ method: 'put', path: `setting/formStep/${stepData?.id}`, data: payload })
      .catch((error) => {
        setLoading(false)
        toast(error?.response?.data?.message, 'error')
      })
      .then((response) => {
        setLoading(false)
        if (response && response.status === 200) {
          setFormData(formData.map((step) => (step.id === stepData?.id ? { ...step, [settingType]: value } : step)))
          setSetting({ ...setting, [settingType]: value })
          toast(response?.data?.message, 'success')
        }
      })
  }

  const changeGlobalIconFileState = async (file: SetStateAction<File | undefined>, iconId: number | string) => {
    try {
      await setLoading(true)
      if (file instanceof File && file.type) {
        const fileRes = await uploadFile(file)
        if (fileRes) {
          const iconUpload = await fileRes?.document.id
          if (iconUpload) {
            const step = await formData.find((data) => data?.isDefaultSetting)
            let payload
            if (iconId === 'complete') payload = { complete_step_icon: iconUpload }
            else if (iconId === 're_check') payload = { recheck_step_icon: iconUpload }
            else if (iconId === 'ready_to_review') payload = { ready_to_review_step_icon: iconUpload }

            http
              .fetch({ method: 'put', path: `setting/formStep/${step?.id}`, data: payload })
              .catch((error) => {
                toast(error?.response?.data?.message, 'error')
              })
              .then((response) => {
                if (response && response.status === 200) {
                  getformStep()
                  setLoading(false)
                  toast(response?.data?.message, 'success')
                }
              })
          }
        }
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <div className='w-8/12 lg:w-full'>
      {loading && <Loading />}
      <div className='flex w-full min-h-screen md:flex-wrap md:min-h-full'>
        <AdminSetting />
        {!showEditor ? (
          <div className='w-full p-6 md:px-4'>
            <div className='flex justify-between items-center min-h-12 mb-7 md:mb-5 '>
              <h1 className='text-3xl font-bold uppercase md:text-2xl'>Form Sync Setting</h1>
            </div>
            <div className=''>
              {formData.map((step, index) => (
                <div
                  className='p-4 rounded-md border border-slate-200 shadow-md shadow-primary/10 mt-7 md:p-2'
                  key={`${step?.id ?? 'form_step'}_${index}`}
                >
                  <Accordion className='steps-list' defaultExpanded={index === 0}>
                    <AccordionSummary className='step' expandIcon={<ExpandMoreIcon />} aria-controls='panel1-content' id='panel1-header'>
                      <h3 className='text-3xl font-bold lg:text-lg'> {step?.name} </h3>
                    </AccordionSummary>
                    <AccordionDetails className=''>
                      {step.isDefaultSetting ? (
                        <div className=' contents mt-5'>
                          <div className=' flex items-center'>
                            <label className='text-xl font-medium decoration-1 md:text-base w-1/3'>Complete Step Icon</label>
                            <ImageSelector
                              size={'55px'}
                              imageSrc={setting?.completeStepIcon}
                              changeFileState={changeGlobalIconFileState}
                              id={'complete'}
                            />
                          </div>
                          <div className=' flex items-center mt-3 mb-5'>
                            <label className='text-xl font-medium decoration-1 md:text-base w-1/3'>Re-Check Step Icon</label>
                            <ImageSelector
                              size={'55px'}
                              imageSrc={setting?.recheckStepIcon}
                              changeFileState={changeGlobalIconFileState}
                              id={'re_check'}
                            />
                          </div>
                          <div className=' flex items-center mt-3 mb-5'>
                            <label className='text-xl font-medium decoration-1 md:text-base w-1/3'>Ready To Review Step Icon</label>
                            <ImageSelector
                              size={'55px'}
                              imageSrc={setting?.readyToReviewStepIcon}
                              changeFileState={changeGlobalIconFileState}
                              id={'ready_to_review'}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className='flex gap-4 items-center justify-end instructions step after:hidden'>
                          <div className='flex gap-4 items-center justify-end instructions step after:hidden'>
                            <label className='text-2xl font-semibold decoration-1 md:text-lg mb-2 inline-block'>Title For Student</label>
                            <button
                              className='btn-primary uppercase flex gap-3 items-center p-3'
                              onClick={() => {
                                setOpen(true)
                                setstepData(step)
                                setAction('titleForStudent')
                                setLabel('Title For Student')
                              }}
                            >
                              <FaEdit />
                            </button>
                          </div>
                          <div className='flex gap-4 items-center justify-end instructions step after:hidden'>
                            <label className='text-2xl font-semibold decoration-1 md:text-lg'>Title For Admin</label>
                            <button
                              className='btn-primary uppercase flex gap-3 items-center p-3'
                              onClick={() => {
                                setOpen(true)
                                setstepData(step)
                                setAction('titleForAdmin')
                                setLabel('Title For Admin')
                              }}
                            >
                              <FaEdit />
                            </button>
                          </div>
                          <div className='flex gap-4 items-center justify-end instructions step after:hidden'>
                            <label className='text-2xl font-semibold decoration-1 md:text-lg'>Instructions</label>
                            <button
                              className='btn-primary uppercase flex gap-3 items-center p-3'
                              onClick={() => {
                                setShowEditor(true)
                                setstepData(step)
                                setView(false)
                              }}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className='btn-primary uppercase flex gap-3 items-center p-3'
                              onClick={() => {
                                setShowEditor(true)
                                setstepData(step)
                                setView(true)
                              }}
                            >
                              <FaEye />
                            </button>
                          </div>
                        </div>
                      )}
                      <div className='overflow-x-auto'>
                        <table className='table-auto w-full md:table'>
                          <thead>
                            <tr>
                              <th>Name</th>
                              {!step?.isDefaultSetting && <th>Icon</th>}
                              <th>Gravity form</th>
                            </tr>
                          </thead>
                          <tbody>
                            {step.formSubSteps.map((subStep, index) => (
                              <tr key={`${subStep?.id ?? 'form_sub_step'}_${index}`}>
                                <td>
                                  <label className='text-xl font-medium decoration-1 md:text-base'>{subStep?.name}</label>
                                </td>
                                {!step?.isDefaultSetting && (
                                  <td>
                                    <div className='flex items-center gap-4 justify-center'>
                                      <ImageSelector
                                        size={'65px'}
                                        imageSrc={subStep?.icon}
                                        id={subStep.id}
                                        key={`${subStep.id}-${subStep.icon}`}
                                        changeFileState={changeFileState}
                                      />
                                    </div>
                                  </td>
                                )}
                                {subStep?.type == 'form' ? (
                                  <td>
                                    <form
                                      className='flex gap-2 justify-end lg:flex-wrap lg:justify-center'
                                      key={index}
                                      data-cy={`${index}_sub_step_form`}
                                      onSubmit={(e) => handleSave(e, subStep, 'hubspotFormId')}
                                    >
                                      <input
                                        name='hubspotFormId'
                                        defaultValue={subStep?.hubspotFormId || ''}
                                        type='number'
                                        className='form-input max-w-52 md:min-w-36 md:max-w-36 py-2'
                                        placeholder='Gravity From Id'
                                        title='Type Gravity From Id'
                                        required={true}
                                      />
                                      <button className='btn-primary p-3' name='save' title='Save gravity form id'>
                                        <FaSave />
                                      </button>
                                      <button
                                        className='btn-primary p-3'
                                        name='sync'
                                        data-cy='save-and-sync-btn'
                                        title='Save & Sync gravity form structure with backend'
                                      >
                                        <MdCloudSync />
                                      </button>
                                    </form>
                                  </td>
                                ) : (
                                  <td className='text-center'>--</td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className='w-full p-6 md:px-4 min-w-[670px] md:min-w-full'>
              <TinyEditor
                initialValue={stepData?.instructions || ''}
                type={'instructions'}
                label={'Instruction'}
                callSubmit={handleSaveStepData}
                isView={view}
                variable={[]}
                back={() => {
                  setShowEditor(false)
                }}
              />
            </div>
          </>
        )}
      </div>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false)
        }}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Typography id='modal-modal-title' variant='h6' component='h1'>
            {label}
          </Typography>
          <Box className='absolute top-3 right-3'>
            <IconButton
              onClick={() => {
                setOpen(false)
              }}
            >
              <IoCloseSharp />
            </IconButton>
          </Box>
          <form
            className='mt-2'
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault()
              const data = new FormData(e.currentTarget)
              handleSaveStepData(String(data.get(action)), action)
            }}
          >
            <input
              name={action}
              defaultValue={String(stepData?.[action as keyof FormStep]) || ''}
              type='text'
              className='form-input py-2'
              placeholder={label}
              title={label}
              required={true}
            />
            <button className='mt-5 btn-primary' name='save' title='Save gravity form id'>
              Save
            </button>
          </form>
        </Box>
      </Modal>
    </div>
  )
}
