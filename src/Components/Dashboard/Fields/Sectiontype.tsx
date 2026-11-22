import { useContext } from 'react'
import { DetailPropsType } from '../type'
import { subStepContext } from '../context'

function Sectiontype({ item, isRenderConditionalComponent }: DetailPropsType) {
  const {
    state: { currentPage }
  } = useContext(subStepContext)

  if (
    (item?.conditionalLogic && isRenderConditionalComponent === false) ||
    currentPage !== item?.pageNumber ||
    item?.visibility === 'hidden'
  )
    return null

  return (
    <div className='mt-5 bg-slate-100 py-2 px-2 rounded-sm'>
      <h1 className=' font-medium text-lg text-black'>{item.label}</h1>
    </div>
  )
}

export default Sectiontype
