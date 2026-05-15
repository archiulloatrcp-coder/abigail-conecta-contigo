import { useEffect, useMemo, useState } from 'react'

import { useNotifications } from '../../app/providers/NotificationProvider.jsx'
import { createSecondaryAccount, cleanupSecondaryAccount, signOutSecondary } from '../../services/auth.js'
import {
  createPatientProfile,
  listenPatients,
  updatePatientProfile,
  updatePatientStatus,
} from '../../services/patients.js'
import { createUserProfile, listenUsersByRole, updateUserProfile } from '../../services/users.js'

const DEFAULT_FORM = {
  nombre: '',
  apellidos: '',
  email: '',
  telefono: '',
  clinicalStatus: 'active',
}

const generateTempPassword = () => `Abigail-${Math.random().toString(36).slice(2, 8)}!`

function Patients() {
  const [patients, setPatients] = useState([])
  const [users, setUsers] = useState([])
  const [showInactive, setShowInactive] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(DEFAULT_FORM)
  const { addMessage } = useNotifications()

  useEffect(() => {
    const unsubscribe = listenPatients({ includeInactive: showInactive }, setPatients)
    return () => unsubscribe()
  }, [showInactive])

  useEffect(() => {
    const unsubscribe = listenUsersByRole('client', setUsers)
    return () => unsubscribe()
  }, [])

  const usersMap = useMemo(() => {
    const map = new Map()
    users.forEach((user) => map.set(user.uid, user))
    return map
  }, [users])

  const openModal = (patient) => {
    if (patient) {
      setEditingId(patient.id)
      setFormData({
        nombre: patient.nombre || '',
        apellidos: patient.apellidos || '',
        email: patient.email || '',
        telefono: patient.telefono || '',
        clinicalStatus: patient.clinicalStatus || 'active',
      })
    } else {
      setEditingId(null)
      setFormData(DEFAULT_FORM)
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
    setFormData(DEFAULT_FORM)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const existingUser = users.find((user) => user.email === formData.email)
      let userId = existingUser?.uid
      let accountStatus = existingUser ? 'active' : 'pending'

      if (!existingUser) {
        const tempPassword = generateTempPassword()
        const secondary = await createSecondaryAccount(formData.email, tempPassword)

        try {
          await createUserProfile({
            uid: secondary.user.uid,
            email: formData.email,
            nombre: formData.nombre,
            apellidos: formData.apellidos,
            telefono: formData.telefono,
            role: 'client',
          })
          await signOutSecondary(secondary.auth)
          userId = secondary.user.uid
          addMessage({
            type: 'success',
            text: `Paciente creado. Contrasena temporal: ${tempPassword}`,
          })
        } catch (error) {
          await cleanupSecondaryAccount(secondary)
          throw error
        }
      } else {
        await updateUserProfile(existingUser.uid, {
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          telefono: formData.telefono,
        })
      }

      if (editingId) {
        await updatePatientProfile(editingId, {
          ...formData,
          userId,
          accountStatus,
        })
        addMessage({ type: 'success', text: 'Paciente actualizado.' })
      } else {
        await createPatientProfile({
          ...formData,
          userId,
          accountStatus,
        })
        if (existingUser) {
          addMessage({ type: 'success', text: 'Paciente creado y vinculado.' })
        }
      }

      closeModal()
    } catch (error) {
      console.error('Patient save error', error)
      addMessage({ type: 'error', text: 'No pudimos guardar el paciente.' })
    }
  }

  const handleToggleStatus = async (patient) => {
    try {
      const nextStatus = patient.status === 'inactive' ? 'active' : 'inactive'
      await updatePatientStatus(patient.id, nextStatus)
      addMessage({
        type: 'success',
        text: nextStatus === 'active' ? 'Paciente restaurado.' : 'Paciente deshabilitado.',
      })
    } catch (error) {
      console.error('Patient status error', error)
      addMessage({ type: 'error', text: 'No pudimos actualizar el estado.' })
    }
  }

  const handleInvite = async (email) => {
    if (navigator?.clipboard) {
      await navigator.clipboard.writeText(email)
      addMessage({ type: 'success', text: 'Email copiado. Envia invitacion manual.' })
    } else {
      addMessage({ type: 'info', text: 'Copia el email para enviar invitacion.' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-xs text-[#6f6a64]">Pacientes</div>
      <div className="rounded-3xl border border-[#e6ded8] bg-white p-4 md:p-6 shadow-[0_12px_24px_rgba(61,51,45,0.12)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[#1d1b18]">Lista de Pacientes</h2>
            <p className="text-xs text-[#6f6a64]">Gestiona fichas y estado de cuentas.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-[#6f6a64]">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(event) => setShowInactive(event.target.checked)}
                className="h-4 w-4 rounded border-[#e6ded8] text-[#b78f8f]"
              />
              Mostrar deshabilitados
            </label>
            <button
              onClick={() => openModal()}
              className="rounded-3xl bg-[#b78f8f] px-4 py-2 text-xs font-semibold text-white"
            >
              Nuevo Paciente
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.12em] text-[#b78f8f]">
              <tr>
                <th className="pb-3">Nombre Completo</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Telefono</th>
                <th className="pb-3">Cuenta</th>
                <th className="pb-3">Estado Clinico</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => {
                const user = usersMap.get(patient.userId)
                const accountActive = user ? 'Activa' : 'Pendiente'
                return (
                  <tr key={patient.id} className="border-t border-[#e6ded8]">
                    <td
                      className={`py-3 font-semibold ${
                        patient.status === 'inactive' ? 'text-[#bfb8b2]' : 'text-[#1d1b18]'
                      }`}
                    >
                      {patient.nombre} {patient.apellidos}
                    </td>
                    <td className={`py-3 ${patient.status === 'inactive' ? 'text-[#bfb8b2]' : 'text-[#6f6a64]'}`}>
                      {patient.email}
                    </td>
                    <td className={`py-3 ${patient.status === 'inactive' ? 'text-[#bfb8b2]' : 'text-[#6f6a64]'}`}>
                      {user?.telefono || patient.telefono || '—'}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${
                          accountActive === 'Activa'
                            ? 'bg-[#e7f4ef] text-[#3b6f5a]'
                            : 'bg-[#f7efe7] text-[#8a6d57]'
                        }`}
                      >
                        {accountActive}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${
                          patient.clinicalStatus === 'inactive'
                            ? 'bg-[#f1f1ef] text-[#a5a19b]'
                            : 'bg-[#e7f4ef] text-[#3b6f5a]'
                        }`}
                      >
                        {patient.clinicalStatus === 'inactive' ? 'Inactivo' : 'Activo'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openModal(patient)}
                          className="rounded-2xl border border-[#e6ded8] px-3 py-1 text-xs font-semibold text-[#1d1b18]"
                        >
                          Editar
                        </button>
                        {accountActive !== 'Activa' ? (
                          <button
                            onClick={() => handleInvite(patient.email)}
                            className="rounded-2xl border border-[#e6ded8] px-3 py-1 text-xs font-semibold text-[#6f6a64]"
                          >
                            Enviar invitacion
                          </button>
                        ) : null}
                        <button
                          onClick={() => handleToggleStatus(patient)}
                          className="rounded-2xl border border-[#e6ded8] px-3 py-1 text-xs font-semibold text-[#6f6a64]"
                        >
                          {patient.status === 'inactive' ? 'Restaurar' : 'Deshabilitar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4">
          <div className="w-[90%] max-w-md rounded-3xl border border-[#e6ded8] bg-white p-6 shadow-[0_18px_36px_rgba(61,51,45,0.2)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-[#1d1b18]">
                  {editingId ? 'Editar Paciente' : 'Nuevo Paciente'}
                </h3>
                <p className="text-xs text-[#6f6a64]">Completa los datos.</p>
              </div>
              <button
                onClick={closeModal}
                className="rounded-2xl border border-[#e6ded8] px-2 py-1 text-xs"
              >
                Cerrar
              </button>
            </div>
            <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
              {[
                { label: 'Nombre', key: 'nombre' },
                { label: 'Apellidos', key: 'apellidos' },
                { label: 'Email', key: 'email', type: 'email' },
                { label: 'Telefono', key: 'telefono' },
              ].map((field) => (
                <label key={field.key} className="text-xs font-semibold text-[#1d1b18]">
                  {field.label}
                  <input
                    type={field.type || 'text'}
                    value={formData[field.key]}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, [field.key]: event.target.value }))
                    }
                    className="mt-2 w-full rounded-3xl border border-[#e6ded8] bg-[#f7f5f2] px-4 py-2 text-sm"
                    required
                    disabled={editingId && field.key === 'email'}
                  />
                </label>
              ))}
              <label className="text-xs font-semibold text-[#1d1b18]">
                Estado clinico
                <select
                  value={formData.clinicalStatus}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, clinicalStatus: event.target.value }))
                  }
                  className="mt-2 w-full rounded-3xl border border-[#e6ded8] bg-[#f7f5f2] px-4 py-2 text-sm"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-3xl border border-[#e6ded8] px-4 py-2 text-xs font-semibold text-[#1d1b18]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-3xl bg-[#b78f8f] px-4 py-2 text-xs font-semibold text-white"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Patients
