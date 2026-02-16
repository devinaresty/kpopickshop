import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean // Route hanya accessible untuk user yang sudah login
    requiresGuest?: boolean // Route hanya accessible untuk user yang belum login
  }
}
