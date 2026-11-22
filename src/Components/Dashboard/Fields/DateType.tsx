import { DetailPropsType } from '../type'
import Label from '../Label'
import { Controller } from 'react-hook-form'
import { useContext } from 'react'
import { subStepContext } from '../context'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'

function DateType({ item, control, isRenderConditionalComponent, isViewOnly }: DetailPropsType) {
  const {
    state: { currentPage }
  } = useContext(subStepContext)

  if ((item?.conditionalLogic && isRenderConditionalComponent === false) || currentPage !== item?.pageNumber) return null

  return (
    <div className='mt-2'>
      <div className='flex justify-start'>
        <Label structure={item} />

        <Controller
          control={control}
          name={item?.inputName?.toLowerCase()}
          rules={isViewOnly ? {} : { required: { value: item?.isRequired, message: 'This field is required.' } }}
          render={({ field: { ref, value, onChange }, fieldState: { error } }) => {
            return (
              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker ref={ref} value={value ? dayjs(value) : null} onChange={onChange} disabled={isViewOnly} />
                  </DemoContainer>
                </LocalizationProvider>
                {error && <p className='text-left text-red-500 text-sm'>{error?.message}</p>}
              </div>
            )
          }}
        />
      </div>
    </div>
  )
}

export default DateType
