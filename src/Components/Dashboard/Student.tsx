import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { BsQuestionCircleFill } from 'react-icons/bs'
import { useEffect, useState, useContext, ChangeEvent, useRef } from 'react'
import http from 'CommonJS/http'
import StudentBanner from 'Components/StudentBanner'
import { UserContext } from 'Context/UserContext'
import { FormStep, FormSubStep, StepInfo, Icon, DocumentType, ActionType } from './type'
import StepDetails from './StepDetails'
import Step from './Step'
import { subStepContext } from './context'
import { CgFileDocument } from 'react-icons/cg'
import ConfirmationAlert from 'Components/ConfirmationAlert'
import TinyEditor from 'Components/TinyEditor'
import { FaTrashAlt } from 'react-icons/fa'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import Loading from 'Components/Loading'
import Checkbox from '@mui/material/Checkbox'
import { AppContext } from 'Context/AppContext'
import { AppContextType } from 'Context/AppTypes'
import { FormStepIdEnum } from 'CommonJS/FormSubStepEnum'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs, { Dayjs } from 'dayjs'
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker'
import { BaseSingleInputFieldProps, DateValidationError, FieldSection } from '@mui/x-date-pickers/models'
import { UseDateFieldProps } from '@mui/x-date-pickers/DateField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { toast } from 'Components/Toast/toast'
import noImagePlaceholder from '../../assets/images/no-image-placeholder.png'
import FileUpload from 'Components/FileUpload'
import { AppStatusStyle, StatusEnum } from 'CommonJS/StatusEnum'
import { FormSubStepStudentTableFieldsEnum } from 'CommonJS/FormSubStepStudentTableFieldsEnum'
import { linkify } from 'CommonJS/common'

