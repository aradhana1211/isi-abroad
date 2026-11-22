import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getToken } from 'CommonJS/common'

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [token] = useState(getToken())

  useEffect(() => {
    if (!token) {
      navigate('/login', {
        state: { from: location },
        replace: true
      })
    }
  }, [navigate, location])

  return token ? children : null
}

export default PrivateRoute
