import Label from '../Label'
import { DetailPropsType } from '../type'
import { useContext, useEffect, useState } from 'react'
import { subStepContext } from '../context'
import { Controller } from 'react-hook-form'
import { AppContext } from 'Context/AppContext'
import { AppContextType } from 'Context/AppTypes'
import FileUpload from 'Components/FileUpload'

function FileUploadType({ item, control, isRenderConditionalComponent, setValue, studentId, isViewOnly }: DetailPropsType) {
  const {
    state: { currentPage }
  } = useContext(subStepContext)
  const { uploadFile } = useContext(AppContext) as AppContextType
  const [isLoading, setLoading] = useState<boolean>(false)
  const [acceptedTypes, setAcceptedTypes] = useState<string[]>([])

  useEffect(() => {
    setAcceptedExtension()
  }, [item])

  async function setAcceptedExtension() {
    const extensions: string[] = await item?.allowedExtensions?.split(', ')
    const types = await extensions
      ?.map((i) => {
        return getMimeType(i)
      })
      .filter((n) => n)
    await setAcceptedTypes(types)
  }

  function getMimeType(extension: string) {
    if (extension === 'txt') return `text/plain`
    else if (
      extension === 'png' ||
      extension === 'jpeg' ||
      extension === 'jpg' ||
      extension === 'heic' ||
      extension === 'heif' ||
      extension === 'bmp'
    )
      return `image/${extension}`
    else if (extension === 'html' || extension === 'css' || extension === 'csv') return `text/${extension}`
    else if (extension === 'js') return `text/javascript`
    else if (extension === 'json' || extension === 'xml' || extension === 'pdf' || extension === 'zip') return `application/${extension}`
    else if (extension === 'doc') return `application/msword`
    else if (extension === 'docx') return `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
    else if (extension === 'xls') return `application/vnd.ms-excel`
    else if (extension === 'xlsx') return `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
    else if (extension === 'ppt') return `application/vnd.ms-powerpoint`
    else if (extension === 'pptx') return `application/vnd.openxmlformats-officedocument.presentationml.presentation`
    else if (extension === 'tar') return `application/x-tar`
    else if (extension === 'gz') return `application/gzip`
    return ''
  }

  const changeFileState = async (f: File) => {
    try {
      await setLoading(true)
      const res = await uploadFile(f, studentId)
      if (res) await setValue(item?.adminLabel.toLowerCase(), res?.document?.fullPath)
      await setLoading(false)
    } catch (error) {
      setValue(item?.adminLabel.toLowerCase(), '')
      setLoading(false)
    }
  }

  if ((item?.conditionalLogic && isRenderConditionalComponent === false) || currentPage !== item?.pageNumber) return null

  return (
    <div className='mt-2'>
      <div className='flex justify-start'>
        <Label structure={item} />
        <Controller
          control={control}
          name={item?.adminLabel?.toLowerCase()}
          rules={isViewOnly ? {} : { required: { value: item?.isRequired, message: 'This field is required.' } }}
          render={({ field: { value }, fieldState: { error } }) => {
            return (
              <div>
                <div className='relative w-max'>
                  <FileUpload
                    size={85}
                    changeFileState={changeFileState}
                    fileUrl={value ? value : ''}
                    acceptedTypes={acceptedTypes?.length > 0 ? acceptedTypes : undefined}
                    isViewOnly={isViewOnly}
                  />
                  {isLoading && (
                    <div className=' flex justify-center items-center absolute top-0 right-0 left-0 bottom-0'>
                      <div className='spinner w-5 h-5 ' />
                    </div>
                  )}
                  {error && <p className='text-left text-red-500 text-sm'>{error?.message}</p>}
                </div>
                {item?.allowedExtensions && <span className='text-gray-500'>Allowed: {item?.allowedExtensions}</span>}
              </div>
            )
          }}
        />
      </div>
    </div>
  )
}

export default FileUploadType
