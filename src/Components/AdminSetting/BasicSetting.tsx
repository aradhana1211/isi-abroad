import { useEffect, useState } from 'react'
import http from 'CommonJS/http'
import { FaEdit, FaEye, FaSave } from 'react-icons/fa'
import TinyEditor from 'Components/TinyEditor'
import AdminSetting from '.'
import Institute from 'Components/Institute'
import Loading from 'Components/Loading'
import { toast } from 'Components/Toast/toast'

export default function BasicSetting() {
  const [showEditor, setShowEditor] = useState<boolean>(false)
  const [intialValue, setIntialValue] = useState<string>('')
  const [type, setType] = useState<string>('')
  const [label, setLabel] = useState<string>('')
  const [view, setView] = useState<boolean>(false)
  const [data, setData] = useState<Data>({})
  const [variable, setVariable] = useState<Array<string>>([''])
  const [loading, setLoading] = useState<boolean>(false)

  interface DataItem {
    label: string
    type: string
    value: string
  }

  interface Data {
    [key: string]: DataItem
  }

  const submit = (content: string, settingType: string) => {
    setLoading(true)
    const payload = {
      [settingType]: content
    }
    http
      .fetch({ method: 'post', path: 'setting', data: payload })
      .catch((error) => {
        toast(error.response.data.message, 'error')
      })
      .then((response) => {
        setLoading(false)
        if (response && response.status === 200) {
          setData(response.data.setting)
          toast(response.data.message, 'success')
        }
      })
  }

  useEffect(() => {
    setLoading(true)
    const init = async () => {
      await Promise.all([setting(), templatesVariables()])
    }
    init()
  }, [])

  async function templatesVariables() {
    http
      .fetch({ path: '/templates/variables' })
      .catch(() => {
        toast('Internal server error.', 'error')
      })
      .then((response) => {
        if (response && response.status === 200) {
          setVariable(response.data.variables)
        }
      })
  }

  async function setting() {
    http
      .fetch({ path: 'setting' })
      .catch(() => {
        setLoading(false)
        toast('Internal server error.', 'error')
      })
      .then((response) => {
        setLoading(false)
        if (response && response.status === 200) {
          setData(response.data.setting)
        }
      })
  }

  const handleEditCLick = (value: string, type: string, label: string) => {
    setShowEditor(true)
    setIntialValue(value)
    setType(type)
    setLabel(label)
    setView(false)
  }

  return (
    <>
      {loading && <Loading />}
      <div className='flex w-full min-h-[calc(100vh-77px)] md:flex-wrap md:min-h-full' data-cy='default-page'>
        <AdminSetting />
        <div className='w-full p-6 md:px-4'>
          <div className='flex justify-between items-center min-h-12 mb-7 md:mb-5'>
            <h1 className='text-3xl font-bold uppercase'>Basic Setting</h1>
          </div>
          {!showEditor && (
            <div className='w-full gap-y-4 flex flex-col'>
              {Object.entries(data).map(([key, { label, type, value }], index) => (
                <div
                  key={key}
                  className={`flex py-3 px-4 md:flex-wrap md:gap-3 justify-between border border-slate-200 max-w-4xl gap-7 rounded-md items-center shadow-md shadow-slate-50/10 hover:shadow-lg ${index % 2 === 0 ? 'bg-gray-50 shadow-sm' : ''}`}
                >
                  <span className='text-lg'>{label}</span>
                  <div className={`flex items-center ${type == 'richTextEditor' ? 'justify-end' : 'justify-center'}`}>
                    {type == 'richTextEditor' ? (
                      <button
                        data-cy='view-btn'
                        className='btn-primary uppercase flex gap-3 items-center'
                        onClick={() => {
                          handleEditCLick(value, key, label)
                          setView(true)
                        }}
                      >
                        View
                        <FaEye />
                      </button>
                    ) : (
                      <input
                        type='text'
                        className='form-input'
                        defaultValue={value}
                        placeholder={`Enter ${label}`}
                        onChange={(e) =>
                          setData((prevData) => ({
                            ...prevData,
                            [key]: {
                              ...prevData[key],
                              value: e.target.value
                            }
                          }))
                        }
                        name={key}
                      />
                    )}
                    <div className='ml-4'>
                      {type == 'richTextEditor' ? (
                        <button
                          data-cy='edit-btn'
                          className='btn-primary uppercase flex gap-3 items-center'
                          onClick={() => {
                            handleEditCLick(value, key, label)
                            setView(false)
                          }}
                        >
                          Edit
                          <FaEdit />
                        </button>
                      ) : (
                        <button
                          className='btn-primary uppercase flex gap-3 items-center'
                          name='save'
                          data-cy='save-btn'
                          onClick={() => {
                            submit(value, key)
                          }}
                        >
                          Save
                          <FaSave />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {showEditor && (
            <div className='w-full'>
              <TinyEditor
                data-cy='tiny-text'
                initialValue={intialValue}
                type={type}
                label={label}
                callSubmit={submit}
                isView={view}
                variable={variable}
                reSize={true}
                back={() => {
                  setShowEditor(false)
                }}
                classes={{
                  submitBtnBlock: '!border-0',
                  viewBlock: '!h-[73vh]'
                }}
              />
            </div>
          )}
          {showEditor === false && <Institute />}
        </div>
      </div>
    </>
  )
}
