import { useEffect, useMemo, useState } from 'react'

import { useAuth } from '../app/providers/AuthProvider.jsx'
import { DEFAULT_ROLE_PERMISSIONS, listenRole } from '../services/roles.js'

const usePermission = (section, action) => {
  const { role } = useAuth()
  const [roleDoc, setRoleDoc] = useState(null)

  useEffect(() => {
    if (!role) return undefined

    const unsubscribe = listenRole(role, setRoleDoc)
    return () => unsubscribe()
  }, [role])

  const permissions = useMemo(() => {
    if (!role) return null
    return roleDoc?.permissions || DEFAULT_ROLE_PERMISSIONS[role]?.permissions || null
  }, [role, roleDoc])

  if (!permissions) {
    return role === 'admin'
  }

  return Boolean(permissions?.[section]?.[action])
}

export default usePermission
