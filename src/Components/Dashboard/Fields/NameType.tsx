import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { DetailPropsType } from '../type'
import Label from '../Label'
import { useContext } from 'react'
import { subStepContext } from '../context'
import { Controller } from 'react-hook-form'

function NameType({ item, control, isRenderConditionalComponent, isViewOnly }: DetailPropsType) {
  const {
    state: { currentPage }
  } = useContext(subStepContext)

  if ((item?.conditionalLogic && isRenderConditionalComponent === false) || currentPage !== item?.pageNumber) return null

  return (
    <div className='mt-2'>
      <div className='flex justify-start'>
        <Label structure={item} />

        <div className='flex justify-start w-[70%] gap-x-1'>
          {item.inputs?.map((fields: any, index: number) => {
            if (fields?.isHidden) return null
            else {
              return (
                <div key={index} className='mb-6 md:mb-3 w-[-webkit-fill-available]'>
                  <label className='block uppercase tracking-wide text-gray-500 text-sm mb-2' htmlFor='grid-first-name'>
                    {fields.label}
                  </label>
                  {fields?.inputType === 'radio' ? (
                    <RadioGroup aria-labelledby='demo-radio-buttons-group-label' defaultValue='female' name='radio-buttons-group'>
                      {fields?.choices?.map((choice: any, key: number) => (
                        <FormControlLabel key={key} value={choice.value} control={<Radio />} label={choice.text} />
                      ))}
                    </RadioGroup>
                  ) : (
                    <div>
                      <Controller
                        control={control}
                        name={fields?.name?.toLowerCase()}
                        rules={isViewOnly ? {} : { required: { value: item?.isRequired, message: 'This field is required.' } }}
                        render={({ field: { ref, value, onChange }, fieldState: { error } }) => {
                          return (
                            <div>
                              <input
                                ref={ref}
                                value={value ?? ''}
                                onChange={onChange}
                                className='form-input'
                                type='text'
                                disabled={isViewOnly}
                              />
                              {error && <p className='text-left text-red-500 text-sm'>{error?.message}</p>}
                            </div>
                          )
                        }}
                      />
                    </div>
                  )}
                </div>
              )
            }
          })}
        </div>
      </div>
    </div>
  )
}

export default NameType
