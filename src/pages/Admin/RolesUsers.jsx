import { useEffect, useState } from 'react'

import { useNotifications } from '../../app/providers/NotificationProvider.jsx'
import { listenUsers, updateUserRole } from '../../services/users.js'

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Administrador' },
  { value: 'client', label: 'Cliente' },
  { value: 'psicologo', label: 'Psicologo' },
]

function RolesUsers() {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedRole, setSelectedRole] = useState('client')
  const { addMessage } = useNotifications()

  useEffect(() => {
    const unsubscribe = listenUsers(setUsers)
    return () => unsubscribe()
  }, [])

  const handleEdit = (user) => {
    setSelectedUser(user)
    setSelectedRole(user.role || 'client')
  }

  const handleSave = async () => {
    if (!selectedUser) return
    try {
      await updateUserRole(selectedUser.uid, selectedRole)
      addMessage({ type: 'success', text: 'Rol actualizado correctamente.' })
      setSelectedUser(null)
    } catch (error) {
      console.error('Update role error', error)
      addMessage({ type: 'error', text: 'No pudimos actualizar el rol.' })
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-xs text-[#6f6a64]">Roles y Permisos / Usuarios</div>
      <div className="rounded-3xl border border-[#e6ded8] bg-white p-4 md:p-6 shadow-[0_12px_24px_rgba(61,51,45,0.12)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[#1d1b18]">Usuarios registrados</h2>
            <p className="text-xs text-[#6f6a64]">Gestiona los roles de cada usuario.</p>
          </div>
        </div>
        <div className="mt-4 hidden overflow-auto md:block">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.12em] text-[#b78f8f]">
              <tr>
                <th className="pb-3">Nombre</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Rol</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody className="text-sm text-[#1d1b18]">
              {users.map((user) => (
                <tr key={user.uid} className="border-t border-[#e6ded8]">
                  <td className="py-3">{user.nombre || 'Sin nombre'}</td>
                  <td className="py-3 text-[#6f6a64]">{user.email}</td>
                  <td className="py-3 capitalize">{user.role || 'client'}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleEdit(user)}
                      className="rounded-2xl border border-[#e6ded8] px-3 py-1 text-xs font-semibold text-[#1d1b18]"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 space-y-3 md:hidden">
          {users.map((user) => (
            <div
              key={user.uid}
              className="rounded-3xl border border-[#e6ded8] bg-[#f7f5f2] p-4 text-sm"
            >
              <p className="text-xs uppercase tracking-[0.12em] text-[#b78f8f]">Usuario</p>
              <p className="text-sm font-semibold text-[#1d1b18]">{user.nombre || 'Sin nombre'}</p>
              <p className="text-xs text-[#6f6a64]">{user.email}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="rounded-full border border-[#e6ded8] px-3 py-1 text-xs text-[#6f6a64] capitalize">
                  {user.role || 'client'}
                </span>
                <button
                  onClick={() => handleEdit(user)}
                  className="rounded-2xl border border-[#e6ded8] px-3 py-1 text-xs font-semibold text-[#1d1b18]"
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedUser ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-md rounded-3xl border border-[#e6ded8] bg-white p-6 shadow-[0_18px_36px_rgba(61,51,45,0.2)] md:max-w-md max-w-[90%]">
            <h3 className="text-base font-semibold text-[#1d1b18]">Editar usuario</h3>
            <p className="text-xs text-[#6f6a64]">{selectedUser.email}</p>
            <label className="mt-4 block text-xs font-semibold text-[#1d1b18]">
              Rol
              <select
                value={selectedRole}
                onChange={(event) => setSelectedRole(event.target.value)}
                className="mt-2 w-full rounded-3xl border border-[#e6ded8] bg-[#f7f5f2] px-4 py-2 text-sm"
              >
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-3xl border border-[#e6ded8] px-4 py-2 text-xs font-semibold text-[#1d1b18]"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="rounded-3xl bg-[#b78f8f] px-4 py-2 text-xs font-semibold text-white"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default RolesUsers
