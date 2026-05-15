import { useMemo, useState } from 'react'

import { useNotifications } from '../../app/providers/NotificationProvider.jsx'
import { DEFAULT_ROLE_PERMISSIONS, listenRoles, upsertRole } from '../../services/roles.js'

const SECTIONS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'staff', label: 'Staff' },
  { id: 'especialidades', label: 'Especialidades' },
  { id: 'pacientes', label: 'Pacientes' },
  { id: 'citas', label: 'Citas' },
  { id: 'pagos', label: 'Pagos' },
]

const ACTIONS = [
  { id: 'canView', label: 'Listado' },
  { id: 'canAdd', label: 'Anadir' },
  { id: 'canEdit', label: 'Editar' },
  { id: 'canDelete', label: 'Eliminar' },
]

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Administrador' },
  { value: 'client', label: 'Cliente' },
  { value: 'psicologo', label: 'Psicologo' },
]

const buildRoleConfig = (roleId, roleDoc) => {
  const fallback = DEFAULT_ROLE_PERMISSIONS[roleId]
  return {
    id: roleId,
    name: roleDoc?.name || fallback?.name || roleId,
    permissions: roleDoc?.permissions || fallback?.permissions || {},
  }
}

function RolesPermissions() {
  const [roles, setRoles] = useState([])
  const [selectedRole, setSelectedRole] = useState('psicologo')
  const { addMessage } = useNotifications()

  useMemo(() => listenRoles(setRoles), [])

  const roleMap = useMemo(() => {
    const map = {}
    roles.forEach((roleDoc) => {
      map[roleDoc.id] = roleDoc
    })
    return map
  }, [roles])

  const currentRole = buildRoleConfig(selectedRole, roleMap[selectedRole])

  const handleToggle = (sectionId, actionId) => {
    const nextPermissions = {
      ...currentRole.permissions,
      [sectionId]: {
        ...currentRole.permissions[sectionId],
        [actionId]: !currentRole.permissions?.[sectionId]?.[actionId],
      },
    }

    upsertRole(selectedRole, {
      name: currentRole.name,
      permissions: nextPermissions,
    }).catch((error) => {
      console.error('Update permissions error', error)
      addMessage({ type: 'error', text: 'No pudimos actualizar los permisos.' })
    })
  }

  const handleSaveRoleName = async () => {
    try {
      await upsertRole(selectedRole, {
        name: currentRole.name,
        permissions: currentRole.permissions,
      })
      addMessage({ type: 'success', text: 'Permisos actualizados.' })
    } catch (error) {
      console.error('Save role error', error)
      addMessage({ type: 'error', text: 'No pudimos guardar los permisos.' })
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-xs text-[#6f6a64]">Roles y Permisos / Edicion</div>
      <div className="rounded-3xl border border-[#e6ded8] bg-white p-4 md:p-6 shadow-[0_12px_24px_rgba(61,51,45,0.12)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[#1d1b18]">Editar Rol</h2>
            <p className="text-xs text-[#6f6a64]">Gestiona los permisos por seccion.</p>
          </div>
          <select
            value={selectedRole}
            onChange={(event) => setSelectedRole(event.target.value)}
            className="rounded-3xl border border-[#e6ded8] bg-[#f7f5f2] px-4 py-2 text-sm"
          >
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4 rounded-3xl border border-[#e6ded8] bg-[#f7f5f2] p-4">
          <label className="text-xs font-semibold text-[#1d1b18]">
            Nombre
            <input
              type="text"
              value={currentRole.name}
              onChange={(event) =>
                upsertRole(selectedRole, {
                  name: event.target.value,
                  permissions: currentRole.permissions,
                })
              }
              className="mt-2 w-full rounded-3xl border border-[#e6ded8] bg-white px-4 py-2 text-sm"
            />
          </label>
        </div>
      </div>

      <div className="rounded-3xl border border-[#e6ded8] bg-white p-4 md:p-6 shadow-[0_12px_24px_rgba(61,51,45,0.12)]">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-[#1d1b18]">Asignacion de Permisos</h3>
          <button
            onClick={handleSaveRoleName}
            className="rounded-3xl bg-[#b78f8f] px-4 py-2 text-xs font-semibold text-white"
          >
            Guardar
          </button>
        </div>
        <div className="mt-4 hidden overflow-auto md:block">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.12em] text-[#b78f8f]">
              <tr>
                <th className="pb-3">Seccion</th>
                <th className="pb-3">Permisos</th>
              </tr>
            </thead>
            <tbody>
              {SECTIONS.map((section) => (
                <tr key={section.id} className="border-t border-[#e6ded8]">
                  <td className="py-4 font-semibold text-[#1d1b18]">{section.label}</td>
                  <td className="py-4">
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      {ACTIONS.map((action) => (
                        <label key={action.id} className="flex items-center gap-2 text-xs text-[#6f6a64]">
                          <input
                            type="checkbox"
                            checked={Boolean(currentRole.permissions?.[section.id]?.[action.id])}
                            onChange={() => handleToggle(section.id, action.id)}
                            className="h-4 w-4 rounded border-[#e6ded8] text-[#b78f8f]"
                          />
                          {action.label}
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 space-y-4 md:hidden">
          {SECTIONS.map((section) => (
            <div key={section.id} className="rounded-3xl border border-[#e6ded8] bg-[#f7f5f2] p-4">
              <p className="text-sm font-semibold text-[#1d1b18]">{section.label}</p>
              <div className="mt-3 grid gap-2">
                {ACTIONS.map((action) => (
                  <label key={action.id} className="flex items-center gap-2 text-xs text-[#6f6a64]">
                    <input
                      type="checkbox"
                      checked={Boolean(currentRole.permissions?.[section.id]?.[action.id])}
                      onChange={() => handleToggle(section.id, action.id)}
                      className="h-4 w-4 rounded border-[#e6ded8] text-[#b78f8f]"
                    />
                    {action.label}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RolesPermissions
