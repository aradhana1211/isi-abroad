import { NavLink, useLocation } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'

export default function AdminSetting() {
  const uri = useLocation().pathname

  return (
    <>
      <div className='w-60 min-w-60 py-4 bg-slate-100 shadow-lg bottom-0 top-0 md:w-full md:min-w-full md:pb-0'>
        <ul className='text-md [&_a]:p-4 [&_a:hover]:!bg-primary [&_li:hover]:!text-white [&_a.active>svg]:block [&_a.active]:bg-primary [&_a.active]:!text-white [&_a.active]:shadow-sm'>
          <li className='cursor-pointer'>
            <NavLink to='/admin/setting/basic' className='flex justify-between items-center'>
              Basic Settings
              <FaArrowRight className='hidden' />
            </NavLink>
          </li>
          <li>
            <NavLink to={'/admin/setting/form'} className='flex justify-between items-center'>
              Form Sync Settings
              <FaArrowRight className='hidden' />
            </NavLink>
          </li>
          <li>
            <NavLink
              to={'/admin/setting/template'}
              className={`flex justify-between items-center ${uri.startsWith('/admin/setting/template') ? 'active' : ''}`}
            >
              Email Templates
              <FaArrowRight className='hidden' />
            </NavLink>
          </li>
          <li>
            <NavLink
              to={'/admin/setting/emergency-banner'}
              className={`flex justify-between items-center ${uri.startsWith('/admin/setting/emergency-banner') ? 'active' : ''}`}
            >
              Emergency Banner
              <FaArrowRight className='hidden' />
            </NavLink>
          </li>
          <li>
            <NavLink
              to={'/admin/setting/field-filter'}
              className={`flex justify-between items-center ${uri.startsWith('/admin/setting/field-filter') ? 'active' : ''}`}
            >
              Students Field Filter
              <FaArrowRight className='hidden' />
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  )
}
