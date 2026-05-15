import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'

import { db } from './firebase.js'

const createUserProfile = async ({
  uid,
  email,
  role = 'client',
  nombre = '',
  apellidos = '',
  telefono = '',
}) => {
  const userRef = doc(db, 'users', uid)

  await setDoc(
    userRef,
    {
      uid,
      email,
      nombre,
      apellidos,
      telefono,
      role,
      createdAt: serverTimestamp(),
    },
    { merge: true },
  )

  return userRef
}

const getUserProfile = async (uid) => {
  const userRef = doc(db, 'users', uid)
  const snapshot = await getDoc(userRef)
  return snapshot.exists() ? snapshot.data() : null
}

const getUserById = async (id) => {
  const userRef = doc(db, 'users', id)
  const snapshot = await getDoc(userRef)
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null
}

const findUserByEmail = async (email) => {
  const userQuery = query(collection(db, 'users'), where('email', '==', email))
  const snapshot = await getDocs(userQuery)
  if (snapshot.empty) return null
  const docSnap = snapshot.docs[0]
  return { id: docSnap.id, ...docSnap.data() }
}

const listenUsers = (callback) =>
  onSnapshot(collection(db, 'users'), (snapshot) => {
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    callback(data)
  })

const listenUsersByRole = (role, callback) =>
  onSnapshot(query(collection(db, 'users'), where('role', '==', role)), (snapshot) => {
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    callback(data)
  })


const listenUserProfile = (uid, callback) => {
  const userRef = doc(db, 'users', uid)
  return onSnapshot(userRef, (snapshot) => {
    callback(snapshot.exists() ? snapshot.data() : null)
  })
}

const updateUserRole = (uid, role) =>
  updateDoc(doc(db, 'users', uid), {
    role,
  })

const updateUserProfile = (uid, data) =>
  updateDoc(doc(db, 'users', uid), {
    ...data,
    updatedAt: serverTimestamp(),
  })

export {
  createUserProfile,
  findUserByEmail,
  getUserById,
  getUserProfile,
  listenUserProfile,
  listenUsers,
  listenUsersByRole,
  updateUserRole,
  updateUserProfile,
}
