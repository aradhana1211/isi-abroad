import { SetStateAction, useContext, useEffect, useState } from 'react'
import ImagePlaceholder from 'assets/images/no-image-placeholder.png'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { UserContext } from '../../../Context/UserContext'
import http from 'CommonJS/http'
import ImageSelector from 'Components/ImageSelector'
import Loading from 'Components/Loading'
import ConfirmationAlert from 'Components/ConfirmationAlert'
import { AppContext } from 'Context/AppContext'
import { AppContextType } from 'Context/AppTypes'
import { StudentInfo } from '../type'
import { toast } from 'Components/Toast/toast'
import Step from 'Components/Dashboard/Step'
import { StatusEnum } from 'CommonJS/StatusEnum'

export default function SideMenu() {
  const navigate = useNavigate()
  const { data } = useContext(UserContext)
  const [studentInfo, setStudentInfo] = useState<StudentInfo>()
  const [imageSrc, setImageSrc] = useState(null)
  const [loading, setLoading] = useState<boolean>(false)
  const match = useLocation()
  const { id } = useParams()
  const [isConfirmModalOpen, setConfirmModalOpen] = useState<boolean>(false)
  const [action, setAction] = useState<string>('')
  const [actionLabel, setActionLabel] = useState<string>('')
  const { uploadFile } = useContext(AppContext) as AppContextType
  const [openStepModal, setStepOpenModal] = useState<boolean>(false)

  let studentId: any
  if (match.pathname.includes('student-dashboard')) {
    studentId = id
  } else {
    studentId = data?.student?.id
  }
  useEffect(() => {
    getStudentInfo()
  }, [])

  async function getStudentInfo() {
    http
      .fetch({ path: `students/${studentId}` })
      .catch(() => {
        toast('Internal server error.', 'error')
      })
      .then((response) => {
        if (response && response.status === 200) {
          setStudentInfo(response.data.student)
          setImageSrc(response.data?.student?.profileImage)
        }
      })
  }

  const changeFileState = async (file: File) => {
    try {
      await setLoading(true)
      if (file) {
        const response = await uploadFile(file)
        if (response?.success) {
          const payload = {
            profile_image: response?.document.id
          }
          http
            .fetch({ method: 'put', path: `students/${studentId}/profileImage`, data: payload })
            .catch((error) => {
              toast(error?.response?.data?.message, 'error')
              setLoading(false)
            })
            .then((response) => {
              if (response && response.status === 200) {
                toast(response?.data?.message, 'success')
              }
              setLoading(false)
            })
        }
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const changeImageSrcState = (f: SetStateAction<null>) => {
    setImageSrc(f)
  }

  const performAction = () => {
    http
      .fetch({ method: 'put', path: `students/${studentId}/${action}` })
      .catch(() => {
        toast('Internal server error.', 'error')
        setConfirmModalOpen(false)
      })
      .then((response) => {
        if (response && response.status === 200) {
          toast(response?.data.message, 'success')
          if (['deleteApplication', 'archiveApplication'].includes(action)) {
            navigate('/admin/student')
          } else if (['unArchiveApplication', 'makeActive'].includes(action)) {
            navigate(0) // to simulate reload to prevent actions on dashboard
          } else if (['withdrawApplication'].includes(action)) {
            navigate('/login')
          } else getStudentInfo()
        }
        setConfirmModalOpen(false)
      })
  }

  return (
    <div className='text-center flex flex-col justify-between min-h-full max-h-full w-96 border-r lg:w-full relative h-[calc(100vh-77px)]'>
      {loading && <Loading />}
      <div
        className={`${data?.roles.includes('student') || studentInfo?.deletedAt ? 'h-[calc(100%-120px)] min-h-[calc(100%-120px)]' : 'h-[calc(100%-250px)] min-h-[calc(100%-250px)]'} overflow-auto p-5`}
      >
        <div className='mb-4'>
          <img src={studentInfo?.institute?.icon ?? ImagePlaceholder} alt='' className='w-full' />
        </div>
        <div className='mb-4'>Date Started: {studentInfo?.createdAt} </div>
        <div className='mb-4'>
          <div className='text-secondary uppercase'>Institute</div>
          <h4 className='text-xl font-bold text-primary'>{studentInfo?.institute?.name}</h4>
        </div>
        <div className='mb-4'>
          <div className='text-secondary uppercase'>Session</div>
          <h4 className='text-xl font-bold text-primary'>{studentInfo?.studentMeta?.session}</h4>
        </div>
        <div className='mb-4'>
          <div className='text-secondary uppercase'>Program</div>
          <h4 className='text-xl font-bold text-primary'>{studentInfo?.studentMeta?.program}</h4>
        </div>

        <div className='mb-4 flex justify-center items-center'>
          <ImageSelector
            isViewOnly={studentInfo?.deletedAt !== null}
            size={'110px'}
            imageSrc={imageSrc}
            changeFileState={changeFileState}
            changeImageSrcState={changeImageSrcState}
          />
        </div>

        <div className='mb-4'>
          <h5 className='font-semibold text-xl'>{`${studentInfo?.studentMeta?.firstName} ${studentInfo?.studentMeta?.lastName}`}</h5>
          <ul>
            <li>{studentInfo?.studentMeta?.preferredEmail}</li>
            {studentInfo?.alternateEmail && <li>{studentInfo?.alternateEmail}</li>}
            {studentInfo?.studentMeta?.phone && <li>{studentInfo?.studentMeta?.phone}</li>}
            {studentInfo?.studentMeta?.birth_day && <li>{studentInfo?.studentMeta?.birth_day}</li>}
            {studentInfo?.studentMeta?.gender && <li>{studentInfo?.studentMeta?.gender}</li>}
            <li>{studentInfo?.studentMeta?.preferredPronouns}</li>
          </ul>
          <ul className='navbar-nav'>
            {/* <li>
              <Link to='#'>US Home Address Street </Link>
            </li>
            <li>
              <Link to='#'>Us Home Address State, Zip</Link>
            </li>
            <li>
              <Link to='#'>US Home State</Link>
            </li>
            <li>
              <Link to='#'>US Home Country </Link>
            </li> */}
            <li>{studentInfo?.studentMeta?.countryCitizenship}</li>
          </ul>
        </div>
        <div className='mb-4'>
          <h5 className='font-semibold text-xl'>Academic Information</h5>
          <ul className='mb-4'>
            <li>{studentInfo?.studentMeta?.homeCollegeUniversity}</li>
            <li>{studentInfo?.studentMeta?.collegeMajor}</li>
            <li>{studentInfo?.studentMeta?.minor}</li>
            {studentInfo?.studentMeta?.cumulative_gpa && <li>{studentInfo?.studentMeta?.cumulative_gpa} </li>}
          </ul>
        </div>
        <div className='mb-4'>
          <h5 className='font-semibold text-xl'>Advisor Contact Info</h5>
          {studentInfo?.advisor ? (
            <ul className='mb-4'>
              {/* <li>
                <Link to='#'>Home University </Link>
              </li> */}
              <li>{studentInfo?.advisor?.name}</li>
              <li>{studentInfo?.advisor?.email}</li>
            </ul>
          ) : (
            <ul className='mb-4'>
              <li>No Advisor Assign</li>
            </ul>
          )}
        </div>
        <div className='mb-4'>
          <h5 className='font-semibold text-xl'>Last Login</h5>
          <div> {data?.lastLogin} </div>
        </div>
      </div>

      <div className='py-5 sticky bottom-0 bg-white  w-full left-0 right-0 px-5 shadow-[1px_-3px_10px_0px_#f2f2f2] '>
        {studentInfo?.deletedAt ? (
          <button
            className='w-full btn-secondary'
            onClick={() => {
              setConfirmModalOpen(true)
              setAction('unArchiveApplication')
              setActionLabel('Un-Archive Application')
            }}
          >
            Un-Archive Application
          </button>
        ) : (
          <>
            {data?.roles.includes('student') ? (
              <>
                <div
                  className='mb-2 cursor-pointer hover:underline underline-offset-2'
                  onClick={() => {
                    setStepOpenModal(true)
                    setAction('Cancellation&Withdraw')
                    setActionLabel('Cancellation & Withdraw Policies')
                  }}
                >
                  Cancellation & Withdraw Policies
                </div>
                {studentInfo?.applicationStatus.toLowerCase() != StatusEnum.COMPLETED && (
                  <button
                    className='w-full btn-secondary'
                    onClick={() => {
                      setConfirmModalOpen(true)
                      setAction('withdrawApplication')
                      setActionLabel('Withdraw Application')
                    }}
                  >
                    Withdraw My Application
                  </button>
                )}
              </>
            ) : (
              <>
                <Link to='/admin/student'>
                  <button className='w-full mb-3 btn-primary'>View Student Dashboard</button>
                </Link>
                {studentInfo?.applicationStatus == 'reject' && (
                  <button
                    className='w-full mb-3 btn-secondary'
                    onClick={() => {
                      setConfirmModalOpen(true)
                      setAction('makeActive')
                      setActionLabel('Make Active Student')
                    }}
                  >
                    Make Active Student
                  </button>
                )}
                <button
                  className='w-full mb-3 btn-secondary'
                  onClick={() => {
                    setConfirmModalOpen(true)
                    setAction('archiveApplication')
                    setActionLabel('Archive Application')
                  }}
                >
                  Archive Application
                </button>
                <button
                  className='w-full btn-secondary'
                  onClick={() => {
                    setConfirmModalOpen(true)
                    setAction('deleteApplication')
                    setActionLabel('Delete Application')
                  }}
                >
                  Delete Application
                </button>
              </>
            )}
          </>
        )}
      </div>
      <div>
        <ConfirmationAlert
          title={`${action === 'deleteApplication' ? 'This action can not be reversed. \n' : ''} Are you sure you perform this action ?`}
          isConfirmModalOpen={isConfirmModalOpen}
          setConfirmModalOpen={setConfirmModalOpen}
          ButtonText={'Yes I am sure'}
          actionName={actionLabel}
          onAction={() => {
            performAction()
          }}
        />
      </div>
      {openStepModal && (
        <Step
          setOpenModal={setStepOpenModal}
          formSubStep={null}
          isView={true}
          type={action}
          label={actionLabel}
          initialValue={studentInfo?.cancelWithdrawPolicy ?? ''}
          callSave={() => {
            setStepOpenModal(false)
            return Promise.resolve(null) // Return a resolved promise with null
          }}
        />
      )}
    </div>
  )
}
