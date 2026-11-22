function Label({ structure }: any) {
  return (
    <div className='flex justify-start w-[30%]'>
      <h1 className='form-label'>{structure?.label}</h1>
      {structure?.isRequired && <div className='ml-1 text-red-700'>*</div>}
    </div>
  )
}

export default Label
