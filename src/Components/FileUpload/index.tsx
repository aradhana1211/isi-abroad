import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { FaPencil } from 'react-icons/fa6'
import noFilePlaceholder from '../../assets/images/no-file-placeholder.png'
import { FaFile, FaFilePdf, FaFileWord } from 'react-icons/fa'
import { CloseOutlined } from '@mui/icons-material'
import { Modal } from '@mui/material'
import { toast } from 'Components/Toast/toast'
interface Props {
  size?: string | number | null
  isViewOnly?: boolean
  fileUrl?: string
  changeFileState?: any
  acceptedTypes?: string[]
  nameVisible?: boolean
}

export default function FileUpload({ size, isViewOnly = false, fileUrl, changeFileState, acceptedTypes, nameVisible = true }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileExtension, setFileExtension] = useState<string>()
  const [openImageModal, setOpenImageModal] = useState<boolean>(false)
  const [imgsLoaded, setImgsLoaded] = useState(true)

  useEffect(() => {
    if (fileUrl) {
      setFileExtension(getFileExtension(fileUrl))

      const loadImage = async (image: string) => {
        await setImgsLoaded(false)
        return new Promise((resolve, reject) => {
          const loadImg = new Image()
          loadImg.src = image
          loadImg.onload = () => resolve(image)
          loadImg.onerror = (err) => reject(err)
        })
      }

      loadImage(fileUrl)
        .then(() => setImgsLoaded(true))
        .catch(() => setImgsLoaded(true))
    }
  }, [fileUrl])

  const handleClick = () => {
    // open file input box on click of another element
    fileInputRef?.current?.click()
  }

  //handle file change
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const file = event.target.files ? event.target.files[0] : null

    if (acceptedTypes && acceptedTypes?.length > 0) {
      if (acceptedTypes?.some((v) => v == file?.type)) {
        changeFileState(event.target.files ? event.target.files[0] : '')
      } else {
        toast('Selected file type not allowed', 'error')
      }
    } else {
      changeFileState(event.target.files ? event.target.files[0] : '')
    }
  }

  return (
    <div className='relative'>
      {fileUrl ? (
        <div
          className='rounded-full w-[max-content] gap-1 justify-between items-center flex border hover:cursor-pointer hover:bg-slate-100'
          onClick={() =>
            fileExtension === 'jpg' || fileExtension === 'png' || fileExtension === 'jpeg' || fileExtension === 'heic'
              ? setOpenImageModal(true)
              : window.open(fileUrl)
          }
        >
          <div
            className=' bg-blue-700 rounded-full flex justify-center items-center relative'
            style={{ width: size ? size : '130px', height: size ? size : '130px' }}
          >
            {fileExtension === 'jpg' || fileExtension === 'png' || fileExtension === 'jpeg' || fileExtension === 'heic' ? (
              imgsLoaded ? (
                <img alt='img' src={fileUrl} className=' rounded-full h-full w-full' />
              ) : (
                <div className='spinner w-1/3 h-1/3' />
              )
            ) : fileExtension === 'pdf' ? (
              <FaFilePdf className='text-white h-1/2 w-1/2' />
            ) : fileExtension === 'doc' || fileExtension === 'docx' ? (
              <FaFileWord className='text-white h-1/2 w-1/2' />
            ) : (
              <FaFile className=' text-white h-1/2 w-1/2' />
            )}
            {!isViewOnly && (
              <div
                className='absolute rounded-full bg-white shadow-md h-1/4 w-1/4 right-0 bottom-1 flex justify-center items-center cursor-pointer hover:h-1/3 hover:w-1/3'
                onClick={(e) => {
                  e.stopPropagation()
                  handleClick()
                }}
              >
                <FaPencil fill='green' className='object-contain h-1/2 w-1/2' />
              </div>
            )}
          </div>
          {nameVisible && <div className=' mr-2 text-sm'>{getFileName(fileUrl) ?? ''}</div>}
        </div>
      ) : (
        <img
          alt='img'
          src={noFilePlaceholder}
          style={{ width: size ? size : '130px', height: size ? size : '130px' }}
          className={`relative hover:bg-black/50 object-cover border border-slate-200 peer rounded-full`}
        />
      )}

      {!isViewOnly && !fileUrl && (
        <div
          className='absolute rounded-full bg-white shadow-md h-1/4 w-1/4 right-0 bottom-1 flex justify-center items-center cursor-pointer hover:h-1/3 hover:w-1/3'
          onClick={() => handleClick()}
        >
          <FaPencil fill='green' className='object-contain h-1/2 w-1/2' />
        </div>
      )}

      <input
        ref={fileInputRef}
        id='document_upload'
        type='file'
        onChange={(event) => handleFileChange(event)}
        style={{ display: 'none' }}
      />

      <Modal
        className='flex justify-center items-center'
        disableAutoFocus={true}
        open={openImageModal}
        onClose={() => setOpenImageModal(false)}
      >
        <div className='h-4/5 w-2/5 bg-black relative flex justify-center items-center'>
          <div className='absolute top-2 right-2 cursor-pointer' onClick={() => setOpenImageModal(false)}>
            <CloseOutlined className='text-white' fontSize='large' />
          </div>
          <img alt='img' src={fileUrl} className='h-full w-full object-contain' />
        </div>
      </Modal>
    </div>
  )
}

export function getFileExtension(url: string) {
  return url.split('.').pop()
}

export function getFileName(url: string) {
  return url.split('/').pop()
}
