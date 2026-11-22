import http from 'CommonJS/http'
import React, { useContext, useEffect, useState } from 'react'
import { MdClose } from 'react-icons/md'
import { ActionType, FormSubStep } from './type'
import HtmlType from './Fields/HtmlType'
import PageType from './Fields/PageType'
import Sectiontype from './Fields/Sectiontype'
import NameType from './Fields/NameType'
import PhoneType from './Fields/PhoneType'
import CheckboxType from './Fields/CheckboxType'
import DateType from './Fields/DateType'
import RadioType from './Fields/RadioType'
import AddressType from './Fields/AddressType'
import FileUploadType from './Fields/FileUploadType'
import TextType from './Fields/TextType'
import EmailType from './Fields/EmailType'
import SelectType from './Fields/SelectType'
import TextareaType from './Fields/TextareaType'
import Loading from 'Components/Loading'
import { useForm } from 'react-hook-form'
import { subStepContext } from './context'
import { useLocation, useParams } from 'react-router-dom'
import { UserContext } from 'Context/UserContext'
import { toast } from 'Components/Toast/toast'

interface Props {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  formSubStep: FormSubStep | null
  disabled?: boolean
  disabledCallback?: (notify?: boolean) => boolean
  saveInfoCallback?: (status: { step1Status: string; step2Status: string; step3Status: string; step4Status: string }) => void
  isViewOnly?: boolean
  init: any
}

