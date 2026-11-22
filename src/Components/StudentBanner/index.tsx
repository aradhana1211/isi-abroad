import http from 'CommonJS/http'
import React, { useEffect, useState } from 'react'
import SnackbarContent from '@mui/material/SnackbarContent'
import { toast } from 'Components/Toast/toast'

export default function StudentBanner() {
  interface DataType {
    id: number
    bannerText: string
  }
  const [banners, setBanners] = useState<DataType[]>()
  useEffect(() => {
    http
      .fetch({ path: 'student/banners' })
      .catch(() => {
        toast('Internal server error.', 'error')
      })
      .then((response) => {
        if (response && response.status === 200) {
          setBanners(response.data.banners)
        }
      })
  }, [])
  return (
    <div className='mb-4'>
      {banners &&
        banners.map(
          (banner, index) =>
            banner.bannerText && (
              <React.Fragment key={index}>
                <SnackbarContent message={'Notice : ' + banner.bannerText} className='mt-2' />
              </React.Fragment>
            )
        )}
    </div>
  )
}
