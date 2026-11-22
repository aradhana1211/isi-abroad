import { useContext } from 'react'
import Label from '../Label'
import { DetailPropsType } from '../type'
import { subStepContext } from '../context'

function PageType({ item, onNext, onPrevious, isViewOnly, setOpenModal }: DetailPropsType) {
  const {
    state: { currentPage, gravityForm }
  } = useContext(subStepContext)

  return (
    <div className='flex justify-center bg-white border-t py-4 absolute inset-x-0 bottom-0'>
      <div className='flex justify-start'>
        <Label structure={item} />
      </div>
      <div className='flex justify-center gap-5'>
        <div className='flex absolute top-0 bottom-0 left-5 items-center'>
          <label className=' select-none'>{`Page ${currentPage} of ${gravityForm?.pagination.pages?.length}`}</label>
        </div>

        {currentPage !== 1 && item?.previousButton && (
          <button className='btn-primary mt-2' id='previous' type='button' onClick={onPrevious}>
            {item?.previousButton?.text}
          </button>
        )}
        {item?.nextButton && currentPage !== gravityForm?.pagination?.pages?.length && (
          <button className='btn-secondary mt-2' id='next' type='button' onClick={onNext}>
            {item?.nextButton?.text}
          </button>
        )}

        {gravityForm?.save?.button && gravityForm?.save?.enabled && !isViewOnly && (
          <button className='btn-primary mt-2' id='save' type='submit'>
            {gravityForm?.save?.button?.text}
          </button>
        )}

        {isViewOnly && (
          <button className='btn-primary mt-2' type='reset' onClick={() => setOpenModal(false)}>
            Close
          </button>
        )}
      </div>
    </div>
  )
}
export default PageType
