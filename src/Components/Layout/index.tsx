import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import GuestLayout from 'Components/Layout/guest'
import DefaultLayout from 'Components/Layout/default'
import AdminLayout from './AdminLayout'
import { UserContext } from 'Context/UserContext'
import { useContext } from 'react'
import { routes } from './routes'
import { RouteItem } from './type'

export default function Layout() {
  const { data } = useContext(UserContext)
  const navigate = useLocation()

  const hasAccess = (allowedRoles: string[] | undefined): boolean => {
    if (!allowedRoles) {
      return true
    }
    return data.roles.some((role) => allowedRoles.includes(role))
  }

  const renderRoutes = (routes: RouteItem[] | undefined) => {
    if (!routes) {
      return null
    }

    return routes.map((route) => (
      <Route
        key={route.path}
        path={route.path}
        element={
          route.layout === 'default' && hasAccess(route.allowedRoles) ? (
            <DefaultLayout>{route.component}</DefaultLayout>
          ) : route.layout === 'admin' && hasAccess(route.allowedRoles) ? (
            navigate.pathname === route.path && <AdminLayout>{route.component}</AdminLayout>
          ) : route.layout === 'guest' ? (
            <GuestLayout>{route.component}</GuestLayout>
          ) : (
            <Navigate to={data?.roles.includes('superadmin') || data?.roles.includes('advisor') ? '/dashboard' : '/'} replace={true} />
          )
        }
      >
        {/* {renderRoutes(route.children, route.layout)} */}
      </Route>
    ))
  }

  return <Routes>{renderRoutes(routes)}</Routes>
}
