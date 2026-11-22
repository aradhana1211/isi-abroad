import { linkify } from 'CommonJS/common'

function Description({ structure }: any) {
  return <div className=' text-gray-500 text-sm' dangerouslySetInnerHTML={{ __html: linkify(structure?.description) }} />
}

export default Description
