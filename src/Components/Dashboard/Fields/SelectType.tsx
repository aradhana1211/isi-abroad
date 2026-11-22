import Label from '../Label'
import { DetailPropsType } from '../type'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { Controller } from 'react-hook-form'
import { useContext } from 'react'
import { subStepContext } from '../context'

function SelectType({ item, control, isRenderConditionalComponent, isViewOnly }: DetailPropsType) {
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
            name={item.inputName?.toLowerCase()}
            rules={isViewOnly ? {} : { required: { value: item?.isRequired, message: 'This field is required.' } }}
            render={({ field: { ref, value, onChange }, fieldState: { error } }) => {
              return (
                <div className='w-full'>
                  <Select className='w-2/4' value={value ?? ' '} onChange={onChange} ref={ref} disabled={isViewOnly}>
                    <MenuItem value={' '} disabled>
                      {`Select ${item?.label}`}
                    </MenuItem>
                    {item?.choices?.map((choice: any, index: number) => (
                      <MenuItem key={index} value={choice.value}>
                        {choice.text}
                      </MenuItem>
                    ))}
                  </Select>
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

export default SelectType
