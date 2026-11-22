import http from 'CommonJS/http'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaSave } from 'react-icons/fa'
import { useEffect, useRef, useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { linkify, removeBlankPairs } from 'CommonJS/common'
import { Editor } from '@tinymce/tinymce-react'
import { Editor as TinyMCEEditor } from 'tinymce'
import AdminSetting from 'Components/AdminSetting'
import { useForm } from 'react-hook-form'
import Loading from 'Components/Loading'
import { toast } from 'Components/Toast/toast'

export default function EmailTemplatesEdit() {
  interface Errors {
    subject?: string[]
    body?: string[]
  }
  const editorRef = useRef<TinyMCEEditor | null>(null)
  const [error, setError] = useState<Errors>({})
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const pathname = location.pathname
  const hasView = pathname.includes('view')
  const templateId = searchParams.get('templateId')
  const [variable, setVariable] = useState<Array<string>>([''])
  const [loading, setLoading] = useState(false)

  type Inputs = {
    id: string
    subject: string
    body: string
    key: string
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue
  } = useForm<Inputs>()

  useEffect(() => {
    if (templateId !== undefined && templateId !== null) {
      setLoading(true)
      getAdvisorData()
      http
        .fetch({ path: '/templates/variables' })
        .catch(() => {
          toast('Internal server error.', 'error')
        })
        .then((response) => {
          setLoading(false)
          if (response && response.status === 200) {
            setVariable(response.data.variables)
          }
        })
    } else {
      reset({
        id: '',
        subject: '',
        body: '',
        key: ''
      })
    }
  }, [templateId])

  const getAdvisorData = async () => {
    await http
      .fetch({ path: `templates/${templateId}` })
      .catch(() => {
        toast('Internal Server Error.', 'error')
      })
      .then((response: any) => {
        if (response && response.status === 200) {
          reset(response.data.template)
        }
      })
  }

  const handleSave = async (info: Inputs) => {
    await setLoading(true)
    const newData = info
    await http
      .fetch({ method: `put`, path: `/templates/${templateId}`, data: removeBlankPairs(newData) })
      .catch((error) => {
        setError(error.response.data.errors)
        setLoading(false)
      })
      .then((response: any) => {
        setLoading(false)
        if (response && response.status === 200) {
          navigate('/admin/setting/template')
          toast(response?.data?.message || 'Successfully added data', 'success')
        }
      })
    await setLoading(false)
  }

  async function handleDynamicVariable(item: string) {
    editorRef?.current?.insertContent(item)
  }

  const apiKey = process.env.REACT_APP_TINYMCE_API_KEY ?? ''

  return (
    <>
      {loading && <Loading />}
      <div className='flex w-full min-h-screen md:flex-wrap md:min-h-full'>
        <AdminSetting />
        <div className='m-10 px-4 w-full md:my-5 md:mx-0' data-cy='email-template-add-edit-page'>
          <div className='flex justify-between items-center'>
            <h1 className='text-3xl font-bold' data-cy='title'>
              {hasView ? 'View Email Template' : 'Edit Email Template'}{' '}
            </h1>
            <Link to='/admin/setting/template'>
              <button className='btn-primary flex items-center gap-x-2' data-cy='go-back'>
                <IoIosArrowBack />
                Back
              </button>
            </Link>
          </div>
          <form
            className='p-7 md:p-4 rounded-md border border-slate-200 shadow-2xl shadow-primary/20	 mt-10'
            onSubmit={handleSubmit(handleSave)}
          >
            <div className='mb-6 md:mb-3'>
              <div className='mb-6 md:mb-3'>
                <label className='block uppercase tracking-wide text-gray-700 text-base font-semibold mb-2' htmlFor='grid-first-name'>
                  Key
                </label>
                <input
                  className='form-input'
                  {...register('key')}
                  type='text'
                  name='key'
                  placeholder='Enter Key'
                  data-cy='key'
                  disabled={true}
                />
              </div>
              <div className='mb-6 md:mb-3'>
                <label className='block uppercase tracking-wide text-gray-700 text-base font-semibold mb-2' htmlFor='grid-first-name'>
                  Subject
                </label>
                <input
                  className='form-input'
                  {...register('subject', {
                    required: true
                  })}
                  type='text'
                  name='subject'
                  placeholder='Enter Subject'
                  disabled={hasView}
                  data-cy='name'
                />
                {errors?.subject?.type == 'required' && (
                  <p className='text-left text-red-500 text-sm' data-cy='error'>
                    Subject is required
                  </p>
                )}
                {error.subject && (
                  <p className='text-red-500 text-xs italic' data-cy='error'>
                    {error?.subject?.[0]}
                  </p>
                )}
              </div>
              <div className=''>
                <label className='block uppercase tracking-wide text-gray-700 text-base font-semibold mb-2' htmlFor='grid-last-name'>
                  Content
                </label>
                {hasView ? (
                  <iframe
                    className='w-full h-[50vh] border border-slate-200'
                    srcDoc={
                      getValues('body')
                        ? linkify(getValues('body'), { target: '_blank' }) +
                          "<style> body{font-family:'Helvetica Neue',sans-serif;}</style>"
                        : '<h3 style="color: rgb(31, 41, 55); font-size: 20px;">No Note Found</h3>'
                    }
                  ></iframe>
                ) : (
                  <Editor
                    initialValue={getValues('body')}
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    apiKey={apiKey}
                    disabled={hasView}
                    onEditorChange={(content) => {
                      setValue('body', content)
                    }}
                    {...register('body', {
                      required: true
                    })}
                    init={{
                      height: 500,
                      resize: 'both'
                    }}
                    data-cy='editor'
                  />
                )}
                {errors?.body?.type == 'required' && (
                  <p className='text-left text-red-500 text-sm' data-cy='error'>
                    Body is required
                  </p>
                )}
                {error.body && (
                  <p className='text-red-500 text-xs italic' data-cy='error'>
                    {error?.body?.[0] || 'The body field is required.'}
                  </p>
                )}
              </div>
            </div>
            {!hasView && (
              <>
                <div className='mt-10 flex flex-wrap gap-2 [&>_*]:select-none'>
                  {variable.length > 0 && (
                    <>
                      <b>DYNAMICS VARIABLES TO USE: </b>
                      {variable.map((item, i) => {
                        return (
                          <span className='badge-primary' key={i} onClick={() => handleDynamicVariable(item)}>
                            {item}
                          </span>
                        )
                      })}
                    </>
                  )}
                </div>
                <div className='flex justify-center mt-6'>
                  <button type='submit' className='btn-primary flex items-center gap-x-3' data-cy='save-btn'>
                    Save <FaSave />
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </>
  )
}
