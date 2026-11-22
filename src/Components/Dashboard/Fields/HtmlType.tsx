import { useContext } from 'react'
import { DetailPropsType } from '../type'
import { subStepContext } from '../context'
import { linkify } from 'CommonJS/common'

function HtmlType({ item, isRenderConditionalComponent }: DetailPropsType) {
  const {
    state: { currentPage }
  } = useContext(subStepContext)

  if ((item?.conditionalLogic && isRenderConditionalComponent === false) || currentPage !== item?.pageNumber) return null
  return (
    <div className='mt-5'>
      <h1 className=' text-lg'>{item?.label}</h1>
      <div dangerouslySetInnerHTML={{ __html: linkify(item?.content) }} />
    </div>
  )
}

export default HtmlType
