export const AUTH_STORAGE_KEYS = {
  ADMIN: {
    token: 'KPOPICK_ADMIN_TOKEN',
    user: 'KPOPICK_ADMIN_INFO',
    role: 'KPOPICK_ADMIN_ROLE'
  },
  USER: {
    token: 'KPOPICK_USER_TOKEN',
    user: 'KPOPICK_USER_INFO',
    role: 'KPOPICK_USER_ROLE'
  }
}

export function getAuthStorageKey(role: 'ADMIN' | 'USER' | string) {
  return role === 'ADMIN' ? AUTH_STORAGE_KEYS.ADMIN : AUTH_STORAGE_KEYS.USER
}

export function getAuthToken(): string | null {
  const adminToken = localStorage.getItem(AUTH_STORAGE_KEYS.ADMIN.token)
  const userToken = localStorage.getItem(AUTH_STORAGE_KEYS.USER.token)
  
  return adminToken || userToken
}

export function getAuthTokenByRole(role: 'ADMIN' | 'USER' | string): string | null {
  const keys = getAuthStorageKey(role)
  return localStorage.getItem(keys.token)
}

export function getStoredUser(): any | null {
  const adminUser = localStorage.getItem(AUTH_STORAGE_KEYS.ADMIN.user)
  const userUser = localStorage.getItem(AUTH_STORAGE_KEYS.USER.user)
  
  if (adminUser && getAuthTokenByRole('ADMIN')) {
    try {
      return JSON.parse(adminUser)
    } catch (e) {
      console.error('Failed to parse admin user:', e)
    }
  }
  
  if (userUser && getAuthTokenByRole('USER')) {
    try {
      return JSON.parse(userUser)
    } catch (e) {
      console.error('Failed to parse user:', e)
    }
  }
  
  return null
}

export function clearAuthByRole(role: 'ADMIN' | 'USER' | string) {
  const keys = getAuthStorageKey(role)
  localStorage.removeItem(keys.token)
  localStorage.removeItem(keys.user)
  localStorage.removeItem(keys.role)
}

export function clearAllAuth() {
  clearAuthByRole('ADMIN')
  clearAuthByRole('USER')
}

export function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith('/admin')
}

export function hasAuthToken(role?: 'ADMIN' | 'USER'): boolean {
  if (role) {
    return !!getAuthTokenByRole(role)
  }
  return !!getAuthToken()
}
