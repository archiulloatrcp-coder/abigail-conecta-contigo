import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '../providers/AuthProvider.jsx'

function ClientRoute() {
  const { user, role, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5f2] px-4 py-12 text-[#1d1b18]">
        <div className="mx-auto w-full max-w-md rounded-3xl border border-[#e6ded8] bg-white p-6 text-center shadow-[0_12px_24px_rgba(61,51,45,0.12)]">
          Cargando...
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role === 'admin') {
    return <Navigate to="/admin" replace />
  }

  return <Outlet />
}

export default ClientRoute
