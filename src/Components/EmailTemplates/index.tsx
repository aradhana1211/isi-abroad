import http from 'CommonJS/http'
import AdminSetting from 'Components/AdminSetting'
import Loading from 'Components/Loading'
import { toast } from 'Components/Toast/toast'
import { useEffect, useState } from 'react'
import { FaEdit, FaEye } from 'react-icons/fa'
import ReactJsPagination from 'react-js-pagination'
import { Link } from 'react-router-dom'

export default function EmailTemplates() {
  interface TemplateData {
    id: string
    body: string
    createdAt: string
    key: string
    subject: string
  }

  interface Template {
    currentPage: number
    data: TemplateData[]
    firstPageUrl: string
    from: number
    lastPage: number
    lastPageUrl: string
    links: {
      url: string | null
      label: string
      active: boolean
    }[]
    nextPageUrl: string | null
    path: string
    perPage: number
    prevPageUrl: string | null
    to: number
    total: number
  }

  const [templates, setTemplates] = useState<Template>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getTempalateData()
  }, [])

  const getTempalateData = async (pageNumber = 1) => {
    await http
      .fetch({ path: `templates?page=${pageNumber}` })
      .catch(() => {
        toast('Internal Server Error.', 'error')
      })
      .then((response: any) => {
        setLoading(false)
        if (response && response.status === 200) {
          setTemplates(response.data.templates)
        }
      })
  }

  return (
    <>
      {loading && <Loading />}
      <div className='flex w-full min-h-screen md:flex-wrap md:min-h-full'>
        <AdminSetting />
        <div className='px-7 py-5 w-full lg:px-4' data-cy='email-template-page'>
          <div className='flex justify-between items-center'>
            <h1 className='text-3xl font-bold decoration-1'>Email Templates</h1>
          </div>

          <div className='overflow-auto'>
            <table className='w-full mt-5 lg:w-max' data-cy='email-template-table'>
              <thead>
                <tr className='[&>*]:bg-primary [&>*]:text-white [&>*]:tracking-wider [&>*]:py-3 [&>*]:border-slate-500 [&>*]:text-left'>
                  <th>Id</th>
                  <th>Subject</th>
                  <th>Key</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {templates?.data.length === 0 || !templates ? (
                  <>
                    <tr>
                      <td colSpan={6}>No Email Template Found</td>
                    </tr>
                  </>
                ) : (
                  <>
                    {templates?.data?.map((template) => (
                      <tr key={template.id}>
                        <td>
                          <strong>{template?.id}</strong>
                        </td>
                        <td>{template?.subject}</td>
                        <td>{template?.key}</td>
                        <td>
                          <div className='flex gap-5'>
                            <Link
                              to={`/admin/setting/template/edit?templateId=${template?.id}`}
                              className='btn btn-primary flex items-center gap-x-3'
                              data-cy='email-template-edit'
                            >
                              Edit <FaEdit />
                            </Link>
                            <Link
                              to={`/admin/setting/template/view?templateId=${template?.id}`}
                              className='btn btn-secondary flex items-center gap-x-3'
                              data-cy='email-template-view'
                            >
                              View <FaEye />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
          {Boolean(templates?.data?.length ?? 0 > 0) && (
            <div className='mr-10 [&>ul]:flex [&>ul]:gap-3 [&>*_a]:py-2 [&>*_a]:px-4 [&>*_a]:lg:py-1 [&>*_a]:lg:px-3 [&>*_a]:inline-block mt-4 [&>*_a]:border [&>*_a:hover]:bg-primary [&>*_a:hover]:text-white [&>*_li.active>a]:bg-primary [&>*_li.active>a]:text-white'>
              <ReactJsPagination
                activePage={templates?.currentPage || 1}
                itemsCountPerPage={templates?.perPage}
                totalItemsCount={templates?.total || 0}
                pageRangeDisplayed={templates?.to}
                onChange={(pageNumber) => {
                  getTempalateData(pageNumber)
                }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
