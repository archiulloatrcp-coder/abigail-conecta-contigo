import { useEffect, useRef, useState } from 'react'

import { useNotifications } from '../app/providers/NotificationProvider.jsx'
import { submitClientMessage } from '../services/clientMessages.js'

const DEFAULT_FORM = {
  fullName: '',
  email: '',
  phone: '',
  message: '',
  website: '',
}

const MIN_FORM_TIME_MS = 3000

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^\+?[0-9()\-\s]{7,20}$/

function ContactRequestModal({ isOpen, onClose, source = 'landing' }) {
  const [formData, setFormData] = useState(DEFAULT_FORM)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const openedAtRef = useRef(Date.now())
  const { addMessage } = useNotifications()

  useEffect(() => {
    if (!isOpen) {
      setFormData(DEFAULT_FORM)
      setErrors({})
      setIsSubmitting(false)
      return
    }

    openedAtRef.current = Date.now()
  }, [isOpen])

  const buildValidationErrors = (elapsedMs = MIN_FORM_TIME_MS) => {
    const nextErrors = {}
    const email = formData.email.trim()
    const phone = formData.phone.trim()

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'Ingresa tu nombre completo.'
    }

    if (!formData.message.trim()) {
      nextErrors.message = 'Cuéntanos brevemente tu consulta.'
    }

    if (!email && !phone) {
      nextErrors.contact = 'Ingresa al menos un correo o celular.'
    }

    if (email && !EMAIL_REGEX.test(email)) {
      nextErrors.email = 'Ingresa un correo válido.'
    }

    if (phone && !PHONE_REGEX.test(phone)) {
      nextErrors.phone = 'Ingresa un celular válido.'
    }

    if (formData.website.trim()) {
      nextErrors.form = 'No pudimos validar el envío del formulario.'
    }

    if (elapsedMs < MIN_FORM_TIME_MS) {
      nextErrors.form = 'Espera unos segundos antes de enviar el formulario.'
    }

    return nextErrors
  }

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      if (!prev[key] && !(key === 'email' || key === 'phone')) {
        return prev
      }

      const next = { ...prev }
      delete next[key]
      if (key === 'email' || key === 'phone') {
        delete next.contact
      }
      return next
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const elapsedMs = Date.now() - openedAtRef.current
    const nextErrors = buildValidationErrors(elapsedMs)

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    try {
      setIsSubmitting(true)
      setErrors({})

      await submitClientMessage({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
        source,
        honeypot: formData.website.trim(),
        elapsedMs,
      })

      addMessage({ type: 'success', text: 'Tu consulta fue enviada correctamente.' })
      onClose()
    } catch (error) {
      setErrors(error.details || {})
      addMessage({ type: 'error', text: error.message || 'No pudimos enviar tu consulta.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4 py-8">
      <div className="w-full max-w-xl rounded-3xl border border-[#e6ded8] bg-white p-6 shadow-[0_18px_36px_rgba(61,51,45,0.2)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-[#1d1b18]">Solicitar consulta</h3>
            <p className="mt-1 text-sm text-[#6f6a64]">
              Déjanos tus datos y te contactaremos lo antes posible.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-[#e6ded8] px-3 py-1 text-xs font-semibold text-[#1d1b18]"
          >
            Cerrar
          </button>
        </div>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-xs font-semibold text-[#1d1b18]">
            Nombre completo
            <input
              type="text"
              value={formData.fullName}
              onChange={(event) => handleChange('fullName', event.target.value)}
              className="mt-2 w-full rounded-3xl border border-[#e6ded8] bg-[#f7f5f2] px-4 py-3 text-sm text-[#1d1b18] outline-none"
              placeholder="Ej. María Pérez"
              required
            />
            {errors.fullName ? <span className="mt-1 block text-[11px] text-red-600">{errors.fullName}</span> : null}
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-xs font-semibold text-[#1d1b18]">
              Celular
              <input
                type="tel"
                value={formData.phone}
                onChange={(event) => handleChange('phone', event.target.value)}
                className="mt-2 w-full rounded-3xl border border-[#e6ded8] bg-[#f7f5f2] px-4 py-3 text-sm text-[#1d1b18] outline-none"
                placeholder="Ej. 987654321"
              />
              {errors.phone ? <span className="mt-1 block text-[11px] text-red-600">{errors.phone}</span> : null}
            </label>

            <label className="block text-xs font-semibold text-[#1d1b18]">
              Correo electrónico
              <input
                type="email"
                value={formData.email}
                onChange={(event) => handleChange('email', event.target.value)}
                className="mt-2 w-full rounded-3xl border border-[#e6ded8] bg-[#f7f5f2] px-4 py-3 text-sm text-[#1d1b18] outline-none"
                placeholder="Ej. nombre@correo.com"
              />
              {errors.email ? <span className="mt-1 block text-[11px] text-red-600">{errors.email}</span> : null}
            </label>
          </div>

          {errors.contact ? <p className="text-[11px] text-red-600">{errors.contact}</p> : null}

          <label className="block text-xs font-semibold text-[#1d1b18]">
            Mensaje
            <textarea
              value={formData.message}
              onChange={(event) => handleChange('message', event.target.value)}
              className="mt-2 min-h-32 w-full rounded-3xl border border-[#e6ded8] bg-[#f7f5f2] px-4 py-3 text-sm text-[#1d1b18] outline-none"
              placeholder="Cuéntanos qué tipo de apoyo necesitas."
              required
            />
            {errors.message ? <span className="mt-1 block text-[11px] text-red-600">{errors.message}</span> : null}
          </label>

          <label className="hidden" aria-hidden="true">
            Sitio web
            <input
              type="text"
              tabIndex="-1"
              autoComplete="off"
              value={formData.website}
              onChange={(event) => handleChange('website', event.target.value)}
            />
          </label>

          <div className="rounded-2xl border border-[#e6ded8] bg-[#f7f5f2] px-4 py-3 text-xs text-[#6f6a64]">
            Protección anti-spam activa. El formulario aplica validaciones, campo trampa invisible y control de frecuencia.
          </div>
          {errors.form ? <p className="text-[11px] text-red-600">{errors.form}</p> : null}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-3xl border border-[#e6ded8] px-4 py-2 text-xs font-semibold text-[#1d1b18] disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-3xl bg-[#b78f8f] px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar consulta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ContactRequestModal
