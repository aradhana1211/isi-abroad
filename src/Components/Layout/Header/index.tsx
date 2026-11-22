import { Link } from 'react-router-dom'
import Logo from 'assets/images/ISILOGOPNG.png'
import { HiMenuAlt3 } from 'react-icons/hi'
import { CgClose } from 'react-icons/cg'
import { useContext, useState } from 'react'
import { AuthContext } from '../../../Context/AuthContext'
import { UserContext } from 'Context/UserContext'
import { LuLogOut } from 'react-icons/lu'
import { FaUser } from 'react-icons/fa'
import { GrDown } from 'react-icons/gr'

export default function Header() {
  const [toggle, setToggle] = useState(false)
  const { data } = useContext(UserContext)
  const { Logout } = useContext(AuthContext)

  return (
    <header className='sticky top-0 px-5 bg-primary lg:px-4 lg:py-1 z-[150]'>
      <div className='flex justify-between items-center z-50'>
        <div className='logo bg-white rounded-md'>
          <Link to='/'>
            <img src={Logo} alt='log' className='lg:w-28' />
          </Link>
        </div>

        <HiMenuAlt3 className='w-10 h-10 text-white cursor-pointer hidden lg:block' onClick={() => setToggle(true)} />
        <div className={`fixed inset-0 bg-black/70 hidden z-50 ${toggle ? '!block' : ''} `} onClick={() => setToggle(false)}></div>
        <div
          className={`lg:fixed lg:top-0 lg:bottom-0 flex justify-end lg:justify-start lg:left-0 lg:bg-gray-100 lg:border-r lg:border-gray-300  lg:z-50 lg:p-5 w-10/12 relative lg:-translate-x-full lg:transition-all lg:duration-500 ${
            toggle ? '!translate-x-0' : ''
          }`}
        >
          <CgClose
            className='w-10 h-10 text-primary absolute top-3 right-3 cursor-pointer hidden lg:block'
            onClick={() => setToggle(false)}
          />

          <ul className='flex items-center [&>li]:py-6 [&>*_a]:text-xl [&>*]:ml-7 [&>*_a]:text-white lg:flex-col lg:items-start [&>*_a]:lg:py-2 [&>*]:lg:ml-0 [&>*_a]:lg:text-primary lg:mt-7 [&>li]:lg:py-0 [&>*li>a]:flex [&>*>a]:lg:block lg:w-full [&>li]:lg:w-full [&>*_a]:lg:w-full'>
            <li>
              <Link onClick={() => setToggle(false)} to='/dashboard'>
                Dashboard
              </Link>
            </li>
            {data?.roles.some((role) => role === 'superadmin' || role === 'advisor') && (
              <li>
                <Link onClick={() => setToggle(false)} to='/admin/student'>
                  Student
                </Link>
              </li>
            )}
            {data?.roles.includes('superadmin') && (
              <>
                <li>
                  <Link onClick={() => setToggle(false)} to='/admin/advisors'>
                    Advisors
                  </Link>
                </li>
                <li>
                  <Link onClick={() => setToggle(false)} to='/admin/setting/basic'>
                    Settings
                  </Link>
                </li>
              </>
            )}
            {data?.roles.includes('student') ? (
              <li>
                <Link to='#' onClick={Logout} className='flex gap-x-2 items-center lg:!px-0'>
                  <LuLogOut className='lg:hidden' /> Logout
                </Link>
              </li>
            ) : (
              <li className='relative py-4 group'>
                <Link to='#' className='flex gap-x-2 items-center lg:justify-between lg:!hidden'>
                  {data?.name} <GrDown />
                </Link>
                <ul className='hidden group-hover:block lg:block absolute top-full bg-white overflow-hidden pt-1 [&_a]:px-3 right-0 [&_a]:text-primary [&_a]:py-1 [&>*_a:hover]:bg-primary [&>*_a:hover]:text-white [&>*_a:hover]:lg:bg-transparent [&>*_a:hover]:lg:text-primary border border-slate-200 shadow-lg rounded-md min-w-40 [&_a]:text-xl lg:w-full lg:shadow-none lg:border-0 lg:bg-transparent'>
                  <li className='border-b lg:border-0'>
                    <Link onClick={() => setToggle(false)} to='/admin/profile' className='flex gap-x-2 items-center lg:!px-0'>
                      <FaUser className='lg:hidden' /> Profile
                    </Link>
                  </li>
                  <li>
                    <Link to='#' onClick={Logout} className='flex gap-x-2 items-center lg:!px-0'>
                      <LuLogOut className='lg:hidden' /> Logout
                    </Link>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  )
}
