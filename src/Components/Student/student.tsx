import { MdOutlineFilterAlt, MdViewColumn } from 'react-icons/md'
import Checkbox from '@mui/material/Checkbox'
import React, { useContext, useEffect, useState } from 'react'
import Filter from './Filter'
import ColumnFilter from './ColumnFilter'
import { getFieldList, bulkAssignAdvisor, getAllStudent, getAllAdvisor } from './api'
import { studentContext } from './context'
import { ActionType, AdvisorType } from './types'
import { Select, MenuItem, InputLabel, FormControl, FormGroup, FormControlLabel } from '@mui/material'
import { FaSort, FaEye } from 'react-icons/fa'
import ConfirmationModal from 'Components/ConfirmationModal'
import ReactJsPagination from 'react-js-pagination'
import Loading from 'Components/Loading'
import ImageSelector from 'Components/ImageSelector'
import { Link } from 'react-router-dom'
import { PerPage } from 'Components/PerPage'
import { toast } from 'Components/Toast/toast'
import ConfirmationAlert from 'Components/ConfirmationAlert'
import http from 'CommonJS/http'
import noImagePlaceholder from 'assets/images/no-image-placeholder.png'
import FileUpload from 'Components/FileUpload'
import Export from './export'
import { UserContext } from 'Context/UserContext'
import { AppStatusStyle } from 'CommonJS/StatusEnum'
import { TbFilterEdit } from 'react-icons/tb'

