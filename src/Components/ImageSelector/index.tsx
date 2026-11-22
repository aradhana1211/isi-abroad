import { ChangeEvent, useEffect, useRef, useState } from 'react'
import noImagePlaceholder from '../../assets/images/no-image-placeholder.png'
import { FaEye } from 'react-icons/fa'
import { FaPencil } from 'react-icons/fa6'
import { Modal } from '@mui/material'
import { CloseOutlined } from '@mui/icons-material'

interface Props {
  changeFileState?: any
  changeImageSrcState?: any
  id?: number | string | null
  size?: string | number | null
  imageSrc?: string | null
  isViewOnly?: boolean | null
}

const ImageSelector = ({ size, changeFileState, changeImageSrcState, id, imageSrc, isViewOnly = false }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [openImageModal, setOpenImageModal] = useState<boolean>(false)
  const [imgsLoaded, setImgsLoaded] = useState(true)

  useEffect(() => {
    if (imageSrc) {
      const loadImage = async (image: string) => {
        await setImgsLoaded(false)
        return new Promise((resolve, reject) => {
          const loadImg = new Image()
          loadImg.src = image
          loadImg.onload = () => resolve(image)
          loadImg.onerror = (err) => reject(err)
        })
      }

      loadImage(imageSrc)
        .then(() => setImgsLoaded(true))
        .catch(() => setImgsLoaded(true))
    }
  }, [imageSrc])

  //handle file change
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()

    if (changeFileState) changeFileState(event.target.files ? event.target.files[0] : '', id)
    const imageFile = event.target.files ? event.target.files[0] : ''

    if (imageFile && changeImageSrcState) {
      const localImageUrl = URL.createObjectURL(imageFile)
      changeImageSrcState(localImageUrl)
    }
  }

  const handleClick = () => {
    // open file input box on click of another element
    fileInputRef?.current?.click()
  }

  return (
    <div className='relative' style={{ width: size ? size : '130px', height: size ? size : '130px' }}>
      <div
        className={`mr-3 cursor-pointer relative rounded-full overflow-hidden flex w-full h-full`}
        onClick={() => (imageSrc ? setOpenImageModal(true) : '')}
      >
        {imgsLoaded ? (
          <img
            alt='img'
            src={imageSrc ? imageSrc : noImagePlaceholder}
            style={{ width: size ? size : '130px', height: size ? size : '130px' }}
            className={`relative hover:bg-black/50 object-cover border border-slate-200 peer rounded-full`}
          />
        ) : (
          <div
            className={`relative hover:bg-black/50 object-cover border border-slate-200 peer rounded-full justify-center items-center flex`}
            style={{ width: size ? size : '130px', height: size ? size : '130px' }}
          >
            <div className='spinner w-1/3 h-1/3' />
          </div>
        )}
        {imageSrc && (
          <div
            style={{ width: size ? size : '130px', height: size ? size : '130px' }}
            className={`absolute text-center justify-center items-center text-sm text-white rounded-full bg-black/40  hidden peer-hover:flex pointer-events-none`}
          >
            <FaEye className='text-xl' />
          </div>
        )}
      </div>

      {!isViewOnly && (
        <div
          className='absolute rounded-full bg-white shadow-md h-1/4 w-1/4 right-0 bottom-1 flex justify-center items-center cursor-pointer hover:h-1/3 hover:w-1/3'
          onClick={() => handleClick()}
        >
          <FaPencil fill='green' className='object-contain h-1/2 w-1/2' />
        </div>
      )}

      <input
        ref={fileInputRef}
        id='file_input'
        type='file'
        accept='image/*'
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
          <img alt='img' src={imageSrc ? imageSrc : noImagePlaceholder} className='h-full w-full object-contain' />
        </div>
      </Modal>
    </div>
  )
}

export default ImageSelector
