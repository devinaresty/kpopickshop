import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

declare module 'vue-router' {
  interface RouteMeta {
    requiresGuest?: boolean
    requiresAuth?: boolean
    requiresAdmin?: boolean
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'landing',
    component: () => import('@/views/LandingPageView.vue'),
    meta: { requiresGuest: true }, // Hanya untuk user yang belum login
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { requiresAuth: true }, // Hanya untuk user yang sudah login
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/SearchView.vue'),
  },
  {
    path: '/products',
    name: 'products',
    component: () => import('@/views/ProductsView.vue'),
  },
  {
    path: '/products/:id',
    name: 'product-detail',
    component: () => import('@/views/ProductDetailView.vue'),
  },
  {
    path: '/categories',
    name: 'categories',
    component: () => import('@/views/CategoriesView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/CartView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/views/CheckoutView.vue'),
    meta: { requiresAuth: true },
  },
  // Admin Login Route
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('@/views/admin/AdminLoginView.vue'),
  },
  // Admin Routes
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayouts.vue'),
    meta: { requiresAdmin: true },
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('@/views/admin/DashboardView.vue'),
        meta: { requiresAdmin: true },
      },
      {
        path: 'products',
        name: 'admin-products',
        component: () => import('@/views/admin/ProductListView.vue'),
        meta: { requiresAdmin: true },
      },
      {
        path: 'orders',
        name: 'admin-orders',
        component: () => import('@/views/admin/OrderListView.vue'),
        meta: { requiresAdmin: true },
      },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notfound',
    component: () => import('@/views/NotFoundView.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

/**
 * Navigation Guard untuk mengecek autentikasi dan role
 * - Redirect ke /home jika sudah login dan akses landing
 * - Redirect ke / jika belum login dan akses route yang dilindungi
 * - Redirect ke /home jika user bukan admin dan coba akses admin routes
 * 
 * IMPORTANT: Gunakan replace: true untuk semua redirect agar tidak create new history entry
 */
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const userRole = authStore.user?.role

  console.log(`Route Guard: ${to.path} | Authenticated: ${isAuthenticated} | Role: ${userRole}`) // DEBUG

  // Jika user sudah login dan coba akses landing page
  if (to.meta.requiresGuest && isAuthenticated) {
    console.log('User sudah login, redirect ke /home') // DEBUG
    next({ name: 'home', replace: true })
    return
  }

  // Jika user belum login dan coba akses route yang dilindungi
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('User belum login, redirect ke /') // DEBUG
    next({ name: 'landing', replace: true })
    return
  }

  // Jika route memerlukan admin tapi user bukan admin atau belum login
  if (to.meta.requiresAdmin && (!isAuthenticated || userRole !== 'ADMIN')) {
    console.log('User tidak memiliki akses admin, redirect ke /') // DEBUG
    next({ name: 'landing', replace: true })
    return
  }

  next()
})

export { router }
export default router

