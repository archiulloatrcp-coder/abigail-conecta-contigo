import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'

import { db } from './firebase.js'

const STORAGE_KEY = 'client-message-submissions'
const MAX_MESSAGES_PER_HOUR = 3
const COOLDOWN_MS = 60 * 1000
const HOUR_MS = 60 * 60 * 1000

const getSubmissionHistory = () => {
  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY)
    const parsed = rawValue ? JSON.parse(rawValue) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const setSubmissionHistory = (timestamps) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(timestamps))
  } catch {
    // Ignore storage failures and continue.
  }
}

const enforceClientRateLimit = () => {
  const now = Date.now()
  const recentAttempts = getSubmissionHistory().filter((timestamp) => now - timestamp < HOUR_MS)

  if (recentAttempts.length > 0 && now - recentAttempts[recentAttempts.length - 1] < COOLDOWN_MS) {
    const error = new Error('Espera un momento antes de volver a enviar otro mensaje.')
    error.details = null
    throw error
  }

  if (recentAttempts.length >= MAX_MESSAGES_PER_HOUR) {
    const error = new Error('Has alcanzado el límite de envíos por ahora. Inténtalo más tarde.')
    error.details = null
    throw error
  }

  return { now, recentAttempts }
}

const submitClientMessage = async ({
  fullName,
  email,
  phone,
  message,
  source,
  honeypot,
  elapsedMs,
}) => {
  const { now, recentAttempts } = enforceClientRateLimit()

  await addDoc(collection(db, 'client_messages'), {
    fullName,
    email,
    phone,
    message,
    source,
    website: honeypot,
    elapsedMs,
    status: 'new',
    isRead: false,
    readAt: null,
    userAgent: navigator.userAgent || 'unknown',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  setSubmissionHistory([...recentAttempts, now])

  return { ok: true }
}

const listenClientMessages = (callback) => {
  const messagesQuery = query(collection(db, 'client_messages'), orderBy('createdAt', 'desc'))

  return onSnapshot(messagesQuery, (snapshot) => {
    const data = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
    callback(data)
  })
}

const updateClientMessage = (id, data) =>
  updateDoc(doc(db, 'client_messages', id), {
    ...data,
    updatedAt: serverTimestamp(),
  })

const markClientMessageAsRead = (id, isRead = true) =>
  updateClientMessage(id, {
    isRead,
    status: isRead ? 'read' : 'new',
    readAt: isRead ? serverTimestamp() : null,
  })

const removeClientMessage = (id) => deleteDoc(doc(db, 'client_messages', id))

export {
  listenClientMessages,
  markClientMessageAsRead,
  removeClientMessage,
  submitClientMessage,
  updateClientMessage,
}
