import { Close } from '@mui/icons-material'
import { closeSnackbar, enqueueSnackbar } from 'notistack'

type BaseVariant = 'default' | 'error' | 'success' | 'warning' | 'info'

export const toast = (message: string, variant: BaseVariant, options?: object) => {
  const uniqueKey = Math.random().toString(30)
  enqueueSnackbar(message, {
    key: uniqueKey,
    variant: variant,
    ...options,
    action: () => (
      <div className='cursor-pointer' onClick={() => closeSnackbar(uniqueKey)}>
        <Close />
      </div>
    )
  })
}
