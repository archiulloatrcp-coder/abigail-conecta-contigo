import { useEffect, useState } from 'react'

import { useNotifications } from '../../app/providers/NotificationProvider.jsx'
import { createSpecialty, listenSpecialties, updateSpecialty } from '../../services/specialties.js'

const DEFAULT_FORM = { name: '', description: '' }

function Specialties() {
  const [specialties, setSpecialties] = useState([])
  const [showInactive, setShowInactive] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(DEFAULT_FORM)
  const { addMessage } = useNotifications()

  useEffect(() => {
    const unsubscribe = listenSpecialties(setSpecialties)
    return () => unsubscribe()
  }, [])

  const openModal = (specialty) => {
    if (specialty) {
      setEditingId(specialty.id)
      setFormData({ name: specialty.name || '', description: specialty.description || '' })
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
      if (editingId) {
        await updateSpecialty(editingId, formData)
        addMessage({ type: 'success', text: 'Especialidad actualizada.' })
      } else {
        await createSpecialty(formData)
        addMessage({ type: 'success', text: 'Especialidad creada.' })
      }
      closeModal()
    } catch (error) {
      console.error('Specialty save error', error)
      addMessage({ type: 'error', text: 'No pudimos guardar la especialidad.' })
    }
  }

  const handleToggleStatus = async (specialty) => {
    try {
      const nextStatus = specialty.status === 'inactive' ? 'active' : 'inactive'
      await updateSpecialty(specialty.id, { status: nextStatus })
      addMessage({
        type: 'success',
        text: nextStatus === 'active' ? 'Especialidad restaurada.' : 'Especialidad deshabilitada.',
      })
    } catch (error) {
      console.error('Specialty status error', error)
      addMessage({ type: 'error', text: 'No pudimos actualizar el estado.' })
    }
  }

  const visibleSpecialties = specialties.filter((specialty) =>
    showInactive ? true : specialty.status !== 'inactive',
  )

  return (
    <div className="space-y-6">
      <div className="text-xs text-[#6f6a64]">Especialidades</div>

      <div className="rounded-3xl border border-[#e6ded8] bg-white p-4 md:p-6 shadow-[0_12px_24px_rgba(61,51,45,0.12)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[#1d1b18]">Gestion de Especialidades</h2>
            <p className="text-xs text-[#6f6a64]">Administra las especialidades del panel.</p>
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
              Nueva Especialidad
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.12em] text-[#b78f8f]">
              <tr>
                <th className="pb-3">Especialidad</th>
                <th className="pb-3">Descripcion</th>
                <th className="pb-3">Estado</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {visibleSpecialties.map((specialty) => (
                <tr key={specialty.id} className="border-t border-[#e6ded8]">
                  <td
                    className={`py-3 font-semibold ${
                      specialty.status === 'inactive' ? 'text-[#bfb8b2]' : 'text-[#1d1b18]'
                    }`}
                  >
                    {specialty.name}
                  </td>
                  <td
                    className={`py-3 ${
                      specialty.status === 'inactive' ? 'text-[#bfb8b2]' : 'text-[#6f6a64]'
                    }`}
                  >
                    {specialty.description}
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${
                        specialty.status === 'inactive'
                          ? 'bg-[#f1f1ef] text-[#a5a19b]'
                          : 'bg-[#e7f4ef] text-[#3b6f5a]'
                      }`}
                    >
                      {specialty.status === 'inactive' ? 'Inactivo' : 'Activo'}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openModal(specialty)}
                        className="rounded-2xl border border-[#e6ded8] px-3 py-1 text-xs font-semibold text-[#1d1b18]"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleToggleStatus(specialty)}
                        className="rounded-2xl border border-[#e6ded8] px-3 py-1 text-xs font-semibold text-[#6f6a64]"
                      >
                        {specialty.status === 'inactive' ? 'Restaurar' : 'Deshabilitar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
                  {editingId ? 'Editar Especialidad' : 'Nueva Especialidad'}
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
              <label className="text-xs font-semibold text-[#1d1b18]">
                Nombre
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, name: event.target.value }))
                  }
                  className="mt-2 w-full rounded-3xl border border-[#e6ded8] bg-[#f7f5f2] px-4 py-2 text-sm"
                  required
                />
              </label>
              <label className="text-xs font-semibold text-[#1d1b18]">
                Descripcion
                <input
                  type="text"
                  value={formData.description}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, description: event.target.value }))
                  }
                  className="mt-2 w-full rounded-3xl border border-[#e6ded8] bg-[#f7f5f2] px-4 py-2 text-sm"
                  required
                />
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

export default Specialties
