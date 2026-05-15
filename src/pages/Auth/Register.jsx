import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../../app/providers/AuthProvider.jsx'
import { useNotifications } from '../../app/providers/NotificationProvider.jsx'

const getRegisterErrorMessage = (code) => {
  if (code === 'auth/email-already-in-use') return 'Este email ya esta registrado.'
  if (code === 'auth/invalid-email') return 'El email no es valido.'
  if (code === 'auth/weak-password') return 'La contrasena es muy debil.'
  return 'No pudimos crear tu cuenta. Intenta nuevamente.'
}

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { register } = useAuth()
  const { addMessage } = useNotifications()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      await register({ email, password })
      addMessage({ type: 'success', text: 'Cuenta creada correctamente.' })
      navigate('/client', { replace: true })
    } catch (error) {
      console.error('Register error', error)
      addMessage({ type: 'error', text: getRegisterErrorMessage(error.code) })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f5f2] px-4 py-12 text-[#1d1b18]">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-[#e6ded8] bg-white p-8 shadow-[0_14px_28px_rgba(61,51,45,0.16)]">
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-[#c8a5a5] to-[#e7d1c9] px-4 py-3 text-sm font-semibold text-[#1d1b18]">
          Comienza tu proceso
        </div>
        <h1 className="font-heading text-2xl text-[#1d1b18]">Crear cuenta</h1>
        <p className="text-sm text-[#6f6a64]">Registra tus datos para comenzar a agendar.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-xs font-semibold text-[#1d1b18]">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-3xl border border-[#e6ded8] px-4 py-3 text-sm"
              placeholder="tu@email.com"
              required
            />
          </label>
          <label className="block text-xs font-semibold text-[#1d1b18]">
            Contrasena
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-3xl border border-[#e6ded8] px-4 py-3 text-sm"
              placeholder="Minimo 6 caracteres"
              required
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-3xl bg-[#b78f8f] px-4 py-3 text-xs font-semibold text-white shadow-[0_12px_24px_rgba(61,51,45,0.2)] disabled:opacity-60"
          >
            {submitting ? 'Registrando...' : 'Crear cuenta'}
          </button>
          <Link
            to="/login"
            className="block w-full rounded-3xl border border-[#e6ded8] px-4 py-3 text-center text-xs font-semibold text-[#1d1b18]"
          >
            Ya tengo cuenta
          </Link>
        </form>
      </div>
    </div>
  )
}

export default Register
