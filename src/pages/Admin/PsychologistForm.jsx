import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { useNotifications } from '../../app/providers/NotificationProvider.jsx'
import { cleanupSecondaryAccount, createSecondaryAccount, signOutSecondary } from '../../services/auth.js'
import { listenSpecialties } from '../../services/specialties.js'
import {
  createPsychologistProfile,
  getPsychologistById,
  updatePsychologistProfile,
} from '../../services/psychologists.js'
import { createUserProfile } from '../../services/users.js'

const DEFAULT_FORM = {
  nombre: '',
  apellidos: '',
  telefono: '',
  email: '',
  password: '',
  fechaNacimiento: '',
  genero: '',
  educacion: '',
  designacion: '',
  specialtyId: '',
}

const DAYS = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']

const buildSlots = (start, end, stepMinutes) => {
  const slots = []
  let current = start
  while (current <= end) {
    const hour = String(Math.floor(current / 60)).padStart(2, '0')
    const minute = String(current % 60).padStart(2, '0')
    slots.push(`${hour}:${minute}`)
    current += stepMinutes
  }
  return slots
}

const FREE_SLOTS = buildSlots(8 * 60, 21 * 60, 15)
const THERAPY_SLOTS = buildSlots(8 * 60, 20 * 60, 60)

function PsychologistForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState(DEFAULT_FORM)
  const [specialties, setSpecialties] = useState([])
  const [freeAvailability, setFreeAvailability] = useState({})
  const [therapyAvailability, setTherapyAvailability] = useState({})
  const { addMessage } = useNotifications()

  useEffect(() => {
    const unsubscribe = listenSpecialties(setSpecialties)
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!id) return
    const load = async () => {
      try {
        const psychologist = await getPsychologistById(id)
        if (!psychologist) return
        setFormData({
          nombre: psychologist.nombre || '',
          apellidos: psychologist.apellidos || '',
          telefono: psychologist.telefono || '',
          email: psychologist.email || '',
          password: '',
          fechaNacimiento: psychologist.fechaNacimiento || '',
          genero: psychologist.genero || '',
          educacion: psychologist.educacion || '',
          designacion: psychologist.designacion || '',
          specialtyId: psychologist.specialtyId || '',
        })
        setFreeAvailability(psychologist.availability?.entrevista || {})
        setTherapyAvailability(psychologist.availability?.terapia || {})
      } catch (error) {
        console.error('Load psychologist error', error)
      }
    }
    load()
  }, [id])

  const dayKeys = useMemo(() => DAYS.map((day) => day.toLowerCase()), [])

  const toggleAvailability = (type, day, slot) => {
    const setter = type === 'free' ? setFreeAvailability : setTherapyAvailability
    setter((prev) => {
      const daySlots = new Set(prev[day] || [])
      if (daySlots.has(slot)) {
        daySlots.delete(slot)
      } else {
        daySlots.add(slot)
      }
      return { ...prev, [day]: Array.from(daySlots) }
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const { password, ...rest } = formData
      const payload = {
        ...rest,
        availability: {
          entrevista: freeAvailability,
          terapia: therapyAvailability,
        },
      }

      if (id) {
        await updatePsychologistProfile(id, payload)
        addMessage({ type: 'success', text: 'Psicologo actualizado correctamente.' })
      } else {
        const secondary = await createSecondaryAccount(formData.email, formData.password)

        try {
          await createUserProfile({
            uid: secondary.user.uid,
            email: formData.email,
            nombre: formData.nombre,
            role: 'psicologo',
          })

          await createPsychologistProfile({
            userId: secondary.user.uid,
            email: formData.email,
            nombre: formData.nombre,
            apellidos: formData.apellidos,
            telefono: formData.telefono,
            fechaNacimiento: formData.fechaNacimiento,
            genero: formData.genero,
            educacion: formData.educacion,
            designacion: formData.designacion,
            specialtyId: formData.specialtyId,
            availability: {
              entrevista: freeAvailability,
              terapia: therapyAvailability,
            },
          })

          await signOutSecondary(secondary.auth)
          addMessage({ type: 'success', text: 'Psicologo registrado correctamente.' })
        } catch (error) {
          await cleanupSecondaryAccount(secondary)
          throw error
        }
      }

      navigate('/admin/psicologos')
    } catch (error) {
      console.error('Save psychologist error', error)
      addMessage({ type: 'error', text: 'No pudimos guardar el psicologo.' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-[#6f6a64]">Psicologos / {id ? 'Editar' : 'Nuevo'}</p>
          <h2 className="text-base font-semibold text-[#1d1b18]">
            {id ? 'Editar Psicologo' : 'Registrar Psicologo'}
          </h2>
        </div>
        <Link
          to="/admin/psicologos"
          className="rounded-3xl border border-[#e6ded8] px-4 py-2 text-xs font-semibold text-[#1d1b18]"
        >
          Volver al listado
        </Link>
      </div>

      <form
        className="rounded-3xl border border-[#e6ded8] bg-white p-4 md:p-6 shadow-[0_12px_24px_rgba(61,51,45,0.12)]"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-[#1d1b18]">Datos personales</h3>
            <div className="grid gap-3">
              {[
                { label: 'Nombre', key: 'nombre' },
                { label: 'Apellidos', key: 'apellidos' },
                { label: 'Telefono', key: 'telefono' },
                { label: 'Email', key: 'email', type: 'email' },
                ...(id ? [] : [{ label: 'Contrasena', key: 'password', type: 'password' }]),
                { label: 'Fecha de Nacimiento', key: 'fechaNacimiento', type: 'date' },
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
                  />
                </label>
              ))}
              <label className="text-xs font-semibold text-[#1d1b18]">
                Genero
                <select
                  value={formData.genero}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, genero: event.target.value }))
                  }
                  className="mt-2 w-full rounded-3xl border border-[#e6ded8] bg-[#f7f5f2] px-4 py-2 text-sm"
                  required
                >
                  <option value="">Selecciona</option>
                  <option value="femenino">Femenino</option>
                  <option value="masculino">Masculino</option>
                  <option value="otro">Otro</option>
                </select>
              </label>
              <label className="text-xs font-semibold text-[#1d1b18]">
                Educacion
                <input
                  type="text"
                  value={formData.educacion}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, educacion: event.target.value }))
                  }
                  className="mt-2 w-full rounded-3xl border border-[#e6ded8] bg-[#f7f5f2] px-4 py-2 text-sm"
                  required
                />
              </label>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-[#1d1b18]">Datos profesionales</h3>
            <div className="grid gap-3">
              <label className="text-xs font-semibold text-[#1d1b18]">
                Designacion
                <input
                  type="text"
                  value={formData.designacion}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, designacion: event.target.value }))
                  }
                  className="mt-2 w-full rounded-3xl border border-[#e6ded8] bg-[#f7f5f2] px-4 py-2 text-sm"
                  required
                />
              </label>
              <label className="text-xs font-semibold text-[#1d1b18]">
                Especialidad
                <select
                  value={formData.specialtyId}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, specialtyId: event.target.value }))
                  }
                  className="mt-2 w-full rounded-3xl border border-[#e6ded8] bg-[#f7f5f2] px-4 py-2 text-sm"
                  required
                >
                  <option value="">Selecciona especialidad</option>
                  {specialties.map((specialty) => (
                    <option key={specialty.id} value={specialty.id}>
                      {specialty.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="rounded-3xl border border-[#e6ded8] bg-[#f7f5f2] p-4 text-xs text-[#6f6a64]">
              El rol se asigna automaticamente como Psicologo.
            </div>
            <button
              type="submit"
              className="w-full rounded-3xl bg-[#b78f8f] px-6 py-2 text-xs font-semibold text-white"
            >
              {id ? 'Guardar cambios' : 'Registrar psicologo'}
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-[#e6ded8] bg-white p-4">
            <h3 className="text-sm font-semibold text-[#1d1b18]">Horario de Entrevista Gratuita</h3>
            <p className="text-xs text-[#6f6a64]">Bloques de 15 minutos.</p>
            <div className="mt-4 space-y-3 overflow-auto">
              {dayKeys.map((day, index) => (
                <div key={day} className="rounded-3xl border border-[#e6ded8] bg-[#f7f5f2] p-3">
                  <p className="text-xs font-semibold text-[#1d1b18]">{DAYS[index]}</p>
                  <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
                    {FREE_SLOTS.map((slot) => (
                      <label
                        key={`${day}-${slot}`}
                        className="flex min-w-[70px] items-center gap-2 rounded-2xl border border-[#e6ded8] bg-white px-3 py-1 text-[11px] text-[#6f6a64]"
                      >
                        <input
                          type="checkbox"
                          checked={Boolean(freeAvailability?.[day]?.includes(slot))}
                          onChange={() => toggleAvailability('free', day, slot)}
                          className="h-4 w-4 rounded border-[#e6ded8] text-[#b78f8f]"
                        />
                        {slot}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-[#e6ded8] bg-white p-4">
            <h3 className="text-sm font-semibold text-[#1d1b18]">Horario de Terapia</h3>
            <p className="text-xs text-[#6f6a64]">Bloques de 1 hora.</p>
            <div className="mt-4 space-y-3 overflow-auto">
              {dayKeys.map((day, index) => (
                <div key={day} className="rounded-3xl border border-[#e6ded8] bg-[#f7f5f2] p-3">
                  <p className="text-xs font-semibold text-[#1d1b18]">{DAYS[index]}</p>
                  <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
                    {THERAPY_SLOTS.map((slot) => (
                      <label
                        key={`${day}-${slot}`}
                        className="flex min-w-[90px] items-center gap-2 rounded-2xl border border-[#e6ded8] bg-white px-3 py-1 text-[11px] text-[#6f6a64]"
                      >
                        <input
                          type="checkbox"
                          checked={Boolean(therapyAvailability?.[day]?.includes(slot))}
                          onChange={() => toggleAvailability('therapy', day, slot)}
                          className="h-4 w-4 rounded border-[#e6ded8] text-[#b78f8f]"
                        />
                        {slot} - {String(Number(slot.split(':')[0]) + 1).padStart(2, '0')}:00
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default PsychologistForm
