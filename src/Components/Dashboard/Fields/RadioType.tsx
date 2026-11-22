import Label from '../Label'
import { DetailPropsType } from '../type'
import Description from '../Description'
import { useContext } from 'react'
import { subStepContext } from '../context'
import { Controller } from 'react-hook-form'
import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { linkify } from 'CommonJS/common'

function RadioType({ item, control, isRenderConditionalComponent, isViewOnly }: DetailPropsType) {
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
                  <RadioGroup ref={ref}>
                    {item?.choices?.map((choice: any, key: number) => {
                      return (
                        <FormControlLabel
                          key={key}
                          value={choice?.value}
                          control={<Radio checked={value === choice?.value ? true : false} onChange={onChange} />}
                          label={<div dangerouslySetInnerHTML={{ __html: linkify(choice.text) }}></div>}
                          disabled={isViewOnly}
                        />
                      )
                    })}
                    {error && <p className='text-left text-red-500 text-sm'>{error?.message}</p>}
                  </RadioGroup>
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

export default RadioType
