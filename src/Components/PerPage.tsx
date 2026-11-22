import { useState } from 'react'
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'

interface PerPageProps {
  defaultValue?: string
  onChange?: (value: number) => void
}

export function PerPage({ defaultValue = '10', onChange }: PerPageProps) {
  const [value, setValue] = useState<string>(defaultValue)

  const handleChange = (event: SelectChangeEvent) => {
    const val = event.target.value
    setValue(val)
    if (typeof onChange === 'function') {
      onChange(Number(event.target.value))
    }
  }

  return (
    <div className='max-w-52 min-w-28 py-4'>
      <FormControl fullWidth>
        <InputLabel id='items-per-page-select-label'>Items Per page</InputLabel>
        <Select
          labelId='items-per-page-select-label'
          id='items-per-page-select'
          value={value}
          label='Items Per page'
          onChange={handleChange}
        >
          <MenuItem value='10'>10</MenuItem>
          <MenuItem value='20'>20</MenuItem>
          <MenuItem value='50'>50</MenuItem>
          <MenuItem value='100'>100</MenuItem>
        </Select>
      </FormControl>
    </div>
  )
}
