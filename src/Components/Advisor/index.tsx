import http from 'CommonJS/http'
import { useEffect, useState } from 'react'
import { FaEdit, FaEye, FaTrashAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { CiSquarePlus } from 'react-icons/ci'
import noImage from 'assets/images/no-image-placeholder.png'
import ImageSelector from 'Components/ImageSelector'

import './index.css'
import ConfirmationModal from 'Components/ConfirmationModal'
import Loading from 'Components/Loading'
import { AdvisorData } from './type'
import { toast } from 'Components/Toast/toast'

export default function Advisor() {
  const [advisors, setAdvisors] = useState<AdvisorData[]>()
  const [isConfirmModalOpen, setConfirmModalOpen] = useState<boolean>(false)
  const [selectedAdvisorId, setSelectedAdvisorId] = useState<string | number>('')
  const [isAssign, setIsAssign] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    getAdvisorData()
  }, [])

  const getAdvisorData = async (pageNumber = 1) => {
    setLoading(true)
    await http
      .fetch({ path: `advisors?page=${pageNumber}` })
      .catch(() => {
        toast('Internal Server Error.', 'error')
      })
      .then((response: any) => {
        setLoading(false)
        if (response && response.status === 200) {
          setAdvisors(response.data.advisors)
        }
      })
  }

  const getAdvisorDetail = async (advisor: AdvisorData) => {
    await setLoading(true)
    await http
      .fetch({ path: `advisors/${advisor?.id}` })
      .then((response: any) => {
        if (response && response.status === 200) {
          if (response?.data?.advisor?.studentsCount > 0) setIsAssign(true)
          else setIsAssign(false)
          setSelectedAdvisorId(advisor?.id)
          setConfirmModalOpen(true)
        }
        setLoading(false)
      })
      .catch(() => {
        toast('Internal Server Error.', 'error')
        setLoading(false)
      })
  }

  async function onDelete(data: any) {
    await setLoading(true)
    let payload
    if (isAssign) payload = { assigned_to_advisor_id: data?.advisor_assign }
    await http
      .fetch({ method: 'delete', path: `advisors/${selectedAdvisorId}`, data: payload ? payload : {} })
      .then((res) => {
        if (res.data.success) toast(res.data.message, 'success')
        getAdvisorData()
        setLoading(false)
        setConfirmModalOpen(false)
      })
      .catch(() => {
        toast('Internal Server Error.', 'error')
        setConfirmModalOpen(false)
        setLoading(false)
      })
  }

  return (
    <>
      {isLoading && <Loading />}
      <div className='px-7 py-5 w-full lg:px-4' data-cy='advisor-page'>
        <div className='flex justify-between items-center'>
          <h1 className='text-3xl font-bold decoration-1'>Advisors</h1>
          <Link
            to='/admin/advisors/add'
            className='btn-primary bg-primary hover:bg-primary/90  text-white flex gap-x-2 items-center'
            data-cy='add-advisor-link'
          >
            Add Advisor
            <CiSquarePlus className='w-6 h-6' />
          </Link>
        </div>

        <div className='overflow-auto'>
          <table className='w-full mt-5 lg:w-max' data-cy='advisors-table'>
            <thead>
              <tr className='[&>*]:bg-primary [&>*]:text-white [&>*]:tracking-wider [&>*]:py-3 [&>*]:border-slate-500 [&>*]:text-left'>
                <th>Id</th>
                <th className='w-24'>Photo</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {advisors?.length === 0 || !advisors ? (
                <>
                  <tr>
                    <td colSpan={6}>No Advisors Found</td>
                  </tr>
                </>
              ) : (
                <>
                  {advisors?.map((person) => (
                    <tr key={person.id}>
                      <td>
                        <strong>{person?.id}</strong>
                      </td>
                      <td>
                        <div>
                          {person.photoLink ? (
                            <ImageSelector imageSrc={person?.photoLink} size={'3rem'} isViewOnly={true} />
                          ) : (
                            <img className='h-12 w-12 flex-none rounded-full bg-gray-50' src={noImage} alt='advisor photo' />
                          )}
                        </div>
                      </td>
                      <td>{person?.name}</td>
                      <td>{person.user.email}</td>
                      <td>{person.phoneNumber}</td>
                      <td>
                        <div className='flex gap-5 items-center'>
                          <Link
                            to={`/admin/advisors/edit?userId=${person?.id}`}
                            data-cy='advisor-edit'
                            className='btn btn-primary flex items-center gap-x-3'
                          >
                            Edit <FaEdit />
                          </Link>
                          <Link
                            to={`/admin/advisors/view?userId=${person?.id}`}
                            data-cy='advisor-view'
                            className='btn btn-secondary flex items-center gap-x-3'
                          >
                            View <FaEye />
                          </Link>
                          <button className='btn btn-danger flex items-center gap-x-3' onClick={() => getAdvisorDetail(person)}>
                            Delete <FaTrashAlt size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
        <ConfirmationModal
          title={
            isAssign && advisors?.length === 1
              ? 'You can not delete this advisor because this advisor have students assigned, and no other advisors exist to transfer those students to.'
              : 'Are you sure you want to delete?'
          }
          isConfirmModalOpen={isConfirmModalOpen}
          setConfirmModalOpen={setConfirmModalOpen}
          deleteButtonText={isAssign ? 'Assign and Delete' : 'Delete'}
          advisors={isAssign ? advisors?.filter((i) => i?.id !== selectedAdvisorId) : []}
          onAction={onDelete}
          enableDelete={isAssign && advisors?.length === 1 ? false : true}
        />
      </div>
    </>
  )
}
