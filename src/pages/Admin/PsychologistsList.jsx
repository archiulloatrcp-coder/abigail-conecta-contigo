import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { useNotifications } from '../../app/providers/NotificationProvider.jsx'
import { listenSpecialties } from '../../services/specialties.js'
import { listenPsychologists, updatePsychologistStatus } from '../../services/psychologists.js'

function PsychologistsList() {
  const [psychologists, setPsychologists] = useState([])
  const [specialties, setSpecialties] = useState([])
  const [showInactive, setShowInactive] = useState(false)
  const [search, setSearch] = useState('')
  const { addMessage } = useNotifications()

  useEffect(() => {
    const unsubscribe = listenSpecialties(setSpecialties)
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const unsubscribe = listenPsychologists({ includeInactive: showInactive }, setPsychologists)
    return () => unsubscribe()
  }, [showInactive])

  const normalizedSearch = search.trim().toLowerCase()
  const visiblePsychologists = useMemo(() => {
    return psychologists.filter((psychologist) => {
      const matchesStatus = showInactive ? true : psychologist.status !== 'inactive'
      const fullName = `${psychologist.nombre || ''} ${psychologist.apellidos || ''}`
        .trim()
        .toLowerCase()
      const matchesSearch = normalizedSearch ? fullName.includes(normalizedSearch) : true
      return matchesStatus && matchesSearch
    })
  }, [normalizedSearch, psychologists, showInactive])

  const handleToggleStatus = async (psychologist) => {
    try {
      const nextStatus = psychologist.status === 'inactive' ? 'active' : 'inactive'
      await updatePsychologistStatus(psicologoId(psychologist), nextStatus)
      addMessage({
        type: 'success',
        text: nextStatus === 'active' ? 'Psicologo restaurado.' : 'Psicologo deshabilitado.',
      })
    } catch (error) {
      console.error('Psychologist status error', error)
      addMessage({ type: 'error', text: 'No pudimos actualizar el estado.' })
    }
  }

  const psicologoId = (psychologist) => psychologist.id

  return (
    <div className="space-y-6">
      <div className="text-xs text-[#6f6a64]">Psicologos / Listado</div>
      <div className="rounded-3xl border border-[#e6ded8] bg-white p-4 md:p-6 shadow-[0_12px_24px_rgba(61,51,45,0.12)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[#1d1b18]">Lista de Psicologos</h2>
            <p className="text-xs text-[#6f6a64]">Gestiona estados y ediciones.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-3xl border border-[#e6ded8] bg-[#f7f5f2] px-3 py-2 text-xs text-[#6f6a64]">
              <span>🔍</span>
              <input
                type="text"
                placeholder="Buscar por nombre"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-40 bg-transparent text-xs text-[#1d1b18] outline-none"
              />
            </div>
            <label className="flex items-center gap-2 text-xs text-[#6f6a64]">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(event) => setShowInactive(event.target.checked)}
                className="h-4 w-4 rounded border-[#e6ded8] text-[#b78f8f]"
              />
              Mostrar deshabilitados
            </label>
            <Link
              to="/admin/psicologos/nuevo"
              className="rounded-3xl bg-[#b78f8f] px-4 py-2 text-xs font-semibold text-white"
            >
              Nuevo Psicologo
            </Link>
          </div>
        </div>

        <div className="mt-4 overflow-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.12em] text-[#b78f8f]">
              <tr>
                <th className="pb-3">Nombre</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Especialidad</th>
                <th className="pb-3">Estado</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {visiblePsychologists.map((psychologist) => (
                <tr key={psicologoId(psychologist)} className="border-t border-[#e6ded8]">
                  <td
                    className={`py-3 font-semibold ${
                      psychologist.status === 'inactive' ? 'text-[#bfb8b2]' : 'text-[#1d1b18]'
                    }`}
                  >
                    {psychologist.nombre} {psychologist.apellidos}
                  </td>
                  <td
                    className={`py-3 ${
                      psychologist.status === 'inactive' ? 'text-[#bfb8b2]' : 'text-[#6f6a64]'
                    }`}
                  >
                    {psychologist.email}
                  </td>
                  <td
                    className={`py-3 ${
                      psychologist.status === 'inactive' ? 'text-[#bfb8b2]' : 'text-[#6f6a64]'
                    }`}
                  >
                    {specialties.find((item) => item.id === psychologist.specialtyId)?.name || 'Sin especialidad'}
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${
                        psychologist.status === 'inactive'
                          ? 'bg-[#f1f1ef] text-[#a5a19b]'
                          : 'bg-[#e7f4ef] text-[#3b6f5a]'
                      }`}
                    >
                      {psychologist.status === 'inactive' ? 'Inactivo' : 'Activo'}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/psicologos/editar/${psicologoId(psychologist)}`}
                        className="rounded-2xl border border-[#e6ded8] px-3 py-1 text-xs font-semibold text-[#1d1b18]"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleToggleStatus(psychologist)}
                        className="rounded-2xl border border-[#e6ded8] px-3 py-1 text-xs font-semibold text-[#6f6a64]"
                      >
                        {psychologist.status === 'inactive' ? 'Restaurar' : 'Deshabilitar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default PsychologistsList