export default function StudentDashboard() {
  const { data } = useContext(UserContext)

  const [formStepsList, setFormStepsList] = useState<FormStep[]>([])
  const [stepInfo, setStepInfo] = useState<StepInfo | undefined>()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [formSubStep, setFormSubStep] = useState<FormSubStep | null>(null)
  const match = useLocation()
  const { id } = useParams()
  const [openStepModal, setStepOpenModal] = useState<boolean>(false)
  const [formStep, setFormStep] = useState<FormStep | null>(null)
  const [instructionScreen, setInstructionScreen] = useState<boolean>(false)

  const [isConfirmModalOpen, setConfirmModalOpen] = useState<boolean>(false)
  const [action, setAction] = useState<string>('')
  const [actionLabel, setActionLabel] = useState<string>('')
  const [initialValue, setInitialValue] = useState<string>('')
  const [savedLetterLink, setSavedLetterLink] = useState<string>('')
  const [icon, setActionIcon] = useState<Icon | null>(null)
  const { multipleUploadFile } = useContext(AppContext) as AppContextType
  const [loading, setLoading] = useState(false)
  const [openText, setOpenText] = useState(false)
  const { dispatch } = useContext(subStepContext)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const [deleteVal, setDeleteVal] = useState<any>()
  const [isViewOnly, setViewOnly] = useState<boolean>(false)
  const [event, setEvent] = useState<boolean | undefined>()
  const [subStep, setSubStep] = useState<any>()
  const [columnName, setColumnName] = useState<string>('')
  const [inputValue, setInputValue] = useState<string>()
  const [statusConfirm, setStatusConfirm] = useState<boolean>(false)
  const FormSubStepStudentTableFieldIds = Object.values(FormSubStepStudentTableFieldsEnum).filter((value) => isNaN(Number(value)) === false)

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1
  })

  let studentId: any
  if (match.pathname.includes('student-dashboard')) {
    studentId = id
  } else {
    studentId = data?.student?.id
  }

  const firstAcceptedIndex =
    data.roles.includes('student') && formStepsList.findIndex((step) => step.modifiedStatus == false) != -1
      ? formStepsList.findIndex((step) => step.modifiedStatus == false)
      : formStepsList.length

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    await setLoading(true)
    await getFormStepList()
    await getStepInfo()
    await getSubStepFormMeta()
    await setLoading(false)
  }
  function canPerformAction(showToast = true, defaultStepInfo = null) {
    const localStepInfo = defaultStepInfo ?? stepInfo
    const applicationStatus = localStepInfo?.applicationStatus ? localStepInfo?.applicationStatus : ''
    const can =
      localStepInfo?.deletedAt === null &&
      ![StatusEnum.REJECT as string, StatusEnum.WITHDRAW as string].includes(applicationStatus?.toLowerCase())

    if (!can && showToast) toast('Action cannot be performed on archived students.', 'warning')

    return can
  }

  async function getSubStepFormMeta() {
    try {
      const response = await http.fetch({ path: `student/${studentId}/meta` })
      if (response.data.success) {
        dispatch({ type: ActionType.SET_META, payload: response.data.message })
      }
    } catch (error) {
      toast('something went wrong please try again', 'error')
    }
  }

  const getFormStepList = () => {
    return http
      .fetch({ path: `student/formSteps/${studentId}` })
      .catch(() => {
        toast('Internal server error.', 'error')
        setLoading(false)
      })
      .then((response) => {
        if (response && response.status === 200) {
          setFormStepsList(response.data.formSteps)
          setActionIcon(response.data.setting)
        }
      })
  }

  const getStepInfo = () => {
    return http
      .fetch({ path: `students/${studentId}?needFormSteps=true` })
      .catch(() => {
        toast('Internal server error.', 'error')
        setLoading(false)
      })
      .then((response) => {
        if (response && response.status === 200) {
          setStepInfo(response.data.student)

          if (!canPerformAction(false, response.data.student)) {
            const styleTag = document.createElement('style')
            styleTag.classList.add('disable-action-dynamic-style')
            styleTag.textContent =
              '.main-content :has(> .MuiButtonBase-root), .main-content button.btn-primary, .main-content button.btn-secondary { opacity: 50% !important; cursor: not-allowed !important; }'
            document.head.appendChild(styleTag)
          } else {
            document.head.querySelectorAll('.disable-action-dynamic-style')?.forEach((e) => e.remove())
          }
        }
      })
  }

  const performAction = () => {
    http
      .fetch({ method: 'put', path: `students/${studentId}/${action}` })
      .catch(() => {
        toast('Internal server error.', 'error')
      })
      .then((response) => {
        if (response && response.status === 200) {
          toast(response?.data.message, 'success')
          setConfirmModalOpen(false)
          if (response.data.stepStatus && stepInfo) {
            setStepInfo({
              ...stepInfo,
              step1Status: response.data.stepStatus?.step1Status,
              step2Status: response.data.stepStatus?.step2Status,
              step3Status: response.data.stepStatus?.step3Status,
              step4Status: response.data.stepStatus?.step4Status,
              applicationStatus: response.data.stepStatus?.applicationStatus
            })
          } else {
            getStepInfo()
          }
          if (action == 'rejectStudent') {
            navigate(0)
          }
        }
      })
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>, document: any, column: string) => {
    try {
      event.preventDefault()
      const imageFile = event.target.files
      await setLoading(true)
      if (imageFile) {
        const fileRes = await multipleUploadFile(imageFile, id)
        if (fileRes && ['supporting_documents'].includes(column)) {
          if (column == 'supporting_documents') {
            const addedDocumentId = fileRes.document.map((item: any) => item.id)
            const documents = document.map((item: DocumentType) => item.id)
            const IDs = [...addedDocumentId, ...documents]
            onSaveUserInfo(IDs, column)
          } else {
            onSaveUserInfo(fileRes.document[0].id, column)
          }
        } else {
          onSaveUserInfo(fileRes.document[0]?.id, column)
        }
      }
      await setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const onSaveUserInfo = async (content: any, param: string) => {
    try {
      const info = {
        [param]: content
      }
      await setLoading(true)
      await http
        .fetch({
          path: `/students/${studentId}`,
          method: 'put',
          data: info
        })
        .then(async (response) => {
          if (response && response.status === 200) {
            getStepInfo()
            toast(response?.data?.message, 'success')
          }
          setLoading(false)
        })
    } catch (error) {
      setLoading(false)
      toast('Internal server error.', 'error')
    }
  }

  const deleteDocument = async (document: number) => {
    http
      .fetch({ method: 'delete', path: `document/${document}` })
      .catch(() => {
        toast('Internal server error.', 'error')
      })
      .then((response) => {
        if (response && response.status === 200) {
          toast(response?.data?.message, 'success')
        }
      })
  }

  const handleCheckboxChange = () => {
    if (!canPerformAction()) return
    const payload = {
      [columnName]: event === undefined ? inputValue : event
    }
    setLoading(true)
    http
      .fetch({ method: 'put', path: `saveStepInfo/${studentId}/${subStep.id}`, data: payload })
      .catch((error) => {
        setLoading(false)
        toast(error?.response?.data?.message, 'error')
        setStatusConfirm(false)
      })
      .then((response) => {
        setLoading(false)
        if (response && response.status === 200) {
          if (stepInfo) {
            const updatedStudentStepInformation = stepInfo?.studentStepInformation.map((item) => {
              if (item.formSubStepId === subStep.id) {
                return response.data.stepInfo
              }
              return item
            })
            const updatedStepInfo = {
              ...stepInfo,
              studentStepInformation: updatedStudentStepInformation,
              step1Status: response.data.student.step1Status,
              step2Status: response.data.student.step2Status,
              step3Status: response.data.student.step3Status,
              step4Status: response.data.student.step4Status
            }
            setStepInfo(updatedStepInfo)
            if (response.data.formStep.id) {
              const updateStepList = formStepsList?.map((item) => {
                if (item.id === response.data.formStep.id) {
                  return { ...item, modifiedStatus: response.data.formStep.modifiedStatus }
                }
                return item
              })
              setFormStepsList(updateStepList)
            }
          }
          toast(response?.data?.message, 'success')
        }
        setStatusConfirm(false)
      })
  }

  const getLetter = (isView: boolean, action: string, label: string) => {
    if (!canPerformAction()) return
    if (['billingDepositDocument'].includes(action)) {
      setInstructionScreen(isView)
      setStepOpenModal(true)
      setAction(action)
      setActionLabel(label)
      setSavedLetterLink(String(stepInfo?.[action as keyof StepInfo]) ?? '')
    } else {
      http
        .fetch({ path: `setting/${studentId}?setting_column=${action}` })
        .catch(() => {
          toast('Internal server error.', 'error')
        })
        .then((response) => {
          if (response && response.status === 200) {
            setInstructionScreen(isView)
            setStepOpenModal(true)
            setAction(action)
            setActionLabel(label)
            if (response.data.setting?.[action]) {
              setInitialValue(response.data.setting?.[action].value)
            }
            setSavedLetterLink(response.data.setting?.letterLink)
          }
        })
    }
  }

  const saveLatter = async (value: string, settingType: string): Promise<string | null> => {
    if (settingType == 'instructions') {
      getFormStepList()
      return null
    }

    const payload = {
      [settingType]: value
    }
    let newUrl = savedLetterLink
    await http
      .fetch({ method: 'put', path: `student-letter/${studentId}?setting_column=${settingType}`, data: payload })
      .catch((error) => {
        toast(error?.response?.data?.message, 'error')
      })
      .then((response) => {
        if (response && response.status === 200) {
          toast(response?.data?.message, 'success')
          setOpenModal(false)
          setSavedLetterLink(response?.data?.url)
          newUrl = response?.data?.url
        }
      })

    return newUrl
  }

  const sendStudentLetter = (type: string): Promise<any> => {
    return http
      .fetch({ method: 'post', path: `student-letter/${studentId}/send`, data: { letterName: type } })
      .catch((error) => {
        toast(error?.response?.data?.message, 'error')
      })
      .then((response) => {
        setConfirmModalOpen(false)
        if (response && response.status === 200) {
          toast(response?.data?.message, 'success')
          setStepOpenModal(false)
          setSavedLetterLink('')
        }
      })
  }

  const handleDelete = async () => {
    if (!canPerformAction()) return
    const IDs = stepInfo?.supportingDocuments.map((item: any) => item.id)
    const removedId = IDs?.filter((item) => item !== deleteVal?.id)
    await onSaveUserInfo(removedId, 'supporting_documents')
    deleteDocument(deleteVal.id)
    setConfirmModalOpen(false)
  }

  interface ButtonFieldProps
    extends UseDateFieldProps<Dayjs>,
      BaseSingleInputFieldProps<Dayjs | null, Dayjs, FieldSection, DateValidationError> {
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  }

  function ButtonField(props: ButtonFieldProps) {
    const { setOpen, label, id, InputProps: { ref } = {}, inputProps: { 'aria-label': ariaLabel } = {} } = props

    return (
      <label
        className='cursor-pointer'
        id={id}
        ref={ref}
        aria-label={ariaLabel}
        onClick={() => {
          if (!canPerformAction()) return
          setOpen?.((prev) => !prev)
        }}
      >
        {label ? `Due Date: ${label}` : (data.roles.includes('superadmin') || data.roles.includes('advisor')) && 'Enter Due Date'}
      </label>
    )
  }

  interface ButtonDatePickerProps extends Omit<DatePickerProps<Dayjs>, 'open' | 'onOpen' | 'onClose'> {
    subStep: any
    defaultValue: any
  }

  function ButtonDatePicker(props: ButtonDatePickerProps) {
    const [open, setOpen] = useState(false)
    const { subStep, defaultValue } = props
    const [value, setValue] = useState<Dayjs | null>(defaultValue)
    return (
      <DatePicker
        slots={{ field: ButtonField, ...props.slots }}
        slotProps={{ field: { setOpen } as any }}
        {...props}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        onChange={(newValue) => {
          setValue(newValue)
          setStatusConfirm(true)
          setEvent(undefined)
          setSubStep(subStep)
          setColumnName('dueDate')
          setInputValue(newValue?.format('MM/DD/YYYY'))
        }}
        value={value}
        disableOpenPicker={data.roles.includes('student')}
      />
    )
  }

  return (
    <>
      <div className={`main-content py-7 px-5 bg-[#e6e4e5] w-full h-[calc(100vh-77px)] overflow-auto ${openModal ? 'model-open' : ''}`}>
        {data.roles.includes('student') && <StudentBanner />}
        <div className='mb-7 flex justify-between flex-wrap gap-1'>
          <div>
            <div className='gap-2 flex items-center'>
              <h2 className='text-3xl font-bold text-primary mb-2'>
                {data.roles.includes('student') ? 'Application Dashboard' : 'Student Application'}
              </h2>{' '}
              <button
                className='badge badge-primary capitalize text-center min-w-[100px]'
                style={stepInfo?.applicationStatus?.toLowerCase() ? AppStatusStyle[stepInfo?.applicationStatus?.toLowerCase()] : {}}
              >
                {stepInfo?.applicationStatus ?? '...'}
              </button>
            </div>
          </div>

          <div className='ml-auto lg:mt-2'>
            <div className='text-end me-4 font-semibold'>Your Admissions Advisor</div>
            {stepInfo?.advisor ? (
              <div className='flex items-center'>
                <div className='text-end'>
                  <div>{stepInfo?.advisor?.name}</div>
                  <div>
                    <Link to={`mailto:${stepInfo?.advisor?.email}`} className='link'>
                      {stepInfo?.advisor?.email}
                    </Link>
                  </div>
                  <div>
                    <Link to={stepInfo?.advisor?.phoneNumber ? `tel:${stepInfo?.advisor?.phoneNumber}` : '#'} className='link'>
                      {stepInfo?.advisor?.phoneNumber}
                    </Link>
                  </div>
                </div>
                <div className='ms-2'>
                  {stepInfo?.advisor?.photoLink ? (
                    <img src={stepInfo?.advisor?.photoLink ?? noImagePlaceholder} alt='no-image' className='w-28 h-28 rounded-full' />
                  ) : (
                    <img src={noImagePlaceholder} alt='no-image' className='w-28 h-28 rounded-full' />
                  )}
                </div>
              </div>
            ) : (
              <div className='flex justify-center'>
                <div>No Advisor Assign</div>
              </div>
            )}
          </div>
        </div>
        {loading && (
          <div className={`${!formStepsList || formStepsList?.length === 0 ? 'rounded-md bg-white p-4 mb-3 h-[80vh]' : ''}`}>
            <Loading />
          </div>
        )}

        {formStepsList &&
          formStepsList.length > 0 &&
          formStepsList.map((step, index) => {
            if (index < firstAcceptedIndex) {
              return (
                <div className={`${data.roles.includes('student') ? 'mb-5' : 'mb-20'}`} key={index}>
                  <div className='grid grid-cols-2 mb-2 items-center lg:grid-cols-1'>
                    <div className='flex items-center mb-2'>
                      <h4 className='mr-2 text-2xl font-semibold text-primary'>
                        {data.roles.includes('student') ? step?.titleForStudent : step.titleForAdmin}
                      </h4>
                      {step?.instructions && (
                        <BsQuestionCircleFill
                          className='w-5 mt-1 h-5 text-slate-400 cursor-pointer'
                          title={'instruction'}
                          onClick={() => {
                            setInstructionScreen(true)
                            setFormStep(step)
                            setStepOpenModal(true)
                            setAction('instructions')
                            setActionLabel('Instruction')
                            setInitialValue(step.instructions)
                          }}
                        />
                      )}
                    </div>

                    <div className={`text-end lg:text-start ${!data.roles.includes('student') && index == 3 ? 'hidden' : ''}`}>
                      <span
                        className={`${
                          index == 0 && (stepInfo?.step1Status == StatusEnum.ACCEPTED || stepInfo?.step1Status == StatusEnum.CONDITIONAL)
                            ? 'btn-primary bg-primary'
                            : index == 1 && stepInfo?.step2Status == StatusEnum.CONFIRM
                              ? 'btn-primary bg-primary'
                              : index == 2 && stepInfo?.step3Status == '1'
                                ? 'btn-primary bg-primary'
                                : index == 3 && stepInfo?.step4Status == StatusEnum.COMPLETED
                                  ? 'btn-primary bg-primary'
                                  : 'btn-secondary bg-secondary'
                        } inline-block font-semibold text-white text-center w-96	 lg:w-auto uppercase`}
                      >
                        Status:{' '}
                        {index === 0
                          ? stepInfo?.step1Status !== null
                            ? stepInfo?.step1Status
                            : 'Incomplete'
                          : index === 1
                            ? stepInfo?.step2Status === null ||
                              stepInfo?.step2Status === 'pending' ||
                              stepInfo?.step2Status === 'Pending' ||
                              stepInfo?.step2Status === 'Processing' ||
                              stepInfo?.step2Status === 'processing'
                              ? 'Enrollment Pending'
                              : 'Accepted'
                            : index === 2
                              ? stepInfo?.step3Status == 1 || stepInfo?.step3Status == true
                                ? 'Accepted'
                                : 'Incomplete'
                              : index === 3
                                ? stepInfo?.step4Status !== null
                                  ? stepInfo?.step4Status
                                  : 'Incomplete'
                                : 'Incomplete'}
                        !
                      </span>
                    </div>
                  </div>

                  <div className='rounded-md bg-white p-4 mb-3'>
                    <div className='grid grid-cols-5 lg:grid-cols-3 md:grid-cols-2'>
                      {step.formSubSteps.map((subStep, subindex) => (
                        <div className='text-center px-2' key={subindex}>
                          <div className='relative mb-2 rounded-full mx-auto flex items-center justify-center bg-primary-b w-28 h-28 lg:w-20 lg:h-20'>
                            {(stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)?.isApproved &&
                              !stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)?.isRecheck) ||
                            (stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)?.isCompleted &&
                              !stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)?.isRecheck) ||
                            (FormSubStepStudentTableFieldIds.includes(subStep?.id) &&
                              stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)?.isSubmitted) ? (
                              <img
                                src={icon?.completeStepIcon}
                                className='w-7 h-7 object-cover lg:w-5 lg:h-5 text-secondary bg-white rounded-full absolute top-2 right-0'
                              />
                            ) : (!stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)?.isApproved &&
                                stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)?.isRecheck) ||
                              (!stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)?.isCompleted &&
                                stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)?.isRecheck) ? (
                              <img
                                src={icon?.recheckStepIcon}
                                className='w-7 h-7 object-cover lg:w-5 lg:h-5 text-secondary bg-white rounded-full absolute top-2 right-0'
                              />
                            ) : stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)?.isSubmitted &&
                              !FormSubStepStudentTableFieldIds.includes(subStep?.id) ? (
                              <img
                                src={icon?.readyToReviewStepIcon}
                                className='w-7 h-7 object-cover lg:w-5 lg:h-5 text-secondary bg-white rounded-full absolute top-2 right-0'
                              />
                            ) : null}
                            {subStep?.icon ? (
                              <img src={subStep?.icon} alt='Icon' className='w-28 h-28 rounded-full bg-[rgb(230,228,229)]' />
                            ) : (
                              <img src={noImagePlaceholder} alt='no-Icon' className='w-28 h-28 rounded-full bg-[rgb(230,228,229)]' />
                            )}
                          </div>
                          <h3 className='text-xl lg:text-base font-medium'>{subStep?.name}</h3>
                          {subStep?.type !== 'link' && (
                            <div className='block cursor-pointer'>
                              {subStep.id === FormStepIdEnum.TWELVE ? (
                                <>
                                  {data.roles.includes('student') &&
                                    index == 1 &&
                                    stepInfo?.step2Status != 'confirm' &&
                                    subStep?.canBeMarkedAsCompleted &&
                                    !stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)?.isCompleted && (
                                      <div
                                        onClick={() => {
                                          fileInputRef?.current?.click()
                                        }}
                                        className={index == 1 && stepInfo?.step2Status == StatusEnum.CONFIRM ? 'hidden' : ''}
                                      >
                                        {subStep?.type == 'form'
                                          ? stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)
                                              ?.isSubmitted
                                            ? 'click to edit'
                                            : 'click to submit'
                                          : 'Click to Upload'}
                                        <input
                                          type='file'
                                          ref={fileInputRef}
                                          style={{ display: 'none' }}
                                          onChange={(event) =>
                                            handleFileChange(event, stepInfo?.billingDepositDocument, 'billing_deposit_document')
                                          }
                                        />
                                      </div>
                                    )}
                                </>
                              ) : (
                                ![FormStepIdEnum.EIGHT, FormStepIdEnum.TEN].includes(subStep.id) && (
                                  <div
                                    onClick={() => {
                                      setOpenModal(true)
                                      setFormSubStep(subStep)
                                      setViewOnly(false)
                                    }}
                                    className={
                                      ((index == 0 &&
                                        (stepInfo?.step1Status == StatusEnum.ACCEPTED ||
                                          stepInfo?.step1Status == StatusEnum.CONDITIONAL)) ||
                                        (index == 1 && stepInfo?.step2Status == StatusEnum.CONFIRM) ||
                                        (index == 2 && stepInfo?.step3Status == true) ||
                                        (index == 3 && stepInfo?.step4Status == StatusEnum.COMPLETED) ||
                                        (subStep?.hasApproved &&
                                          stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)
                                            ?.isApproved) ||
                                        (subStep?.canBeMarkedAsCompleted &&
                                          stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)
                                            ?.isCompleted)) &&
                                      data.roles.includes('student')
                                        ? 'hidden'
                                        : ''
                                    }
                                  >
                                    {subStep?.type == 'form'
                                      ? stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)?.isSubmitted
                                        ? 'click to edit'
                                        : 'click to submit'
                                      : 'Click to Upload'}
                                  </div>
                                )
                              )}
                            </div>
                          )}

                          <div
                            className='text-secondary block mb-1 cursor-pointer'
                            onClick={() => {
                              if (subStep.id == FormStepIdEnum.EIGHT) {
                                getLetter(true, 'acceptanceLetter', 'Generate Acceptance Letter')
                              } else if (subStep.id == FormStepIdEnum.TEN) {
                                getLetter(true, 'visaLetter', 'Generate Italian Visa Letter')
                              } else if (subStep.id == FormStepIdEnum.TWELVE) {
                                if (stepInfo?.billingDepositDocument) {
                                  getLetter(true, 'billingDepositDocument', 'Billing Deposit Document')
                                } else {
                                  toast('No invoice is uploaded yet', 'error')
                                }
                              } else {
                                setFormSubStep(subStep)
                                setOpenModal(true)
                                setViewOnly(true)
                              }
                            }}
                          >
                            {subStep?.type == 'link' ? 'Link' : '(View)'}
                          </div>
                          {(data.roles.includes('superadmin') || data.roles.includes('advisor')) && (
                            <div className='flex flex-col items-start mx-auto w-full'>
                              {Boolean(subStep?.hasApproved) &&
                                !stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)?.isApproved && (
                                  <div className='block cursor-pointer'>
                                    <Checkbox
                                      id={`approve_${subStep.id}`}
                                      checked={
                                        stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)?.isApproved ==
                                        true
                                      }
                                      onChange={(event) => {
                                        setStatusConfirm(true)
                                        setEvent(event?.target.checked)
                                        setSubStep(subStep)
                                        setColumnName('isApproved')
                                      }}
                                    />
                                    <label htmlFor={`approve_${subStep.id}`}> Approve</label>
                                  </div>
                                )}

                              {Boolean(subStep?.canBeMarkedAsCompleted) &&
                                !stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)?.isCompleted && (
                                  <div className='block cursor-pointer'>
                                    <Checkbox
                                      id={`is_completed_${subStep.id}`}
                                      checked={
                                        stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)
                                          ?.isCompleted == true
                                      }
                                      onChange={(event) => {
                                        setStatusConfirm(true)
                                        setEvent(event?.target.checked)
                                        setSubStep(subStep)
                                        setColumnName('isCompleted')
                                      }}
                                    />
                                    <label htmlFor={`is_completed_${subStep.id}`}> Mark Complete</label>
                                  </div>
                                )}

                              {(stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)?.isApproved == true ||
                                stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)?.isCompleted ==
                                  true) && (
                                <div className='block cursor-pointer'>
                                  <Checkbox
                                    id={`is_recheck_${subStep.id}`}
                                    onChange={(event) => {
                                      setStatusConfirm(true)
                                      setEvent(event?.target.checked)
                                      setSubStep(subStep)
                                      setColumnName('isRecheck')
                                    }}
                                    checked={
                                      stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)?.isRecheck ==
                                      true
                                    }
                                  />
                                  <label htmlFor={`is_recheck_${subStep.id}`}> Recheck</label>
                                </div>
                              )}
                              {subStep.id == FormStepIdEnum.TWELVE && (
                                <>
                                  <div className='block cursor-pointer'>
                                    <Checkbox
                                      id={`deposit_paid_${subStep.id}`}
                                      checked={
                                        stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)
                                          ?.depositPaid == true
                                      }
                                      onChange={(event) => {
                                        setStatusConfirm(true)
                                        setEvent(event?.target.checked)
                                        setSubStep(subStep)
                                        setColumnName('depositPaid')
                                      }}
                                    />
                                    <label htmlFor={`deposit_paid_${subStep.id}`}> Deposit Paid</label>
                                  </div>
                                  {stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)
                                    ?.depositInvoiceLink &&
                                    stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)
                                      ?.depositInvoiceLink != '' && (
                                      <div className='block cursor-pointer'>
                                        <Checkbox
                                          id={`invoice_paid_${subStep.id}`}
                                          checked={
                                            stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)
                                              ?.invoicePaid == true
                                          }
                                          onChange={(event) => {
                                            setStatusConfirm(true)
                                            setEvent(event?.target.checked)
                                            setSubStep(subStep)
                                            setColumnName('invoicePaid')
                                          }}
                                        />
                                        <label htmlFor={`invoice_paid_${subStep.id}`}> Invoice Paid</label>
                                      </div>
                                    )}
                                </>
                              )}
                              {Boolean(subStep?.canBeDisabled) && (
                                <div className='block cursor-pointer'>
                                  <Checkbox
                                    id={`step_enabled_${subStep.id}`}
                                    checked={
                                      stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)?.stepEnabled ==
                                      true
                                    }
                                    onChange={(event) => {
                                      setStatusConfirm(true)
                                      setEvent(event?.target.checked)
                                      setSubStep(subStep)
                                      setColumnName('stepEnabled')
                                    }}
                                  />
                                  <label htmlFor={`step_enabled_${subStep.id}`}>
                                    {subStep.id == FormStepIdEnum.TEN
                                      ? 'Show Visa Icon'
                                      : subStep.id == FormStepIdEnum.ELEVEN
                                        ? 'Show Insurance Icon'
                                        : subStep.id == FormStepIdEnum.TWELVE
                                          ? 'Show Billing Icon'
                                          : ' Show Icon'}
                                  </label>
                                </div>
                              )}

                              {subStep.id == FormStepIdEnum.TWELVE && (
                                <>
                                  <div
                                    className='block/ cursor-pointer mx-auto mt-3 flex flex-col'
                                    onClick={() => {
                                      if (!canPerformAction()) return
                                      setOpenText(true)
                                    }}
                                  >
                                    <label className='cursor-pointer' htmlFor={`invoice_link_${subStep.id}`}>
                                      Enter Invoice Link
                                    </label>
                                  </div>
                                  <Dialog
                                    open={openText}
                                    onClose={() => {
                                      setOpenText(false)
                                    }}
                                    PaperProps={{
                                      component: 'form',
                                      onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                                        event.preventDefault()
                                        const formData = new FormData(event.currentTarget)
                                        const formJson = Object.fromEntries((formData as any).entries())
                                        const depositInvoiceLink = formJson.depositInvoiceLink
                                        setStatusConfirm(true)
                                        setEvent(undefined)
                                        setSubStep(subStep)
                                        setColumnName('depositInvoiceLink')
                                        setInputValue(depositInvoiceLink)
                                        setOpenText(false)
                                      }
                                    }}
                                  >
                                    <DialogTitle>Invoice Link</DialogTitle>
                                    <DialogContent>
                                      <TextField
                                        autoFocus
                                        required
                                        margin='dense'
                                        id='depositInvoiceLink'
                                        name='depositInvoiceLink'
                                        type='text'
                                        fullWidth
                                        variant='standard'
                                        defaultValue={
                                          stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)
                                            ?.depositInvoiceLink
                                        }
                                      />
                                    </DialogContent>
                                    <DialogActions>
                                      <Button
                                        onClick={() => {
                                          setOpenText(false)
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                      <Button type='submit'>Save</Button>
                                    </DialogActions>
                                  </Dialog>
                                </>
                              )}
                              {subStep.id == FormStepIdEnum.FOURTEEN && (
                                <>
                                  <div className='block cursor-pointer'>
                                    <Checkbox
                                      id={`health_special_needs_requested_${subStep.id}`}
                                      checked={
                                        stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)
                                          ?.healthSpecialNeedsRequested == true
                                      }
                                      onChange={(event) => {
                                        setStatusConfirm(true)
                                        setEvent(event?.target.checked)
                                        setSubStep(subStep)
                                        setColumnName('healthSpecialNeedsRequested')
                                      }}
                                    />
                                    <label htmlFor={`health_special_needs_requested_${subStep.id}`}> Health Special Needs Requested</label>
                                  </div>
                                </>
                              )}
                              {subStep.id == FormStepIdEnum.FIFTEEN && (
                                <>
                                  <div className='block cursor-pointer'>
                                    <Checkbox
                                      id={`needs_no_accommodation_${subStep.id}`}
                                      checked={
                                        stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)
                                          ?.needsNoAccommodation == true
                                      }
                                      onChange={(event) => {
                                        setStatusConfirm(true)
                                        setEvent(event?.target.checked)
                                        setSubStep(subStep)
                                        setColumnName('needsNoAccommodation')
                                      }}
                                    />
                                    <label htmlFor={`needs_no_accommodation_${subStep.id}`}>No Accommodations</label>
                                  </div>
                                  <div className='block cursor-pointer'>
                                    <Checkbox
                                      id={`needs_accommodation_requested_${subStep.id}`}
                                      checked={
                                        stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)
                                          ?.needsAccommodationRequested == true
                                      }
                                      onChange={(event) => {
                                        setStatusConfirm(true)
                                        setEvent(event?.target.checked)
                                        setSubStep(subStep)
                                        setColumnName('needsAccommodationRequested')
                                      }}
                                    />
                                    <label htmlFor={`needs_accommodation_requested_${subStep.id}`}>Accommodations Requested</label>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                          {stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)?.depositInvoiceLink && (
                            <div className='block/ cursor-pointer mx-auto flex flex-col'>
                              <Link
                                to={
                                  /^(https?:\/\/)/.test(
                                    stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)
                                      ?.depositInvoiceLink || ''
                                  )
                                    ? stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)
                                        ?.depositInvoiceLink || ''
                                    : '//' +
                                      stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)
                                        ?.depositInvoiceLink
                                }
                                className='truncate text-ellipsis overflow-hidden max-w-32 text-blue-700 mx-auto'
                                target='_blank'
                              >
                                {stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)
                                  ?.depositInvoiceLink || ''}
                              </Link>
                            </div>
                          )}
                          {(subStep.id == FormStepIdEnum.NINE || subStep.id == FormStepIdEnum.TWELVE) && (
                            <div className='block cursor-pointer mx-auto'>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <ButtonDatePicker
                                  label={
                                    stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)?.dueDate == null
                                      ? null
                                      : dayjs(
                                          stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)?.dueDate
                                        )?.format('MM/DD/YYYY')
                                  }
                                  subStep={subStep}
                                  defaultValue={
                                    stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)?.dueDate == null
                                      ? null
                                      : dayjs(
                                          stepInfo?.studentStepInformation?.find((item) => item?.formSubStepId === subStep?.id)?.dueDate
                                        )
                                  }
                                />
                              </LocalizationProvider>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className='flex items-center flex-wrap gap-1 gap-x-3'>
                    {(data.roles.includes('superadmin') || data.roles.includes('advisor')) &&
                      (index == 3 ? (
                        <button
                          className='btn-primary py-1 px-4 bg-white font-semibold'
                          onClick={() => {
                            if (!canPerformAction()) return
                            setConfirmModalOpen(true)
                            setAction('completeApplication')
                            setActionLabel('Complete Application')
                          }}
                        >
                          Complete Application
                        </button>
                      ) : index == 2 ? (
                        <button
                          className='btn-primary py-1 px-4 bg-white font-semibold'
                          onClick={() => {
                            if (!canPerformAction()) return
                            setConfirmModalOpen(true)
                            setAction('confirmAllFormsCompleted')
                            setActionLabel('Confirm All Forms Completed')
                          }}
                        >
                          Confirm All Forms Completed
                        </button>
                      ) : index == 1 ? (
                        <>
                          <button
                            className='btn-primary py-1 px-4 bg-white font-semibold'
                            onClick={() => {
                              if (!canPerformAction()) return
                              setConfirmModalOpen(true)
                              setAction('confirmEnrollment')
                              setActionLabel('Confirm Enrollment')
                            }}
                          >
                            Confirm Enrollment
                          </button>
                          <button
                            className='btn-primary py-1 px-4 bg-white font-semibold'
                            onClick={() => {
                              if (!canPerformAction()) return
                              setConfirmModalOpen(true)
                              setAction('withdrawApplicant')
                              setActionLabel('Withdraw Applicant')
                            }}
                          >
                            Withdraw Applicant
                          </button>
                          <Link
                            to='#'
                            className='flex items-center gap-2'
                            onClick={() => {
                              getLetter(false, 'visaLetter', 'Generate Italian Visa Letter')
                            }}
                          >
                            <CgFileDocument className='w-6 h-6 mt-1 text-slate-400' />
                            <span>Generate Italian Visa Letter</span>
                          </Link>
                        </>
                      ) : (
                        index == 0 && (
                          <>
                            <button
                              className='btn-primary py-1 px-4 bg-white font-semibold'
                              onClick={() => {
                                if (!canPerformAction()) return
                                setConfirmModalOpen(true)
                                setAction('acceptStudent')
                                setActionLabel('Accept Student')
                              }}
                            >
                              Accept Student
                            </button>
                            <button
                              className='btn-primary py-1 px-4 bg-white font-semibold'
                              onClick={() => {
                                if (!canPerformAction()) return
                                setConfirmModalOpen(true)
                                setAction('conditionallyAccept')
                                setActionLabel('Conditionally Accept')
                              }}
                            >
                              Conditionally Accept
                            </button>
                            <button
                              className='btn-secondary py-1 px-4 bg-white font-semibold'
                              onClick={() => {
                                if (!canPerformAction()) return
                                setConfirmModalOpen(true)
                                setAction('rejectStudent')
                                setActionLabel('Reject Student')
                              }}
                            >
                              Reject Student
                            </button>
                            <Link
                              to='#'
                              className='flex items-center gap-2'
                              onClick={() => {
                                getLetter(false, 'acceptanceLetter', 'Generate Acceptance Letter')
                              }}
                            >
                              <CgFileDocument className='w-6 h-6 mt-1 text-slate-400' />
                              <span>Generate Acceptance Letter</span>
                            </Link>
                          </>
                        )
                      ))}
                    {(data.roles.includes('superadmin') || data.roles.includes('advisor')) && (
                      <>
                        <Link
                          to='#'
                          className='flex gap-2 items-center'
                          onClick={() => {
                            if (!canPerformAction()) return
                            setAction('instructions')
                            setActionLabel('Instruction')
                            setInstructionScreen(false)
                            setFormStep(step)
                            setStepOpenModal(true)
                            setInitialValue(step.instructions)
                          }}
                        >
                          <BsQuestionCircleFill className='w-6 h-6 mt-1 text-slate-400' />
                          <span>Edit Section Instructions</span>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )
            }
            return null
          })}

        {data.roles.includes('superadmin') || data.roles.includes('advisor') ? (
          <div className='grid grid-cols-2 lg:grid-cols-1 pb-3 gap-7'>
            <div className='overflow-hidden max-h-[787px]'>
              <div className='flex items-center flex-wrap gap-2 mb-2'>
                <h4 className='text-xl font-bold'>Note to Student </h4>
                <Link to='#' className='text-secondary'>
                  (visible to student)
                </Link>
              </div>

              <div className='rounded-md bg-white pt-4 mb-3 relative h-full'>
                <TinyEditor
                  initialValue={stepInfo?.studentNote || ''}
                  type={'student_note'}
                  label={'Student Note'}
                  callSubmit={onSaveUserInfo}
                  isView={false}
                  variable={[]}
                  reSize={true}
                  customOptions={{ disabled: !canPerformAction(false) ? 'Action cannot be performed on archived students.' : false }}
                  height={610}
                  classes={{
                    labelBlock: 'px-4',
                    editorBlock: 'px-4 h-[calc(100%-155px)] !static',
                    submitBtnBlock: '!absolute px-4 !m-[unset] bottom-[calc(100%-95%)]'
                  }}
                />
              </div>
            </div>

            <div className='flex flex-col justify-between h-full'>
              <div className='mb-5'>
                <div className='flex items-center mb-2 flex-wrap gap-2 '>
                  <h4 className='text-xl font-bold'> Internal Notes </h4>
                  <Link to='#' className='text-secondary'>
                    (Private admin only)
                  </Link>
                </div>

                <div className='rounded-md bg-white pt-4 h-96 relative'>
                  <TinyEditor
                    initialValue={stepInfo?.advisorNote || ''}
                    type={'advisor_note'}
                    label={'Advisor Note'}
                    callSubmit={onSaveUserInfo}
                    isView={false}
                    variable={[]}
                    reSize={true}
                    customOptions={{ disabled: !canPerformAction(false) ? 'Action cannot be performed on archived students.' : false }}
                    height={245}
                    classes={{
                      labelBlock: 'px-4',
                      editorBlock: 'px-4 h-[calc(100%-115px)] !static',
                      submitBtnBlock: '!absolute px-4'
                    }}
                  />
                </div>
              </div>

              <div>
                <div className='flex items-center mb-4 flex-wrap gap-2'>
                  <h4 className='text-xl font-bold'> Supporting Documents </h4>
                  <span className=' text-secondary'>(upload)</span>
                </div>

                <div className='rounded-md bg-white p-4 h-[19rem] overflow-hidden'>
                  <div className='flex w-full justify-end'>
                    <Button component='label' role={undefined} variant='contained' tabIndex={-1} startIcon={<CloudUploadIcon />}>
                      Upload file
                      <VisuallyHiddenInput
                        type='file'
                        multiple
                        onChange={(event) => handleFileChange(event, stepInfo?.supportingDocuments, 'supporting_documents')}
                        onClick={(e) => {
                          if (!canPerformAction()) e.preventDefault()
                        }}
                      />
                    </Button>
                  </div>
                  <div className='overflow-auto h-4/5 mt-4'>
                    <table className='w-full'>
                      <tbody>
                        {stepInfo?.supportingDocuments?.length === 0 && (
                          <tr>
                            <td colSpan={2}>No documents</td>
                          </tr>
                        )}
                        {stepInfo?.supportingDocuments.map((value) => {
                          return (
                            <tr key={value.id}>
                              <td>
                                <FileUpload fileUrl={value.path} size={43} isViewOnly={true} />
                              </td>
                              <td>
                                <FaTrashAlt
                                  className='text-red-600 size-5 cursor-pointer mx-auto'
                                  onClick={() => {
                                    setActionLabel('Delete Document')
                                    setConfirmModalOpen(true)
                                    setDeleteVal(value)
                                  }}
                                />
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-1 pb-3 gap-7'>
            <div className='mb-3 '>
              <div className='flex items-center flex-wrap gap-2 mb-2'>
                <h4 id='advisor-note' className='text-xl font-bold'>
                  Note from your Admission Advisor
                </h4>
              </div>

              <div className='rounded-md bg-white p-4 mb-3 h-80 text-gray'>
                <iframe
                  className='size-full'
                  srcDoc={
                    stepInfo?.studentNote
                      ? linkify(stepInfo?.studentNote, { target: '_blank' }) +
                        "<style> body{font-family:'Helvetica Neue',sans-serif;}</style>"
                      : '<h3 style="color: rgb(31, 41, 55); font-size: 20px;">No Note Found</h3>'
                  }
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>

      {openModal && (
        <StepDetails
          setOpenModal={setOpenModal}
          formSubStep={formSubStep}
          disabled={!canPerformAction(false)}
          disabledCallback={(notify) => canPerformAction(notify)}
          saveInfoCallback={(status: { step1Status: string; step2Status: string; step3Status: string; step4Status: string }) => {
            if (stepInfo) {
              setStepInfo({
                ...stepInfo,
                step1Status: status?.step1Status,
                step2Status: status?.step2Status,
                step3Status: status?.step3Status,
                step4Status: status?.step4Status
              })
            }
          }}
          isViewOnly={isViewOnly}
          init={init}
        />
      )}

      {openStepModal && (
        <Step
          setOpenModal={(val) => {
            setStepOpenModal(val)
            if (!val) setSavedLetterLink('')
          }}
          formSubStep={formStep}
          isView={instructionScreen}
          type={action}
          label={actionLabel}
          initialValue={initialValue}
          callSave={saveLatter}
          additionalInfo={{
            savedLetterLink: savedLetterLink
          }}
          sendLetter={() => {
            return new Promise(() => {
              setConfirmModalOpen(true)
              setActionLabel('Send Letter')
            })
          }}
        />
      )}

      <div>
        <ConfirmationAlert
          title={'Are you sure you perform this action ?'}
          isConfirmModalOpen={isConfirmModalOpen}
          setConfirmModalOpen={setConfirmModalOpen}
          ButtonText={'Yes I am sure'}
          actionName={actionLabel}
          onAction={() => {
            if (actionLabel == 'Delete Document') {
              handleDelete()
            } else if (actionLabel == 'Send Letter') {
              sendStudentLetter(action)
            } else {
              performAction()
            }
          }}
        />
      </div>

      <ConfirmationAlert
        title={'Are you sure you perform this action ?'}
        isConfirmModalOpen={statusConfirm}
        setConfirmModalOpen={setStatusConfirm}
        ButtonText={'Yes I am sure'}
        onAction={() => handleCheckboxChange()}
      />
    </>
  )
}
