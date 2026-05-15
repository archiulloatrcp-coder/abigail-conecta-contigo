import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'

import { auth } from '../../services/firebase.js'
import { loginWithEmail, logout, registerWithEmail } from '../../services/auth.js'
import { createUserProfile, getUserProfile, listenUserProfile } from '../../services/users.js'

const AuthContext = createContext(null)

const useAuth = () => useContext(AuthContext)

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let profileUnsubscribe = null

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser)

      if (!nextUser) {
        setProfile(null)
        if (profileUnsubscribe) {
          profileUnsubscribe()
          profileUnsubscribe = null
        }
        setLoading(false)
        return
      }

      try {
        const nextProfile = await getUserProfile(nextUser.uid)

        if (!nextProfile) {
          await createUserProfile({ uid: nextUser.uid, email: nextUser.email })
        }

        if (profileUnsubscribe) {
          profileUnsubscribe()
        }

        profileUnsubscribe = listenUserProfile(nextUser.uid, (profileData) => {
          setProfile(profileData)
          setLoading(false)
        })
      } catch (error) {
        console.error('Error loading profile', error)
        setProfile(null)
        setLoading(false)
      } finally {
        if (!profileUnsubscribe) {
          setLoading(false)
        }
      }
    })

    return () => {
      if (profileUnsubscribe) profileUnsubscribe()
      unsubscribe()
    }
  }, [])

  const handleRegister = async ({ email, password }) => {
    const credential = await registerWithEmail(email, password)
    await createUserProfile({ uid: credential.user.uid, email: credential.user.email })

    try {
      const nextProfile = await getUserProfile(credential.user.uid)
      setProfile(nextProfile)
    } catch (error) {
      console.error('Error loading profile after register', error)
    }
    return credential
  }

  const handleLogin = async ({ email, password }) =>
    loginWithEmail(email, password)

  const handleLogout = async () => logout()

  const value = useMemo(
    () => ({
      user,
      profile,
      role: profile?.role || 'client',
      loading,
      register: handleRegister,
      login: handleLogin,
      logout: handleLogout,
    }),
    [loading, profile, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthProvider, useAuth }
