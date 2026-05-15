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

const createPsychologistProfile = async ({
  userId,
  email,
  nombre,
  apellidos,
  telefono,
  fechaNacimiento,
  genero,
  educacion,
  designacion,
  specialtyId,
  availability,
}) => {
  const profileRef = doc(collection(db, 'psychologists'))
  await setDoc(profileRef, {
    userId,
    email,
    nombre,
    apellidos,
    telefono,
    fechaNacimiento,
    genero,
    educacion,
    designacion,
    specialtyId,
    availability,
    status: 'active',
    createdAt: serverTimestamp(),
  })
  return profileRef
}

const updatePsychologistProfile = async (id, data) =>
  updateDoc(doc(db, 'psychologists', id), {
    ...data,
    updatedAt: serverTimestamp(),
  })

const updatePsychologistStatus = async (id, status) =>
  updateDoc(doc(db, 'psychologists', id), {
    status,
    updatedAt: serverTimestamp(),
  })

const getPsychologistById = async (id) => {
  const profileRef = doc(db, 'psychologists', id)
  const snapshot = await getDoc(profileRef)
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null
}

const listenPsychologists = ({ includeInactive = false }, callback) => {
  const baseQuery = includeInactive
    ? query(collection(db, 'psychologists'))
    : query(collection(db, 'psychologists'), where('status', '==', 'active'))

  return onSnapshot(baseQuery, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    callback(data)
  })
}

export {
  createPsychologistProfile,
  getPsychologistById,
  listenPsychologists,
  updatePsychologistProfile,
  updatePsychologistStatus,
}
