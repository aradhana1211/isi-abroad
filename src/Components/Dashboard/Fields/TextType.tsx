import { useContext } from 'react'
import Description from '../Description'
import Label from '../Label'
import { DetailPropsType } from '../type'
import { subStepContext } from '../context'
import { Controller } from 'react-hook-form'

function TextType({ item, control, isRenderConditionalComponent, isViewOnly }: DetailPropsType) {
  const {
    state: { currentPage }
  } = useContext(subStepContext)

  if ((item?.conditionalLogic && isRenderConditionalComponent === false) || currentPage !== item?.pageNumber) return null

  return (
    <div className='mt-2'>
      <div className='flex justify-start'>
        <Label structure={item} />
        <div className='gap-1 w-[70%] mb-6 md:mb-3'>
          <Controller
            control={control}
            name={item?.inputName?.toLowerCase()}
            rules={isViewOnly ? {} : { required: { value: item?.isRequired, message: 'This field is required.' } }}
            render={({ field: { ref, value, onChange }, fieldState: { error } }) => {
              return (
                <div>
                  <input
                    className='form-input'
                    type={item?.inputType}
                    ref={ref}
                    onChange={onChange}
                    value={value ?? ''}
                    disabled={isViewOnly}
                  />
                  {error && <p className='text-left text-red-500 text-sm'>{error?.message}</p>}
                </div>
              )
            }}
          />
          <Description structure={item} />
        </div>
      </div>
    </div>
  )
}

export default TextType
