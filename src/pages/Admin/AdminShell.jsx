import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

import { useAuth } from '../../app/providers/AuthProvider.jsx'
import usePermission from '../../hooks/usePermission.js'

const MENU_ITEMS = [
  { label: 'Dashboard', path: '/admin', section: 'dashboard' },
  { label: 'Roles y Permisos', path: '/admin/roles/users', section: 'roles' },
  { label: 'Psicologos', path: '/admin/psicologos', section: 'staff' },
  { label: 'Especialidades', path: '/admin/especialidades', section: 'especialidades' },
  { label: 'Pacientes', path: '/admin/pacientes', section: 'pacientes' },
  { label: 'Citas (Appointments)', path: '/admin/citas/list', section: 'citas' },
  { label: 'Pagos (Payments)', path: '/admin/pagos', section: 'pagos' },
  { label: 'Calendario', path: '/admin/calendario', section: 'calendar' },
  { label: 'Configuracion', path: '/admin/configuracion', section: 'settings' },
]

function AdminShell() {
  const { user, logout, role } = useAuth()
  const location = useLocation()
  const [profileOpen, setProfileOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const profileRef = useRef(null)
  const sidebarRef = useRef(null)

  const canViewDashboard = usePermission('dashboard', 'canView')
  const canViewStaff = usePermission('staff', 'canView')
  const canViewEspecialidades = usePermission('especialidades', 'canView')
  const canViewPacientes = usePermission('pacientes', 'canView')
  const canViewCitas = usePermission('citas', 'canView')
  const canViewPagos = usePermission('pagos', 'canView')

  const permissionsMap = {
    dashboard: canViewDashboard,
    roles: role === 'admin',
    staff: canViewStaff,
    especialidades: canViewEspecialidades,
    pacientes: canViewPacientes,
    citas: canViewCitas,
    pagos: canViewPagos,
    calendar: role === 'admin',
    settings: role === 'admin',
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false)
      }
    }

    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [profileOpen])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false)
      }
    }

    if (sidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [sidebarOpen])

  const handleLogout = async () => {
    try {
      await logout()
      setProfileOpen(false)
    } catch (error) {
      console.error('Logout error', error)
    }
  }

  const filteredMenu = MENU_ITEMS.filter((item) => permissionsMap[item.section])

  return (
    <div className="min-h-screen bg-[#f7f5f2] text-[#1d1b18]">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 flex-col border-r border-[#e6ded8] bg-white px-4 py-6 md:flex">
          <div className="flex items-center gap-2 px-2">
            <span className="h-8 w-8 rounded-2xl bg-gradient-to-br from-[#c8a5a5] to-[#e7d1c9]"></span>
            <div>
              <p className="text-sm font-semibold text-[#1d1b18]">Abigail Conecta</p>
              <p className="text-[11px] text-[#6f6a64]">Panel administrador</p>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b78f8f]">
              Main
            </p>
            <nav className="space-y-2 text-sm text-[#1d1b18]">
              {filteredMenu.map((item) => (
                <div key={item.label} className="space-y-2">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center justify-between rounded-3xl px-3 py-2 text-sm font-medium ${
                        isActive
                          ? 'bg-[#f1e7e3] text-[#1d1b18]'
                          : 'text-[#1d1b18]'
                      }`
                    }
                  >
                    <span>{item.label}</span>
                    {item.label === 'Roles y Permisos' || item.label.includes('Citas') || item.label === 'Psicologos' ? (
                      <span className="text-xs text-[#b78f8f]">▾</span>
                    ) : null}
                  </NavLink>
                  {item.label === 'Roles y Permisos' ? (
                    <div className="space-y-1 pl-4 text-xs text-[#6f6a64]">
                      <NavLink
                        to="/admin/roles/users"
                        className={({ isActive }) =>
                          `block rounded-2xl px-3 py-2 ${
                            isActive ? 'bg-[#f1e7e3] text-[#1d1b18]' : ''
                          }`
                        }
                      >
                        Usuarios
                      </NavLink>
                      <NavLink
                        to="/admin/roles/permissions"
                        className={({ isActive }) =>
                          `block rounded-2xl px-3 py-2 ${
                            isActive ? 'bg-[#f1e7e3] text-[#1d1b18]' : ''
                          }`
                        }
                      >
                        Permisos
                      </NavLink>
                    </div>
                  ) : null}
                  {item.label === 'Pacientes' ? (
                    <div className="space-y-1 pl-4 text-xs text-[#6f6a64]">
                      <div className="rounded-2xl px-3 py-2">Listado</div>
                    </div>
                  ) : null}
                  {item.label === 'Psicologos' ? (
                    <div className="space-y-1 pl-4 text-xs text-[#6f6a64]">
                      <NavLink
                        to="/admin/psicologos"
                        className={({ isActive }) =>
                          `block rounded-2xl px-3 py-2 ${
                            isActive ? 'bg-[#f1e7e3] text-[#1d1b18]' : ''
                          }`
                        }
                      >
                        Listado
                      </NavLink>
                      <NavLink
                        to="/admin/psicologos/nuevo"
                        className={({ isActive }) =>
                          `block rounded-2xl px-3 py-2 ${
                            isActive ? 'bg-[#f1e7e3] text-[#1d1b18]' : ''
                          }`
                        }
                      >
                        Nuevo
                      </NavLink>
                    </div>
                  ) : null}
                  {item.label.includes('Citas') ? (
                    <div className="space-y-1 pl-4 text-xs text-[#6f6a64]">
                      <div className="rounded-2xl px-3 py-2">Register</div>
                      <div className="rounded-2xl px-3 py-2">List</div>
                    </div>
                  ) : null}
                </div>
              ))}
            </nav>
          </div>
          <div className="mt-auto px-2 pt-6">
            <button
              onClick={handleLogout}
              className="w-full rounded-3xl border border-[#e6ded8] px-3 py-2 text-xs font-semibold text-[#1d1b18]"
            >
              Logout
            </button>
          </div>
        </aside>

        {sidebarOpen ? (
          <div className="fixed inset-0 z-30 bg-black/30 md:hidden" />
        ) : null}
        <aside
          ref={sidebarRef}
          className={`fixed left-0 top-0 z-40 h-full w-72 transform border-r border-[#e6ded8] bg-white px-4 py-6 shadow-[0_18px_36px_rgba(61,51,45,0.2)] transition-transform duration-200 md:hidden ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-2xl bg-gradient-to-br from-[#c8a5a5] to-[#e7d1c9]"></span>
              <div>
                <p className="text-sm font-semibold text-[#1d1b18]">Abigail Conecta</p>
                <p className="text-[11px] text-[#6f6a64]">Panel administrador</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-2xl border border-[#e6ded8] px-2 py-1 text-xs"
            >
              Cerrar
            </button>
          </div>
          <div className="mt-6 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b78f8f]">
              Main
            </p>
            <nav className="space-y-2 text-sm text-[#1d1b18]">
              {filteredMenu.map((item) => (
                <div key={item.label} className="space-y-2">
                  <NavLink
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between rounded-3xl px-3 py-2 text-sm font-medium ${
                        isActive
                          ? 'bg-[#f1e7e3] text-[#1d1b18]'
                          : 'text-[#1d1b18]'
                      }`
                    }
                  >
                    <span>{item.label}</span>
                    {item.label === 'Roles y Permisos' || item.label.includes('Citas') || item.label === 'Psicologos' ? (
                      <span className="text-xs text-[#b78f8f]">▾</span>
                    ) : null}
                  </NavLink>
                  {item.label === 'Roles y Permisos' ? (
                    <div className="space-y-1 pl-4 text-xs text-[#6f6a64]">
                      <NavLink
                        to="/admin/roles/users"
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                          `block rounded-2xl px-3 py-2 ${
                            isActive ? 'bg-[#f1e7e3] text-[#1d1b18]' : ''
                          }`
                        }
                      >
                        Usuarios
                      </NavLink>
                      <NavLink
                        to="/admin/roles/permissions"
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                          `block rounded-2xl px-3 py-2 ${
                            isActive ? 'bg-[#f1e7e3] text-[#1d1b18]' : ''
                          }`
                        }
                      >
                        Permisos
                      </NavLink>
                    </div>
                  ) : null}
                  {item.label === 'Pacientes' ? (
                    <div className="space-y-1 pl-4 text-xs text-[#6f6a64]">
                      <div className="rounded-2xl px-3 py-2">Listado</div>
                    </div>
                  ) : null}
                  {item.label === 'Psicologos' ? (
                    <div className="space-y-1 pl-4 text-xs text-[#6f6a64]">
                      <NavLink
                        to="/admin/psicologos"
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                          `block rounded-2xl px-3 py-2 ${
                            isActive ? 'bg-[#f1e7e3] text-[#1d1b18]' : ''
                          }`
                        }
                      >
                        Listado
                      </NavLink>
                      <NavLink
                        to="/admin/psicologos/nuevo"
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                          `block rounded-2xl px-3 py-2 ${
                            isActive ? 'bg-[#f1e7e3] text-[#1d1b18]' : ''
                          }`
                        }
                      >
                        Nuevo
                      </NavLink>
                    </div>
                  ) : null}
                  {item.label.includes('Citas') ? (
                    <div className="space-y-1 pl-4 text-xs text-[#6f6a64]">
                      <div className="rounded-2xl px-3 py-2">Register</div>
                      <div className="rounded-2xl px-3 py-2">List</div>
                    </div>
                  ) : null}
                </div>
              ))}
            </nav>
          </div>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-[#e6ded8] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="rounded-2xl border border-[#e6ded8] px-3 py-2 text-xs font-semibold text-[#1d1b18] md:hidden"
                >
                  Menu
                </button>
                <div className="hidden items-center gap-2 lg:flex">
                  <span className="h-8 w-8 rounded-2xl bg-gradient-to-br from-[#c8a5a5] to-[#e7d1c9]"></span>
                  <p className="text-sm font-semibold">Abigail Conecta</p>
                </div>
              </div>
              <div className="flex-1 max-w-xl">
                <div className="flex items-center gap-2 rounded-3xl border border-[#e6ded8] bg-[#f7f5f2] px-4 py-2 text-sm text-[#6f6a64]">
                  <span>🔍</span>
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="w-full bg-transparent text-sm text-[#1d1b18] outline-none"
                  />
                </div>
              </div>
              <div ref={profileRef} className="relative flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {user?.displayName || user?.email || 'Usuario'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e6ded8] bg-[#f7f5f2] text-xs font-semibold text-[#1d1b18]"
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                >
                  AM
                </button>
                {profileOpen ? (
                  <div className="absolute right-0 top-12 w-48 rounded-3xl border border-[#e6ded8] bg-white p-3 text-sm text-[#1d1b18] shadow-[0_12px_24px_rgba(61,51,45,0.12)]">
                    <div className="border-b border-[#e6ded8] pb-2">
                      <p className="text-xs text-[#6f6a64]">Perfil</p>
                      <p className="text-sm font-semibold">{user?.email}</p>
                    </div>
                    <Link
                      to={location.pathname}
                      className="mt-2 block w-full rounded-2xl px-3 py-2 text-left text-xs text-[#6f6a64]"
                    >
                      Ver perfil
                    </Link>
                    <Link
                      to={location.pathname}
                      className="mt-1 block w-full rounded-2xl px-3 py-2 text-left text-xs text-[#6f6a64]"
                    >
                      Configuracion
                    </Link>
                    <button
                      type="button"
                      className="mt-2 w-full rounded-2xl border border-[#e6ded8] px-3 py-2 text-left text-xs font-semibold text-[#1d1b18]"
                      onClick={handleLogout}
                    >
                      Cerrar sesion
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </header>

          <main className="flex-1 px-6 py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default AdminShell
