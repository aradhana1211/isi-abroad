import { FormControlLabel, FormGroup } from '@mui/material'
import { DetailPropsType } from '../type'
import Checkbox from '@mui/material/Checkbox'
import Label from '../Label'
import Description from '../Description'
import { Controller } from 'react-hook-form'
import { ChangeEvent, useContext } from 'react'
import { subStepContext } from '../context'

function CheckboxType({ item, control, isRenderConditionalComponent, watch, setValue, isViewOnly }: DetailPropsType) {
  const {
    state: { currentPage }
  } = useContext(subStepContext)

  if ((item?.conditionalLogic && isRenderConditionalComponent === false) || currentPage !== item?.pageNumber) return null

  let defaultData: string[] = []

  if (watch(item?.inputName?.toLowerCase())) {
    try {
      defaultData = Array.isArray(watch(item?.inputName?.toLowerCase()))
        ? watch(item?.inputName?.toLowerCase())
        : JSON.parse(watch(item?.inputName?.toLowerCase()))
    } catch (error: any) {
      if (error.message.includes('is not valid JSON')) {
        defaultData = [watch(item?.inputName?.toLowerCase())]
      }
    }
  }

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const value = await e.target.value
    if (defaultData?.includes(value))
      setValue(
        item?.inputName?.toLowerCase(),
        defaultData?.filter((i: string) => i !== value)
      )
    else setValue(item?.inputName?.toLowerCase(), [...defaultData, value])
  }

  return (
    <div className='mt-2'>
      <div className='flex justify-start'>
        <Label structure={item} />

        <div className='grid w-[70%]'>
          <Controller
            name={item?.inputName?.toLowerCase()}
            control={control}
            rules={isViewOnly ? {} : { required: { value: item?.isRequired, message: 'This field is required.' } }}
            render={({ field: { ref }, fieldState: { error } }) => {
              return (
                <div className='contents'>
                  <FormGroup>
                    {item?.choices?.map((choice: any, index: number) => {
                      return (
                        <FormControlLabel
                          ref={ref}
                          key={index}
                          label={choice.text}
                          value={choice?.value}
                          disabled={isViewOnly}
                          control={
                            <Checkbox
                              onChange={(e) => handleChange(e)}
                              checked={defaultData?.length > 0 ? defaultData?.includes(choice?.value) : false}
                            />
                          }
                        />
                      )
                    })}
                  </FormGroup>
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

export default CheckboxType