function StepDetails({
  setOpenModal,
  formSubStep,
  disabled = false,
  disabledCallback = () => true,
  saveInfoCallback,
  isViewOnly,
  init
}: Props) {
  const [loading, setLoading] = useState<boolean>(true)
  const [formLoading, setFormLoading] = useState<boolean>(false)
  const { state, dispatch } = useContext(subStepContext)
  const { gravityForm, subFormFields, subStepForm, stepFormMeta } = state
  const match = useLocation()
  const { id } = useParams()
  const { data } = useContext(UserContext)

  const { handleSubmit, register, watch, control, setValue, reset, getValues } = useForm({ defaultValues: stepFormMeta })

  let studentId: any
  if (match.pathname.includes('student-dashboard')) {
    studentId = id
  } else {
    studentId = data?.student?.id
  }

  useEffect(() => {
    getFormSubSteps()
  }, [])

  async function getFormSubSteps() {
    await setLoading(true)
    await http
      .fetch({ path: `student/formSubSteps/${formSubStep?.id}` })
      .then(async (res) => {
        if (res.data.success && res.status === 200) {
          await dispatch({ type: ActionType.SET_SUBSTEP_FORM, payload: res.data?.data })
          await setTimeout(() => {
            setLoading(false)
          }, 300)
        }
      })
      .catch(() => {
        setLoading(false)
      })
  }

  async function submitForm(data: any, event: any) {
    if (disabled && !disabledCallback(true)) {
      event?.preventDefault()
      return
    }
    try {
      await setFormLoading(true)
      const response = await http.fetch({ method: 'post', path: `saveStepFrom/${studentId}/${subStepForm.id}`, data: data })
      if (response.data.success) {
        await reset()
        await getSubStepFormMeta()
        await toast(response.data.message, 'success')
        await setOpenModal(false)
        saveInfoCallback?.(response.data.stepStatus)
        await init()
      }
      await setFormLoading(false)
    } catch (error) {
      toast('something went wrong please try again', 'error')
      setFormLoading(false)
    }
  }

  async function onNext() {
    dispatch({ type: ActionType.NEXT_PAGE })
  }

  async function onPrevious() {
    dispatch({ type: ActionType.PREVIOUS_PAGE })
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

  if (loading) return <Loading />

  if (subStepForm?.isGravityForm) {
    return (
      <div className='w-full h-full fixed justify-center items-center bg-black/50  inset-x-0 inset-y-0 border z-[190] p-10'>
        {formLoading && <Loading />}
        <div className='bg-white w-full h-full rounded-md p-5 relative overflow-hidden'>
          {/* header start */}
          <div className='flex justify-between items-center'>
            <h1 className=' font-semibold text-2xl'>{gravityForm?.title}</h1>
            <MdClose
              className='cursor-pointer'
              size={28}
              onClick={() => {
                dispatch({ type: ActionType.SET_SUBSTEP_FORM, payload: null })
                setOpenModal(false)
              }}
            />
          </div>

          <form className='h-full' onSubmit={handleSubmit(submitForm)}>
            {/* field listing */}
            <div className='mt-2 w-full h-[calc(100%-99px)] p-2 overflow-auto [&_a]:underline [&_a]:underline-offset-4'>
              {subFormFields?.map((item: any, index: number) => {
                let isRenderConditionalComponent = false
                if (item?.conditionalLogic) {
                  const conditions: Array<boolean> = []
                  for (let i = 0; i < item?.conditionalLogic?.rules?.length; i++) {
                    const rule = item?.conditionalLogic?.rules[i]
                    const parentStep = subFormFields?.find((data: { id: any }) => data?.id == rule?.fieldId)

                    if (rule?.operator === 'is') conditions.push(watch(parentStep?.inputName?.toLowerCase(), '') === rule?.value)
                    else if (rule?.operator === 'isnot') conditions.push(watch(parentStep?.inputName?.toLowerCase(), '') !== rule?.value)
                    else if (rule?.operator === '>') conditions.push(watch(parentStep?.inputName?.toLowerCase(), '') > rule?.value)
                    else if (rule?.operator === '<') conditions.push(watch(parentStep?.inputName?.toLowerCase(), '') < rule?.value)
                    else if (rule?.operator === 'contains')
                      conditions.push(watch(parentStep?.inputName?.toLowerCase(), '')?.includes(rule?.value))
                    else if (rule?.operator === 'starts_with')
                      conditions.push(watch(parentStep?.inputName?.toLowerCase(), '')?.startsWith(rule?.value))
                    else if (rule?.operator === 'ends_with')
                      conditions.push(watch(parentStep?.inputName?.toLowerCase(), '')?.endsWith(rule?.value))
                  }
                  if (conditions?.length === 1) isRenderConditionalComponent = conditions[0]
                  else if (item?.conditionalLogic?.logicType === 'all') {
                    isRenderConditionalComponent = conditions?.includes(false) ? false : true
                  } else if (item?.conditionalLogic?.logicType === 'any') {
                    isRenderConditionalComponent = conditions?.includes(true)
                  }
                }
                return (
                  <div key={index} className='mt-5'>
                    {item?.type === 'html' && (
                      <HtmlType item={item} register={register} isRenderConditionalComponent={isRenderConditionalComponent} />
                    )}
                    {item?.type === 'page' && (
                      <PageType
                        item={item}
                        isRenderConditionalComponent={isRenderConditionalComponent}
                        onNext={handleSubmit(onNext)}
                        onPrevious={() => onPrevious()}
                        isViewOnly={isViewOnly}
                        setOpenModal={setOpenModal}
                      />
                    )}
                    {item?.type === 'section' && <Sectiontype item={item} isRenderConditionalComponent={isRenderConditionalComponent} />}
                    {item?.type === 'name' && (
                      <NameType
                        item={item}
                        control={control}
                        isRenderConditionalComponent={isRenderConditionalComponent}
                        isViewOnly={isViewOnly}
                      />
                    )}
                    {item?.type === 'phone' && (
                      <PhoneType
                        item={item}
                        control={control}
                        isRenderConditionalComponent={isRenderConditionalComponent}
                        isViewOnly={isViewOnly}
                      />
                    )}
                    {item?.type === 'checkbox' && (
                      <CheckboxType
                        item={item}
                        register={register}
                        control={control}
                        isRenderConditionalComponent={isRenderConditionalComponent}
                        watch={watch}
                        setValue={setValue}
                        isViewOnly={isViewOnly}
                      />
                    )}
                    {item?.type === 'date' && (
                      <DateType
                        item={item}
                        control={control}
                        isRenderConditionalComponent={isRenderConditionalComponent}
                        isViewOnly={isViewOnly}
                      />
                    )}
                    {item?.type === 'radio' && (
                      <RadioType
                        item={item}
                        control={control}
                        isRenderConditionalComponent={isRenderConditionalComponent}
                        isViewOnly={isViewOnly}
                      />
                    )}
                    {item?.type === 'address' && (
                      <AddressType
                        item={item}
                        control={control}
                        isRenderConditionalComponent={isRenderConditionalComponent}
                        isViewOnly={isViewOnly}
                      />
                    )}
                    {item?.type === 'fileupload' && (
                      <FileUploadType
                        item={item}
                        control={control}
                        isRenderConditionalComponent={isRenderConditionalComponent}
                        setValue={setValue}
                        studentId={studentId}
                        isViewOnly={isViewOnly}
                      />
                    )}
                    {item?.type === 'text' && (
                      <TextType
                        item={item}
                        control={control}
                        isRenderConditionalComponent={isRenderConditionalComponent}
                        isViewOnly={isViewOnly}
                      />
                    )}
                    {item?.type === 'email' && (
                      <EmailType
                        item={item}
                        isRenderConditionalComponent={isRenderConditionalComponent}
                        watch={watch}
                        control={control}
                        isViewOnly={isViewOnly}
                      />
                    )}
                    {item?.type === 'select' && (
                      <SelectType
                        item={item}
                        control={control}
                        isRenderConditionalComponent={isRenderConditionalComponent}
                        isViewOnly={isViewOnly}
                      />
                    )}
                    {item?.type === 'textarea' && (
                      <TextareaType
                        item={item}
                        control={control}
                        isRenderConditionalComponent={isRenderConditionalComponent}
                        isViewOnly={isViewOnly}
                      />
                    )}
                  </div>
                )
              })}
            </div>

            {/* submit button */}
            {gravityForm?.pagination === null && (
              <div className='flex justify-center bg-white border-t py-4 absolute inset-x-0 bottom-0'>
                {isViewOnly ? (
                  <button className='btn-secondary' type='reset' onClick={() => setOpenModal(false)}>
                    Close
                  </button>
                ) : (
                  <button className='btn-secondary' type='submit'>
                    {gravityForm?.button?.text ? gravityForm?.button?.text : 'Submit'}
                  </button>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full h-full fixed justify-center items-center bg-black/50  inset-x-0 inset-y-0 border z-[190] p-10 flex'>
      {subStepForm && (
        <div className='bg-white w-[60vw] h-[fit-content] rounded-md p-5 relative overflow-hidden'>
          {formLoading && <Loading />}
          <form className='h-full' onSubmit={handleSubmit(submitForm)}>
            <label className='uppercase tracking-wide text-gray-500 text-sm mb-2' htmlFor='grid-first-name'>
              {subStepForm?.label}
            </label>
            {data?.roles.includes('student') ? (
              <>
                <a
                  href={
                    getValues(subStepForm?.key)
                      ? /^(https?:\/\/)/.test(getValues(subStepForm?.key))
                        ? getValues(subStepForm?.key)
                        : '//' + getValues(subStepForm?.key)
                      : ''
                  }
                  target='_blank'
                  rel='noreferrer'
                  className={`block w-full text-blue-600 mt-4 ${!getValues(subStepForm?.key) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  onClick={(e) => !getValues(subStepForm?.key) && e.preventDefault()}
                >
                  {getValues(subStepForm?.key) ?? 'No Link Found'}
                </a>
              </>
            ) : (
              <input className='form-input' disabled={disabled} type='text' {...register(subStepForm?.key)} required={true} />
            )}
            <div className=' flex justify-center items-center gap-6'>
              <button className='btn-primary mt-5' onClick={() => setOpenModal(false)}>
                {data?.roles.includes('student') ? 'Close' : 'Cancel'}
              </button>
              {!data?.roles.includes('student') && (
                <button className='btn-secondary mt-5' type='submit'>
                  {gravityForm?.button?.text ? gravityForm?.button?.text : 'Submit'}
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default StepDetails
