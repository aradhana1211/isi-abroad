import { useContext } from 'react'
import Description from '../Description'
import Label from '../Label'
import { DetailPropsType } from '../type'
import { subStepContext } from '../context'
import { Controller } from 'react-hook-form'

function AddressType({ item, control, isRenderConditionalComponent, isViewOnly }: DetailPropsType) {
  const {
    state: { currentPage }
  } = useContext(subStepContext)

  if ((item?.conditionalLogic && isRenderConditionalComponent === false) || currentPage !== item?.pageNumber) return null

  return (
    <div className='mt-2'>
      <div className='flex justify-start'>
        <Label structure={item} />

        <div className='flex justify-start w-[70%] gap-x-1'>
          <div className='grid grid-cols-3 gap-2	w-[-webkit-fill-available]'>
            {item.inputs?.map((fields: any, index: number) => {
              if (fields?.isHidden) return null
              else {
                return (
                  <div key={index} className='mb-6 md:mb-3'>
                    <label className='block uppercase tracking-wide text-gray-500 text-sm mb-2' htmlFor='grid-first-name'>
                      {fields.label}
                    </label>
                    <Controller
                      control={control}
                      name={fields?.name?.toLowerCase()}
                      rules={isViewOnly ? {} : { required: { value: item?.isRequired, message: 'This field is required.' } }}
                      render={({ field: { ref, value, onChange }, fieldState: { error } }) => {
                        return (
                          <div>
                            <input
                              className='form-input'
                              type='text'
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
                  </div>
                )
              }
            })}
          </div>
          <Description structure={item} />
        </div>
      </div>
    </div>
  )
}

export default AddressType
