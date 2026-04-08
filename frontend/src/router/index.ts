import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/shared/stores'

declare module 'vue-router' {
  interface RouteMeta {
    requiresGuest?: boolean
    requiresAuth?: boolean
    requiresAdmin?: boolean
    hideNavbar?: boolean
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'landing',
    component: () => import('@/views/LandingPageView.vue'),
    meta: { requiresGuest: true }, 
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { requiresAuth: true }, 
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
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/orders/:id',
    name: 'order-detail',
    component: () => import('@/views/OrderDetailView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/payment-success',
    name: 'payment-success',
    component: () => import('@/views/PaymentSuccessView.vue'),
  },
  {
    path: '/payment-failed',
    name: 'payment-failed',
    component: () => import('@/views/PaymentFailedView.vue'),
  },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('@/modules/admin/pages/AdminLoginPage.vue'),
    meta: { requiresGuest: false, requiresAuth: false, requiresAdmin: false, hideNavbar: true },
  },
  {
    path: '/admin/signup',
    name: 'admin-signup',
    component: () => import('@/modules/admin/pages/AdminSignUpPage.vue'),
  },
  {
    path: '/admin',
    component: () => import('@/modules/admin/layouts/AdminLayout.vue'),
    meta: { requiresAdmin: true },
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('@/modules/admin/pages/DashboardPage.vue'),
        meta: { requiresAdmin: true },
      },
      {
        path: 'products',
        name: 'admin-products',
        component: () => import('@/modules/admin/pages/ProductsPage.vue'),
        meta: { requiresAdmin: true },
      },
      {
        path: 'categories',
        name: 'admin-categories',
        component: () => import('@/modules/admin/pages/CategoriesPage.vue'),
        meta: { requiresAdmin: true },
      },
      {
        path: 'orders',
        name: 'admin-orders',
        component: () => import('@/modules/admin/pages/OrdersPage.vue'),
        meta: { requiresAdmin: true },
      },
      {
        path: 'customers',
        name: 'admin-customers',
        component: () => import('@/modules/admin/pages/CustomersPage.vue'),
        meta: { requiresAdmin: true },
      },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notfound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { hideNavbar: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})


router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  // Public paths - no auth needed
  const publicPaths = ['/admin/login', '/admin/signup', '/']
  if (publicPaths.includes(to.path)) {
    next()
    return
  }

  // Admin routes - require auth + ADMIN role
  if (to.path.startsWith('/admin')) {
    if (!isAuthenticated) {
      next({ path: '/admin/login' })
      return
    }

    const userRole = (authStore.user as any)?.role
    if (userRole !== 'ADMIN') {
      next({ path: '/home' })
      return
    }

    next()
    return
  }

  // Protected user routes
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ path: '/' })
    return
  }

  // Guest-only routes (landing page) - don't auto-redirect
  if (to.meta.requiresGuest && isAuthenticated && to.path !== '/') {
    next({ path: '/home' })
    return
  }

  next()
})

export { router }
export default router

