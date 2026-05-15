import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'

import { db } from './firebase.js'

const listenSpecialties = (callback) =>
  onSnapshot(collection(db, 'specialties'), (snapshot) => {
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    callback(data)
  })

const createSpecialty = async ({ name, description }) =>
  addDoc(collection(db, 'specialties'), {
    name,
    description,
    status: 'active',
    createdAt: serverTimestamp(),
  })

const updateSpecialty = async (id, data) =>
  updateDoc(doc(db, 'specialties', id), {
    ...data,
    updatedAt: serverTimestamp(),
  })

export { listenSpecialties, createSpecialty, updateSpecialty }
