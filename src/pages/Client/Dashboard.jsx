import { useEffect, useState } from 'react'

import { useAuth } from '../../app/providers/AuthProvider.jsx'
import { createAppointment, listenAppointmentsByUser } from '../../services/appointments.js'

const SERVICES = [
  { id: 'terapia-positiva', label: 'Terapia positiva' },
  { id: 'mindfulness', label: 'Mindfulness guiado' },
  { id: 'orientacion', label: 'Orientacion personal' },
]

function ClientDashboard() {
  const { user, profile, role, logout } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [serviceId, setServiceId] = useState(SERVICES[0].id)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formMessage, setFormMessage] = useState('')

  useEffect(() => {
    if (!user?.uid) return

    const unsubscribe = listenAppointmentsByUser(user.uid, setAppointments)
    return () => unsubscribe()
  }, [user])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error', error)
    }
  }

  const handleCreateAppointment = async (event) => {
    event.preventDefault()

    if (!user?.uid) return

    setSubmitting(true)
    setFormMessage('')

    try {
      await createAppointment({
        userId: user.uid,
        serviceId,
        professionalId: 'default',
        date,
        time,
      })
      if (navigator?.vibrate) {
        navigator.vibrate(50)
      }
      setFormMessage('Cita registrada. Te confirmaremos pronto.')
      setDate('')
      setTime('')
    } catch (error) {
      console.error('Create appointment error', error)
      setFormMessage('No pudimos registrar la cita. Intenta otra vez.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f5f2] px-4 py-10 text-[#1d1b18]">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="rounded-3xl bg-gradient-to-r from-[#c8a5a5] to-[#e7d1c9] px-6 py-6 text-[#1d1b18] shadow-[0_16px_32px_rgba(61,51,45,0.2)]">
          <h1 className="font-heading text-2xl text-[#1d1b18]">Panel del paciente</h1>
          <p className="text-sm text-[#6f6a64]">
            Gestiona tus citas y reserva nuevos espacios cuando lo necesites.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-3xl border border-[#e6ded8] bg-white p-6 shadow-[0_12px_24px_rgba(61,51,45,0.12)]">
            <div className="flex flex-col gap-3 text-sm text-[#6f6a64]">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-[#b78f8f]">Sesion activa</p>
                <p className="font-semibold text-[#1d1b18]">{user?.email}</p>
                <p>Rol: {profile?.role || role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full max-w-[220px] rounded-3xl border border-[#e6ded8] px-4 py-2 text-xs font-semibold text-[#1d1b18]"
              >
                Cerrar sesion
              </button>
            </div>
          </div>
          <div className="rounded-3xl border border-[#e6ded8] bg-white p-6 shadow-[0_12px_24px_rgba(61,51,45,0.12)]">
            <h2 className="text-base font-semibold text-[#1d1b18]">Reservar una cita</h2>
            <p className="text-xs text-[#6f6a64]">Selecciona servicio y horario.</p>
            <form className="mt-4 space-y-3" onSubmit={handleCreateAppointment}>
              <label className="block text-xs font-semibold text-[#1d1b18]">
                Servicio
                <select
                  value={serviceId}
                  onChange={(event) => setServiceId(event.target.value)}
                  className="mt-2 w-full rounded-3xl border border-[#e6ded8] px-4 py-2 text-sm"
                >
                  {SERVICES.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-semibold text-[#1d1b18]">
                Fecha
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="mt-2 w-full rounded-3xl border border-[#e6ded8] px-4 py-2 text-sm"
                  required
                />
              </label>
              <label className="block text-xs font-semibold text-[#1d1b18]">
                Hora
                <input
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  className="mt-2 w-full rounded-3xl border border-[#e6ded8] px-4 py-2 text-sm"
                  required
                />
              </label>
              {formMessage ? <p className="text-xs text-[#b78f8f]">{formMessage}</p> : null}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-3xl bg-[#b78f8f] px-4 py-2 text-xs font-semibold text-white shadow-[0_12px_24px_rgba(61,51,45,0.2)] disabled:opacity-60"
              >
                {submitting ? 'Guardando...' : 'Agendar cita'}
              </button>
            </form>
          </div>
        </div>
        <div className="rounded-3xl border border-[#e6ded8] bg-white p-6 shadow-[0_12px_24px_rgba(61,51,45,0.12)]">
          <h2 className="text-base font-semibold text-[#1d1b18]">Tus citas</h2>
          <div className="mt-4 space-y-3">
            {appointments.length === 0 ? (
              <p className="text-sm text-[#6f6a64]">Aun no tienes citas registradas.</p>
            ) : (
              appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-3xl border border-[#e6ded8] px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-semibold text-[#1d1b18]">{appointment.serviceId}</p>
                    <p className="text-xs text-[#6f6a64]">{appointment.date} · {appointment.time}</p>
                  </div>
                  <span className="rounded-full border border-[#e6ded8] px-3 py-1 text-xs text-[#6f6a64]">
                    {appointment.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientDashboard
