import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'

import { db } from './firebase.js'

const createPatientProfile = async ({
  userId,
  email,
  nombre,
  apellidos,
  telefono,
  clinicalStatus = 'active',
  accountStatus = 'pending',
}) => {
  const patientRef = doc(collection(db, 'patients'))
  await setDoc(patientRef, {
    userId,
    email,
    nombre,
    apellidos,
    telefono,
    clinicalStatus,
    accountStatus,
    status: 'active',
    createdAt: serverTimestamp(),
  })
  return patientRef
}

const updatePatientProfile = async (id, data) =>
  updateDoc(doc(db, 'patients', id), {
    ...data,
    updatedAt: serverTimestamp(),
  })

const updatePatientStatus = async (id, status) =>
  updateDoc(doc(db, 'patients', id), {
    status,
    updatedAt: serverTimestamp(),
  })

const getPatientById = async (id) => {
  const patientRef = doc(db, 'patients', id)
  const snapshot = await getDoc(patientRef)
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null
}

const listenPatients = ({ includeInactive = false }, callback) => {
  const baseQuery = includeInactive
    ? query(collection(db, 'patients'))
    : query(collection(db, 'patients'), where('status', '==', 'active'))

  return onSnapshot(baseQuery, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    callback(data)
  })
}

export {
  createPatientProfile,
  getPatientById,
  listenPatients,
  updatePatientProfile,
  updatePatientStatus,
}
