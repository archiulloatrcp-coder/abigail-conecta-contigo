import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

import { auth, firebaseConfig } from './firebase.js'

const registerWithEmail = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password)

const loginWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password)

const logout = () => signOut(auth)

const getSecondaryAuth = () => {
  const existing = getApps().find((app) => app.name === 'secondary-auth')
  const app = existing || initializeApp(firebaseConfig, 'secondary-auth')
  return getAuth(app)
}

const createSecondaryAccount = async (email, password) => {
  const secondaryAuth = getSecondaryAuth()
  const credential = await createUserWithEmailAndPassword(secondaryAuth, email, password)
  return { auth: secondaryAuth, user: credential.user }
}

const cleanupSecondaryAccount = async ({ auth: secondaryAuth, user }) => {
  try {
    if (user) {
      await deleteUser(user)
    }
  } catch (error) {
    console.error('Secondary account cleanup error', error)
  } finally {
    try {
      await signOut(secondaryAuth)
    } catch (error) {
      console.error('Secondary sign out error', error)
    }
  }
}

const signOutSecondary = (secondaryAuth) => signOut(secondaryAuth)

export {
  cleanupSecondaryAccount,
  createSecondaryAccount,
  loginWithEmail,
  logout,
  registerWithEmail,
  signOutSecondary,
}
