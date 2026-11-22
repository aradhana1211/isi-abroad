import { getToken } from 'CommonJS/common'
import http from 'CommonJS/http'
import AdminLayout from 'Components/Layout/AdminLayout'
import DefaultLayout from 'Components/Layout/default'
import GuestLayout from 'Components/Layout/guest'
import { routes } from 'Components/Layout/routes'
import Login from 'Components/Login'
import ForgotPassword from 'Components/Login/forgotPassword'
import PrivateRoute from 'Components/PrivateRoute'
import { UserContext } from 'Context/UserContext'
import React, { useContext, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import ResetPassword from 'Components/Login/ResetPassword'
import AppProvider from 'Context/AppContext'
import { toast } from 'Components/Toast/toast'
import { AuthContext } from 'Context/AuthContext'

function App() {
  const { data } = useContext(UserContext)
  const [token] = useState(getToken())
  const navigate = useNavigate()
  const location = useLocation()
  const { Logout } = useContext(AuthContext)

  useEffect(() => {
    if (location.pathname === '/admin/setting' || location.pathname === '/admin/setting/') navigate('/admin/setting/basic')

    if (location?.hash) {
      let iteration = 0
      // Retry for 3 times every second to wait for DOM render.
      const interval = setInterval(() => {
        iteration++
        const element = document.querySelector(location.hash)
        if (element) {
          clearInterval(interval)
          element.scrollIntoView({ behavior: 'smooth' })
        }
        if (iteration > 2) clearInterval(interval)
      }, 1000)
    }
  }, [location])

  useEffect(() => {
    if (token) {
      http
        .checkLogin()
        .then((rsp) => {
          if (rsp.data?.roles?.includes('student') && !rsp.data?.student) {
            toast('Your Application is withdrew. ', 'info', { persist: true })
            setTimeout(async () => {
              await Logout()
            }, 1000)
          }
          if (rsp.status === 200 && rsp.data?.id) {
            if (location.pathname == '/login') {
              navigate(data?.roles.includes('superadmin') || data?.roles.includes('advisor') ? '/dashboard' : '/')
            }
            // Token is valid to redirect to home page
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            /**
             * Token is invalid remove it from localStorage
             * and redirect to login page
             */
            localStorage.clear()
            navigate('/login')
          }
        })
    }
  }, [token])

  const hasAccess = (allowedRoles: string[] | undefined): boolean => {
    if (!allowedRoles) {
      return true
    }
    return data.roles.some((role) => allowedRoles.includes(role))
  }

  return (
    <AppProvider>
      <Routes>
        <Route path='/login' key='login' element={<Login />} />
        <Route path='/forgot-password' key='forgot' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/api' element={<h1>without login route </h1>} />

        {routes.map((route, index) => {
          return (
            <React.Fragment key={`route-${index}`}>
              {route?.component ? (
                <Route
                  path={route.path}
                  key={`${route.path}-${index}`}
                  element={
                    <PrivateRoute>
                      {route.layout === 'default' && hasAccess(route.allowedRoles) ? (
                        <DefaultLayout>{route.component}</DefaultLayout>
                      ) : route.layout === 'admin' && hasAccess(route.allowedRoles) ? (
                        <AdminLayout>{route.component}</AdminLayout>
                      ) : route.layout === 'guest' ? (
                        <GuestLayout>{route.component}</GuestLayout>
                      ) : (
                        <Navigate
                          to={data?.roles.includes('superadmin') || data?.roles.includes('advisor') ? '/dashboard' : '/'}
                          replace={true}
                        />
                      )}
                    </PrivateRoute>
                  }
                />
              ) : (
                <Route path={route.path} key={`${route.path}-${index}`}>
                  {route?.children?.map((subroute, _index) => {
                    return (
                      <Route
                        index={_index == 0 ? true : false}
                        path={`${route.path}${subroute.path}`}
                        element={
                          <PrivateRoute>
                            <AdminLayout>{subroute.component}</AdminLayout>
                          </PrivateRoute>
                        }
                        key={_index}
                      />
                    )
                  })}
                </Route>
              )}
            </React.Fragment>
          )
        })}
      </Routes>
    </AppProvider>
  )
}

export default App
