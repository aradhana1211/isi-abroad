import { useContext, useEffect, useState } from 'react'
import http from 'CommonJS/http'
import ImageSelector from 'Components/ImageSelector'
import Loading from 'Components/Loading'
import { AppContext } from 'Context/AppContext'
import { AppContextType } from 'Context/AppTypes'
import { toast } from 'Components/Toast/toast'

export default function Institute() {
  const [loading, setLoading] = useState(false)
  const { institutes, sessions, programs, uploadFile, getInstitute, getPrograms, getSession } = useContext(AppContext) as AppContextType

  useEffect(() => {
    const init = async () => {
      if (institutes?.length === 0) getInstitute()
      if (programs?.length === 0) getPrograms()
      if (sessions?.length === 0) getSession()
    }
    init()
  }, [])

  const changeFileState = async (file: File, instituteId: number | string) => {
    try {
      await setLoading(true)
      const fileRes = await uploadFile(file)
      if (fileRes) {
        const payload = {
          image_path: fileRes?.document?.id
        }
        await http
          .fetch({ method: 'put', path: `setting/institute/${instituteId}`, data: payload })
          .catch((error) => {
            toast(error?.response?.data?.message, 'error')
            setLoading(false)
          })
          .then((response) => {
            if (response && response.status === 200) {
              getInstitute()
              toast(response?.data?.message, 'success')
            }
            setLoading(false)
          })
      }

      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <>
      <div className='flex w-full min-h-screen md:flex-wrap md:min-h-[auto]'>
        {loading && <Loading />}
        <div className='w-full py-6 md:px-0'>
          <div className='flex justify-between items-center min-h-12 mb-7 md:mb-5'>
            <h1 className='text-3xl font-bold uppercase md:text-2xl'>Institutes</h1>
          </div>

          <div className='w-1/2 gap-y-4 flex flex-col md:w-full'>
            <table className='table-auto'>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {institutes?.map((institute, index) => (
                  <tr key={index}>
                    <td>{institute?.id}</td>
                    <td>{institute?.name}</td>
                    <td>
                      <ImageSelector
                        size={'60px'}
                        imageSrc={institute?.imagePath}
                        changeFileState={changeFileState}
                        id={institute.id}
                        key={`${institute.id}-${institute.imagePath}`}
                      />
                    </td>
                  </tr>
                ))}
                {institutes?.length === 0 && (
                  <tr>
                    <td colSpan={3} className='text-center'>
                      No Institutes Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className='flex justify-between items-center min-h-12 mb-7 md:mb-5  mt-5'>
            <h1 className='text-3xl font-bold uppercase md:text-2xl'>Sessions</h1>
          </div>
          <div className='w-1/2 gap-y-4 flex flex-col md:w-full'>
            <table className='table-auto md:w-full'>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {sessions?.map((session, index) => (
                  <tr key={index}>
                    <td>{session?.id}</td>
                    <td>{session?.name}</td>
                  </tr>
                ))}
                {sessions?.length === 0 && (
                  <tr>
                    <td colSpan={2} className='text-center'>
                      No Sessions Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className='flex justify-between items-center min-h-12 mb-7 md:mb-5 mt-5'>
            <h1 className='text-3xl font-bold uppercase md:text-2xl'>programs </h1>
          </div>
          <div className='w-1/2 gap-y-4 flex flex-col md:w-full'>
            <table className='table-auto'>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {programs?.map((program, index) => (
                  <tr key={index}>
                    <td>{program?.id}</td>
                    <td>{program?.name}</td>
                  </tr>
                ))}
                {programs?.length === 0 && (
                  <tr>
                    <td colSpan={2} className='text-center'>
                      No Programs Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
