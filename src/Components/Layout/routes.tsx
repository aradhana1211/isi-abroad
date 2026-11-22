import Dashboard from 'Components/Dashboard'
import AdminDashboard from 'Components/AdminDashboard'
import Advisor from 'Components/Advisor'
import AdvisorAddEdit from 'Components/Advisor/AdvisorAddEdit'
import BasicSetting from 'Components/AdminSetting/BasicSetting'
import FormSyncSetting from 'Components/FormSyncSetting'
import Profile from 'Components/Profile'
import EmailTemplates from 'Components/EmailTemplates'
import EmailTemplatesEdit from 'Components/EmailTemplates/EmailTemplatesEdit'
import Institute from 'Components/Institute'
import EmergencyBanner from 'Components/EmergencyBanner'
import EmergencyBannerAddEdit from 'Components/EmergencyBanner/EmergencyBannerAddEdit'
import Student from 'Components/Student'
import FieldFilter from 'Components/FieldFilter'
import { RouteItem } from './type'

export const routes: RouteItem[] = [
  {
    path: '/',
    layout: 'default',
    component: <Dashboard />,
    allowedRoles: ['student']
  },
  {
    path: 'admin/student-dashboard/:id',
    layout: 'default',
    component: <Dashboard />,
    allowedRoles: ['superadmin', 'advisor']
  },
  {
    path: '/admin/student',
    layout: 'admin',
    component: <Student />,
    allowedRoles: ['superadmin', 'advisor']
  },
  {
    path: '/dashboard',
    layout: 'admin',
    component: <AdminDashboard />,
    allowedRoles: ['superadmin', 'advisor']
  },
  {
    path: '/admin/setting/*',
    layout: 'admin',
    allowedRoles: ['superadmin', 'advisor'],
    children: [
      { path: '/basic', component: <BasicSetting /> },
      { path: '/form', component: <FormSyncSetting /> },
      { path: '/template', component: <EmailTemplates /> }
    ]
  },
  {
    path: '/admin/advisors',
    layout: 'admin',
    component: <Advisor />,
    allowedRoles: ['superadmin']
  },
  {
    path: '/admin/advisors/add/',
    layout: 'admin',
    component: <AdvisorAddEdit />,
    allowedRoles: ['superadmin']
  },
  {
    path: '/admin/advisors/edit',
    layout: 'admin',
    component: <AdvisorAddEdit />,
    allowedRoles: ['superadmin']
  },
  {
    path: '/admin/advisors/view',
    layout: 'admin',
    component: <AdvisorAddEdit />,
    allowedRoles: ['superadmin']
  },
  {
    path: '/admin/setting/template/edit',
    layout: 'admin',
    component: <EmailTemplatesEdit />,
    allowedRoles: ['superadmin']
  },
  {
    path: '/admin/setting/template/view',
    layout: 'admin',
    component: <EmailTemplatesEdit />,
    allowedRoles: ['superadmin']
  },
  {
    path: '/admin/setting/institute',
    layout: 'admin',
    component: <Institute />,
    allowedRoles: ['superadmin']
  },
  {
    path: '/admin/profile',
    layout: 'admin',
    component: <Profile />,
    allowedRoles: ['superadmin', 'advisor']
  },
  {
    path: '/admin/setting/emergency-banner/',
    layout: 'admin',
    component: <EmergencyBanner />,
    allowedRoles: ['superadmin']
  },
  {
    path: '/admin/setting/emergency-banner/add',
    layout: 'admin',
    component: <EmergencyBannerAddEdit />,
    allowedRoles: ['superadmin']
  },
  {
    path: '/admin/setting/emergency-banner/edit/:id',
    layout: 'admin',
    component: <EmergencyBannerAddEdit />,
    allowedRoles: ['superadmin']
  },
  {
    path: '/admin/setting/field-filter/',
    layout: 'admin',
    component: <FieldFilter />,
    allowedRoles: ['superadmin']
  }
]
