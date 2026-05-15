import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../../app/providers/AuthProvider.jsx'
import { useNotifications } from '../../app/providers/NotificationProvider.jsx'
import { getUserProfile } from '../../services/users.js'

const getLoginErrorMessage = (code) => {
  if (code === 'auth/invalid-email') return 'El email no es valido.'
  if (code === 'auth/user-not-found') return 'No existe una cuenta con ese email.'
  if (code === 'auth/wrong-password') return 'La contrasena es incorrecta.'
  if (code === 'auth/too-many-requests') return 'Demasiados intentos. Intenta mas tarde.'
  return 'No pudimos iniciar sesion. Revisa tus credenciales.'
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const { addMessage } = useNotifications()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      const credential = await login({ email, password })
      const profile = await getUserProfile(credential.user.uid)
      const destination = profile?.role === 'admin' ? '/admin' : '/client'
      addMessage({ type: 'success', text: 'Bienvenido. Sesion iniciada.' })
      const fallback = location.state?.from?.pathname || destination
      const normalized = fallback === '/cliente' ? '/client' : fallback
      navigate(normalized, { replace: true })
    } catch (error) {
      console.error('Login error', error)
      addMessage({ type: 'error', text: getLoginErrorMessage(error.code) })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f5f2] px-4 py-12 text-[#1d1b18]">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-[#e6ded8] bg-white p-8 shadow-[0_14px_28px_rgba(61,51,45,0.16)]">
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-[#c8a5a5] to-[#e7d1c9] px-4 py-3 text-sm font-semibold text-[#1d1b18]">
          Bienvenido nuevamente
        </div>
        <h1 className="font-heading text-2xl text-[#1d1b18]">Iniciar sesion</h1>
        <p className="text-sm text-[#6f6a64]">Accede a tu panel de citas y seguimiento.</p>
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
            {submitting ? 'Ingresando...' : 'Ingresar'}
          </button>
          <Link
            to="/registro"
            className="block w-full rounded-3xl border border-[#e6ded8] px-4 py-3 text-center text-xs font-semibold text-[#1d1b18]"
          >
            Crear una cuenta
          </Link>
        </form>
      </div>
    </div>
  )
}

export default Login
