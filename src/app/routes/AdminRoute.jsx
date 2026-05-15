import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '../providers/AuthProvider.jsx'

function AdminRoute() {
  const { user, role, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4fffe] px-4 py-12 text-[#0d6e6e]">
        <div className="mx-auto w-full max-w-md rounded-3xl border border-[#d6f3f1] bg-white p-6 text-center shadow-[0_12px_24px_rgba(13,110,110,0.12)]">
          Cargando...
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role !== 'admin') {
    return <Navigate to="/client" replace />
  }

  return <Outlet />
}

export default AdminRoute
