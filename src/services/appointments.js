import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore'

import { db } from './firebase.js'

const createAppointment = async ({
  userId,
  serviceId,
  professionalId,
  date,
  time,
}) =>
  addDoc(collection(db, 'appointments'), {
    userId,
    serviceId,
    professionalId,
    date,
    time,
    status: 'pending',
    createdAt: serverTimestamp(),
  })

const listenAppointmentsByUser = (uid, callback) => {
  const appointmentQuery = query(
    collection(db, 'appointments'),
    where('userId', '==', uid),
    orderBy('date', 'desc'),
  )

  return onSnapshot(appointmentQuery, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    callback(data)
  })
}

const listenAllAppointments = (callback) => {
  const appointmentQuery = query(collection(db, 'appointments'), orderBy('date', 'desc'))

  return onSnapshot(appointmentQuery, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    callback(data)
  })
}

export { createAppointment, listenAppointmentsByUser, listenAllAppointments }
