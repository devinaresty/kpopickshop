import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

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
    meta: { requiresAuth: true },
  },
  {
    path: '/products',
    name: 'products',
    component: () => import('@/views/ProductsView.vue'),
    meta: { requiresAuth: true },
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
 * Navigation Guard untuk mengecek autentikasi
 * - Redirect ke /home jika sudah login dan akses landing
 * - Redirect ke / jika belum login dan akses route yang dilindungi
 */
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  console.log(`Route Guard: ${to.path} | Authenticated: ${isAuthenticated}`) // DEBUG

  // Jika user sudah login dan coba akses landing page
  if (to.meta.requiresGuest && isAuthenticated) {
    console.log('User sudah login, redirect ke /home') // DEBUG
    next({ name: 'home' })
    return
  }

  // Jika user belum login dan coba akses route yang dilindungi
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('User belum login, redirect ke /') // DEBUG
    next({ name: 'landing' })
    return
  }

  next()
})

export { router }
export default router

