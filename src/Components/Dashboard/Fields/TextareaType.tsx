import { useContext } from 'react'
import Label from '../Label'
import { DetailPropsType } from '../type'
import { subStepContext } from '../context'
import { Controller } from 'react-hook-form'

function TextareaType({ item, control, isRenderConditionalComponent, isViewOnly }: DetailPropsType) {
  const {
    state: { currentPage }
  } = useContext(subStepContext)

  if ((item?.conditionalLogic && isRenderConditionalComponent === false) || currentPage !== item?.pageNumber) return null

  return (
    <div className='mt-2'>
      <div className='flex justify-start'>
        <Label structure={item} />

        <div className='flex justify-start w-[70%] gap-x-1'>
          <Controller
            control={control}
            name={item?.inputName?.toLowerCase()}
            rules={isViewOnly ? {} : { required: { value: item?.isRequired, message: 'This field is required.' } }}
            render={({ field: { ref, value, onChange }, fieldState: { error } }) => {
              return (
                <div className='w-full'>
                  <textarea className='form-input' ref={ref} value={value} onChange={onChange} rows={5} disabled={isViewOnly} />
                  {error && <p className='text-left text-red-500 text-sm'>{error?.message}</p>}
                </div>
              )
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default TextareaType
