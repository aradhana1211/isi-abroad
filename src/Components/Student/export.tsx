import { Select, MenuItem, InputLabel, FormControl, SelectChangeEvent, Tooltip } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { toast } from 'Components/Toast/toast'
import { studentContext } from './context'

type ExportProps = {
  callback?: (format: string) => void | Promise<any>
}

export default function Export({ callback = () => {} }: ExportProps) {
  const [exportFormat, setExportFormat] = useState<string>('')
  const [openTooltip, setOpenTooltip] = useState<boolean>(false)
  const { state } = useContext(studentContext)
  const { students } = state
  const [disabled, setDisabled] = useState<boolean>(false)

  useEffect(() => {
    setDisabled(Boolean(students?.data?.length === 0))
  }, [students])

  async function handleChange(event: SelectChangeEvent) {
    const format = event.target.value as string
    setExportFormat(format)

    if (typeof callback === 'function') {
      const rsp = await callback(format)
      setExportFormat('')
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement?.blur()
      }
      if (rsp?.success) {
        toast(rsp?.message, 'success')
        return
      }
      toast(rsp?.message ?? 'Something went wrong, please try again later.', 'error')
    }
  }

  return (
    <div id='export-parent' className={`${disabled ? 'opacity-50' : ''}`}>
      <FormControl sx={{ m: 1, minWidth: 225 }} className='!min-w-28/'>
        <InputLabel id='student-export-action-select-label'>Export All Filtered Data</InputLabel>
        <Tooltip
          open={openTooltip}
          disableFocusListener
          title={
            disabled
              ? 'No students found with selected filters.'
              : 'Selected field will be exported only and total filtered data will be exported.'
          }
          classes={{ popper: '[&_div]:text-base' }}
          placement='top'
          arrow
        >
          <Select
            id='student-export-action-select'
            labelId='student-export-action-select-label'
            label='Export All Filtered Data'
            className=''
            value={exportFormat}
            onChange={handleChange}
            onOpen={() => setOpenTooltip(false)}
            onMouseEnter={() => setOpenTooltip(true)}
            onMouseLeave={() => setOpenTooltip(false)}
          >
            <MenuItem value={'csv'} disabled={disabled}>
              CSV
            </MenuItem>
            <MenuItem value={'excel'} disabled={disabled}>
              Excel
            </MenuItem>
            <MenuItem value={'pdf'} disabled={disabled}>
              PDF
            </MenuItem>
          </Select>
        </Tooltip>
      </FormControl>
    </div>
  )
}
