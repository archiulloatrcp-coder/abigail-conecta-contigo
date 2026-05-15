import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore'

import { db } from './firebase.js'

const DEFAULT_ROLE_PERMISSIONS = {
  admin: {
    name: 'Administrador',
    permissions: {
      dashboard: { canView: true, canAdd: true, canEdit: true, canDelete: true },
      staff: { canView: true, canAdd: true, canEdit: true, canDelete: true },
      especialidades: { canView: true, canAdd: true, canEdit: true, canDelete: true },
      pacientes: { canView: true, canAdd: true, canEdit: true, canDelete: true },
      citas: { canView: true, canAdd: true, canEdit: true, canDelete: true },
      pagos: { canView: true, canAdd: true, canEdit: true, canDelete: true },
    },
  },
  client: {
    name: 'Cliente',
    permissions: {
      dashboard: { canView: true, canAdd: false, canEdit: false, canDelete: false },
      staff: { canView: false, canAdd: false, canEdit: false, canDelete: false },
      especialidades: { canView: true, canAdd: false, canEdit: false, canDelete: false },
      pacientes: { canView: false, canAdd: false, canEdit: false, canDelete: false },
      citas: { canView: true, canAdd: true, canEdit: true, canDelete: false },
      pagos: { canView: true, canAdd: false, canEdit: false, canDelete: false },
    },
  },
  psicologo: {
    name: 'Psicologo',
    permissions: {
      dashboard: { canView: true, canAdd: false, canEdit: false, canDelete: false },
      staff: { canView: true, canAdd: false, canEdit: false, canDelete: false },
      especialidades: { canView: true, canAdd: false, canEdit: false, canDelete: false },
      pacientes: { canView: true, canAdd: true, canEdit: true, canDelete: false },
      citas: { canView: true, canAdd: true, canEdit: true, canDelete: false },
      pagos: { canView: false, canAdd: false, canEdit: false, canDelete: false },
    },
  },
}

const listenRole = (roleId, callback) =>
  onSnapshot(doc(db, 'roles', roleId), (snapshot) => {
    callback(snapshot.exists() ? snapshot.data() : null)
  })

const listenRoles = (callback) =>
  onSnapshot(collection(db, 'roles'), (snapshot) => {
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    callback(data)
  })

const upsertRole = (roleId, data) =>
  setDoc(
    doc(db, 'roles', roleId),
    {
      id: roleId,
      ...data,
    },
    { merge: true },
  )

export { DEFAULT_ROLE_PERMISSIONS, listenRole, listenRoles, upsertRole }
