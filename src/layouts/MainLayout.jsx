import { Link, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '../app/providers/AuthProvider.jsx'

function MainLayout() {
  const { user, role, logout } = useAuth()
  const location = useLocation()
  const showDashboardNav =
    user && location.pathname !== '/' && !location.pathname.startsWith('/admin')

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error', error)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f5f2] text-[#3f3a36]">
      {showDashboardNav ? (
        <header className="sticky top-0 z-20">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
            <div className="rounded-3xl bg-gradient-to-r from-[#c8a5a5] to-[#e7d1c9] px-4 py-2 text-sm font-semibold text-[#1d1b18] shadow-[0_12px_24px_rgba(61,51,45,0.12)]">
              Abigail Conecta Contigo
            </div>
            <nav className="flex items-center gap-2">
              <Link
                to={role === 'admin' ? '/admin' : '/client'}
                className="rounded-3xl border border-[#e6ded8] bg-white px-4 py-2 text-xs font-semibold text-[#1d1b18]"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-3xl border border-[#e6ded8] bg-white px-4 py-2 text-xs font-semibold text-[#1d1b18]"
              >
                Cerrar sesion
              </button>
            </nav>
          </div>
        </header>
      ) : null}
      <Outlet />
    </div>
  )
}

export default MainLayout
