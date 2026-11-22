import { Editor } from '@tinymce/tinymce-react'
import { toast } from 'Components/Toast/toast'
import { useEffect, useRef, useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { Editor as TinyMCEEditor } from 'tinymce'
import { linkify } from 'CommonJS/common'

type Slot = JSX.Element

interface CustomOptionsType {
  disabled?: boolean | string
}

interface Classes {
  labelBlock?: string
  editorBlock?: string
  submitBtnBlock?: string
  viewBlock?: string
}

interface TinyEditorProps {
  initialValue: string
  type: string
  label: string | boolean
  callSubmit: (content: any, type: string) => void
  isView: boolean
  variable: Array<string>
  back?: () => void
  reSize?: boolean | 'both'
  slots?: Record<string, Slot | undefined>
  customOptions?: CustomOptionsType
  height?: number | string
  classes?: Classes
}

export default function TinyEditor({
  initialValue,
  type,
  label,
  callSubmit,
  isView,
  variable,
  back,
  reSize = 'both',
  slots,
  customOptions = {},
  height = 550,
  classes
}: TinyEditorProps) {
  const [content, setContent] = useState<string>('')
  const editorRef = useRef<TinyMCEEditor | null>(null)

  const handleSubmit = () => {
    callSubmit(content, type)
  }

  useEffect(() => {
    setContent(initialValue)
  }, [initialValue])

  async function handleDynamicVariable(item: string) {
    editorRef?.current?.insertContent(item)
  }

  const apiKey = process.env.REACT_APP_TINYMCE_API_KEY ?? ''

  return (
    <>
      {label && (
        <div className={`flex justify-between items-center mb-4 ${classes?.labelBlock ? classes?.labelBlock : ''}`}>
          <h1 className='text-xl'>{label}</h1>
          {back && (
            <button data-cy='back-btn' className='btn-primary flex justify-between items-center gap-x-2' onClick={back}>
              <IoIosArrowBack /> Back
            </button>
          )}
          {slots?.header && slots?.header}
        </div>
      )}
      {!isView ? (
        <>
          <div className={`overflow-auto relative ${classes?.editorBlock ? classes?.editorBlock : 'h-[calc(100%-95px)]'}`}>
            <Editor
              onInit={(evt, editor) => (editorRef.current = editor)}
              value={content}
              apiKey={apiKey}
              onEditorChange={(content) => {
                setContent(content)
              }}
              init={{
                height: height,
                min_height: Number(height),
                resize: reSize
              }}
              disabled={Boolean(customOptions.disabled)}
            />
            {variable.length > 0 && (
              <div className='mt-7 flex flex-wrap gap-2 [&>_*]:select-none'>
                <b>DYNAMICS VARIABLES TO USE: </b>
                {variable.map((item, i) => {
                  return (
                    <span className='badge-primary' key={i} onClick={() => handleDynamicVariable(item)}>
                      {item}
                    </span>
                  )
                })}
              </div>
            )}
            <div
              className={`${classes?.submitBtnBlock ? classes?.submitBtnBlock : ''} sticky inset-x-0 bottom-0 bg-white border-t border-t-gray-200 mt-4 py-3`}
            >
              <button
                data-cy='save-content'
                className='btn-primary uppercase tiny-save-btn'
                onClick={() => {
                  if (customOptions?.disabled) {
                    const msg = typeof customOptions?.disabled === 'string' ? customOptions?.disabled : null
                    toast(msg ?? 'Action cannot be performed.', 'warning')
                    return
                  }
                  handleSubmit()
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </>
      ) : (
        <iframe
          className={`w-full h-[calc(100%-55px)] border border-slate-200 ${classes?.viewBlock ? classes.viewBlock : ''}`}
          srcDoc={
            content
              ? linkify(content, { target: '_blank' }) + "<style> body{font-family:'Helvetica Neue',sans-serif;}</style>"
              : 'No content Found'
          }
        ></iframe>
      )}
    </>
  )
}