function Student() {
  const [openFilter, setOPenFilter] = useState(false)
  const [openColumnFilter, setOpenColumnFilter] = useState(false)
  const [openToggleFilter, setOpenToggleFilter] = useState(false)
  const { state, dispatch } = useContext(studentContext)
  const { students, fields, column } = state
  const [advisorList, setAdvisorList] = useState<AdvisorType[]>()
  const [selectedStudentId, setSelectedStudent] = useState<number[]>([])
  const ids = Object.values(students.data).map((item) => item.id)
  const [sortOrder, setSortOrder] = useState({ columnId: null, ascending: true })
  const [isConfirmModalOpen, setConfirmModalOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [multipleValue, setMultipleValue] = useState<Record<string, unknown>>({})
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)
  const [isConfirmAlertOpen, setConfirmAlertOpen] = useState<boolean>(false)
  const [action, setAction] = useState<string>('')
  const [actionLabel, setActionLabel] = useState<string>('')
  const { data } = useContext(UserContext)

  const IMG_BASE_URL = process.env.REACT_APP_S3_BASE_URL ?? ''
  const GF_SIGN_BASE_URL = '?page=gf_signature'

  async function getFields() {
    const res = await getFieldList()
    if (res) {
      dispatch({ type: ActionType.SET_FIELDS, payload: res.fields })
      dispatch({ type: ActionType.SET_FILTERS, payload: res.filters })
      dispatch({ type: ActionType.SET_COLUMN, payload: res.fields.filter((item: any) => item.isDefault).map((item: any) => item.id) })
    }
  }

  async function advisors() {
    const res = await getAllAdvisor()
    if (res) {
      setAdvisorList(res.advisors)
    }
  }

  useEffect(() => {
    const init = async () => {
      await setLoading(true)
      await Promise.all([getFields(), advisors()])
    }
    init()
  }, [])

  useEffect(() => {
    const getData = async () => {
      await setLoading(true)
      await Promise.all([getStudents()])
      await setLoading(false)
    }
    column.length > 0 && getData()
  }, [column, sortOrder, multipleValue])

  async function getStudents(pageNumber: number = 1, perPage?: number) {
    try {
      let items = itemsPerPage
      if (perPage) {
        items = perPage
      }
      setLoading(true)
      const res = await getAllStudent({ pageNumber, fields: column, filterData: multipleValue, sortOrder, perPage: items })
      if (res) {
        dispatch({ type: ActionType.SET_STUDENTS, payload: [] })
        dispatch({ type: ActionType.SET_STUDENTS, payload: res.students })
        setLoading(false)
      } else {
        setLoading(false)
        toast('An error occurred', 'error')
      }
    } catch (error) {
      setLoading(false)
      toast('An error occurred', 'error')
    }
  }
  const handleFilter = (filter: any) => {
    setMultipleValue(filter)
  }

  const selectDeselectAll = (action: boolean) => {
    action ? setSelectedStudent([...ids]) : setSelectedStudent([])
  }

  const handleCheckboxChange = (studentId: number) => {
    setSelectedStudent((prevState) => {
      if (prevState.includes(studentId)) {
        return prevState.filter((id) => id !== studentId)
      } else {
        return [...prevState, studentId]
      }
    })
  }

  const changeAdvisorInBulk = async (data: any) => {
    if (selectedStudentId.length == 0) {
      toast('Please select students', 'error')
      return false
    }
    setLoading(true)
    const payload = {
      studentId: selectedStudentId,
      advisor_id: data.advisor_assign
    }
    try {
      const advisor = await bulkAssignAdvisor(payload)
      if (advisor.success) {
        setConfirmModalOpen(false)
        setLoading(false)
        toast(advisor?.message, 'success')
        getStudents()
      } else {
        setLoading(false)
        toast('An error occurred', 'error')
      }
    } catch (error) {
      setLoading(false)
      toast('An error occurred', 'error')
    }
  }

  const shortByColumn = (columnId: any) => {
    if (sortOrder.columnId === columnId) {
      setSortOrder((prevState) => ({
        columnId,
        ascending: !prevState.ascending
      }))
    } else {
      setSortOrder({ columnId, ascending: true })
    }
  }

  const performAction = () => {
    if (selectedStudentId.length == 0) {
      toast('Please select students', 'error')
      return false
    }
    const payload = {
      studentId: selectedStudentId
    }
    http
      .fetch({ method: 'put', path: `students/${null}/${action}`, data: payload })
      .catch(() => {
        toast('Internal server error.', 'error')
        setConfirmAlertOpen(false)
      })
      .then((response) => {
        if (response && response.status === 200) {
          toast(response?.data.message, 'success')
          getStudents()
        }
        setConfirmAlertOpen(false)
      })
  }

  const exportTo = (format: string) => {
    return getAllStudent({ fields: column, filterData: multipleValue, sortOrder, params: { download: format } })
  }

  return (
    <div className='w-full lg:px-4 flex '>
      {loading && <Loading />}
      <Filter show={openFilter} setOPenFilter={setOPenFilter} submit={handleFilter} />
      <div
        className={`px-5 py-5 overflow-auto md:px-0 ml-auto transition-all duration-300 ${openFilter ? 'w-[calc(100%-20%)]' : 'w-full'}`}
      >
        <div className='flex justify-between items-center mt-5 '>
          <h1 className='text-3xl font-bold'>Students</h1>
          <div className='flex gap-4'>
            <button className='flex items-center gap-2 btn btn-primary px-4' onClick={() => setOPenFilter(!openFilter)}>
              <MdOutlineFilterAlt size={'30px'} className='cursor-pointer' title='Filters' />
              Show Filters
            </button>
            <button
              className='flex items-center gap-2 btn btn-primary px-4'
              onClick={() => {
                setOpenToggleFilter(!openToggleFilter)
                setOpenColumnFilter(false)
              }}
            >
              <TbFilterEdit size={'30px'} className='cursor-pointer' title='Toggle Filters' />
              Change Filters Fields
            </button>
            <button
              className='flex items-center gap-2 btn btn-primary px-4'
              onClick={() => {
                setOpenColumnFilter(true)
                setOpenToggleFilter(false)
              }}
            >
              <MdViewColumn size={'30px'} className='cursor-pointer' title='Toggle Fields' />
              Change Display Columns
            </button>
          </div>
        </div>
        <div className='flex justify-between items-center mt-5 '>
          <PerPage
            onChange={(value) => {
              setItemsPerPage(value)
              getStudents(1, value)
            }}
          />
          <div className='flex gap-x-4 items-center'>
            {data.roles.includes('advisor') && (
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={() => handleFilter({ ...multipleValue, advisorId: !multipleValue.advisorId })}
                      checked={Boolean(multipleValue?.advisorId || false)}
                      value={'advisorId'}
                    />
                  }
                  label='Your Students'
                />
              </FormGroup>
            )}
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() => handleFilter({ ...multipleValue, onlyTrashed: !multipleValue.onlyTrashed })}
                    checked={Boolean(multipleValue?.onlyTrashed || false)}
                    value={'onlyTrashed'}
                  />
                }
                label='Show Archived students'
              />
            </FormGroup>
            <FormControl sx={{ m: 1, minWidth: 80 }} className='!min-w-44'>
              <InputLabel id='student-list-bulk-action-select-label'>Bulk Action </InputLabel>
              <Select
                id='student-list-bulk-action-select'
                labelId='student-list-bulk-action-select-label'
                label='Bulk Action'
                className=''
                value={''}
              >
                {multipleValue?.onlyTrashed ? (
                  <MenuItem
                    value={'unArchiveApplication'}
                    onClick={() => {
                      setConfirmAlertOpen(true)
                      setAction('unArchiveApplication')
                      setActionLabel('Unarchive Application')
                    }}
                  >
                    UnArchive Application
                  </MenuItem>
                ) : (
                  <div>
                    <MenuItem
                      value={'assign_advisor'}
                      onClick={() => {
                        setConfirmModalOpen(true)
                      }}
                    >
                      Assign Advisor
                    </MenuItem>
                    <MenuItem
                      value={'withdrawApplication'}
                      onClick={() => {
                        setConfirmAlertOpen(true)
                        setAction('withdrawApplication')
                        setActionLabel('Withdraw Application')
                      }}
                    >
                      Withdraw Application
                    </MenuItem>
                    <MenuItem
                      value={'archiveApplication'}
                      onClick={() => {
                        setConfirmAlertOpen(true)
                        setAction('archiveApplication')
                        setActionLabel('Archive Application')
                      }}
                    >
                      Archive Application
                    </MenuItem>

                    <MenuItem
                      value={'deleteApplication'}
                      onClick={() => {
                        setConfirmAlertOpen(true)
                        setAction('deleteApplication')
                        setActionLabel('Delete Application')
                      }}
                    >
                      Delete Application
                    </MenuItem>
                  </div>
                )}
              </Select>
            </FormControl>
            <Export callback={exportTo} />
          </div>
        </div>

        <ColumnFilter show={openToggleFilter} setOpenColumnFilter={setOpenToggleFilter} isToggleFilter={true} key={'toToggleFilters'} />
        <ColumnFilter show={openColumnFilter} setOpenColumnFilter={setOpenColumnFilter} key={'toChangeColumns'} />

        <div className='overflow-auto'>
          <table className='w-full lg:w-max'>
            <thead>
              <tr className='[&>*]:bg-primary [&>*]:text-white [&>*]:tracking-wider [&>*]:py-3 [&>*]:border-slate-500 [&>*]:text-center'>
                <th className='cursor-pointer'>
                  <Checkbox
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 18, color: '#ffffff' } }}
                    checked={selectedStudentId.length === ids.length && selectedStudentId.every((value) => ids.includes(value))}
                    onChange={(e) => {
                      selectDeselectAll(Boolean(e.target.checked))
                    }}
                  />
                </th>
                {fields
                  ?.filter((field) => column.includes(field.id))
                  .sort((a, b) => a.filterColumnOrder - b.filterColumnOrder)
                  .map((item, index) => {
                    return (
                      <React.Fragment key={index}>
                        {index === 1 && <th key={-1}>Action</th>}
                        <th
                          key={index}
                          className='cursor-pointer'
                          onClick={() => {
                            shortByColumn(item.id)
                          }}
                        >
                          <div className='flex gap-3 justify-between items-center'>
                            <span className='text-nowrap'>{item.label}</span>
                            <FaSort className='size-4' />
                          </div>
                        </th>
                      </React.Fragment>
                    )
                  })}
              </tr>
            </thead>
            <tbody>
              {students.data.length === 0 && (
                <tr>
                  <td colSpan={1000}>No Students Found</td>
                </tr>
              )}
              {Object.values(students.data).map((student: any, studentIndex: number) => {
                return (
                  <tr key={studentIndex}>
                    <td className='cursor-pointer'>
                      <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }}
                        onChange={() => handleCheckboxChange(student.id)}
                        checked={selectedStudentId.includes(student.id)}
                      />
                    </td>
                    {fields
                      ?.filter((field) => column.includes(field.id))
                      .sort(function (a, b) {
                        return a.filterColumnOrder - b.filterColumnOrder
                      })
                      .map((item, index) => {
                        return (
                          <>
                            {index == 1 && (
                              <td>
                                <div className='flex gap-5 items-center'>
                                  <button
                                    onClick={() => {
                                      if (!multipleValue.onlyTrashed) {
                                        setSelectedStudent([student.id])
                                        setConfirmModalOpen(true)
                                      }
                                    }}
                                    className={`btn-primary flex items-center gap-x-2 text-nowrap ${multipleValue.onlyTrashed ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    title={multipleValue.onlyTrashed ? 'Need to Un-Archive this student first.' : ''}
                                  >
                                    Assign Advisor
                                  </button>
                                  <Link
                                    className='w-full btn btn-secondary flex justify-center items-center gap-x-3'
                                    to={`/admin/student-dashboard/${student.id}`}
                                  >
                                    View <FaEye />
                                  </Link>
                                </div>
                              </td>
                            )}
                            <td key={index} className='space-y-3'>
                              {item.id === 'advisor_id' ? (
                                student.advisor_id ? (
                                  <>
                                    {advisorList &&
                                      advisorList.map(
                                        (advisor, index) =>
                                          student.advisor_id == advisor.user.id && (
                                            <div key={index} className='flex '>
                                              <ImageSelector
                                                size='50px'
                                                isViewOnly={true}
                                                imageSrc={advisor.photoLink ?? noImagePlaceholder}
                                              />
                                              <label id='student-list-advisor-select-label text-nowrap' className='mx-2 self-center'>
                                                {advisor?.name}
                                              </label>
                                            </div>
                                          )
                                      )}
                                  </>
                                ) : (
                                  <label className='text-red-600 text-nowrap'>{'Advisor not  assigned'}</label>
                                )
                              ) : String(student[item.id]).startsWith('[') && String(student[item.id]).endsWith(']') ? (
                                JSON.parse(student[item.id]).map((val: any, index: any) => {
                                  return (
                                    <span
                                      className='block w-full px-3 py-1 bg-slate-100 border border-slate-200 rounded-full font-semibold text-sm text-black text-nowrap max-w-min'
                                      key={index}
                                    >
                                      {val}
                                    </span>
                                  )
                                })
                              ) : typeof student[item.id] === 'string' &&
                                (String(student[item.id]).includes(IMG_BASE_URL) || String(student[item.id]).includes(GF_SIGN_BASE_URL)) ? (
                                <FileUpload
                                  fileUrl={student[item.id]}
                                  isViewOnly={true}
                                  size={50}
                                  nameVisible={item.id !== 'profile_image'}
                                />
                              ) : item.id === 'application_status' ? (
                                <div
                                  className='badge badge-primary capitalize text-center w-4/5'
                                  style={AppStatusStyle[student?.application_status?.toLowerCase()]}
                                >
                                  {student[item.id]}
                                </div>
                              ) : (
                                student[item.id]
                              )}
                            </td>
                          </>
                        )
                      })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {Boolean(students?.data?.length ?? 0 > 0) && (
          <div className='mr-10 [&>ul]:flex [&>ul]:gap-3 [&>*_a]:py-2 [&>*_a]:px-4 [&>*_a]:lg:py-1 [&>*_a]:lg:px-3 [&>*_a]:inline-block mt-4 [&>*_a]:border [&>*_a:hover]:bg-primary [&>*_a:hover]:text-white [&>*_li.active>a]:bg-primary [&>*_li.active>a]:text-white'>
            <ReactJsPagination
              activePage={students?.currentPage || 1}
              itemsCountPerPage={students?.perPage}
              totalItemsCount={students?.total || 0}
              pageRangeDisplayed={students?.to}
              onChange={(pageNumber) => {
                getStudents(pageNumber)
              }}
            />
          </div>
        )}
      </div>
      <ConfirmationModal
        isConfirmModalOpen={isConfirmModalOpen}
        setConfirmModalOpen={setConfirmModalOpen}
        deleteButtonText='Assign'
        advisors={advisorList}
        onAction={changeAdvisorInBulk}
        title={'Assign Advisor'}
      />
      <ConfirmationAlert
        title={`${action === 'deleteApplication' ? 'This action can not be reversed. \n' : ''} Are you sure you perform this action ?`}
        isConfirmModalOpen={isConfirmAlertOpen}
        setConfirmModalOpen={setConfirmAlertOpen}
        ButtonText={'Yes I am sure'}
        actionName={actionLabel}
        onAction={() => {
          performAction()
        }}
      />
    </div>
  )
}

export default Student
