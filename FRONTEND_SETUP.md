# 🎨 Frontend Setup - Vue 3 + TypeScript + Tailwind CSS

## 📐 Struktur Project Frontend

```
frontend/
├── src/
│   ├── assets/                          # Static files
│   │   ├── images/
│   │   ├── icons/
│   │   └── styles/
│   │       └── global.css
│   │
│   ├── api/                             # HTTP Client & API calls
│   │   ├── axiosInstance.ts
│   │   ├── endpoints/
│   │   │   ├── auth.api.ts
│   │   │   ├── users.api.ts
│   │   │   └── products.api.ts
│   │   └── types/
│   │       └── api.types.ts
│   │
│   ├── stores/                          # Pinia State Management
│   │   ├── auth.store.ts
│   │   ├── user.store.ts
│   │   └── app.store.ts
│   │
│   ├── views/                           # Page Components
│   │   ├── auth/
│   │   │   ├── LoginView.vue
│   │   │   ├── RegisterView.vue
│   │   │   └── ForgotPasswordView.vue
│   │   ├── dashboard/
│   │   │   └── DashboardView.vue
│   │   ├── products/
│   │   │   ├── ProductListView.vue
│   │   │   └── ProductDetailView.vue
│   │   ├── profile/
│   │   │   └── ProfileView.vue
│   │   └── notfound/
│   │       └── NotFoundView.vue
│   │
│   ├── components/                      # Reusable Components
│   │   ├── common/
│   │   │   ├── Header.vue
│   │   │   ├── Footer.vue
│   │   │   ├── Sidebar.vue
│   │   │   └── Navbar.vue
│   │   ├── forms/
│   │   │   ├── LoginForm.vue
│   │   │   ├── RegisterForm.vue
│   │   │   └── ProductForm.vue
│   │   ├── cards/
│   │   │   ├── ProductCard.vue
│   │   │   └── UserCard.vue
│   │   └── ui/
│   │       ├── Button.vue
│   │       ├── Input.vue
│   │       ├── Modal.vue
│   │       ├── Loading.vue
│   │       └── Toast.vue
│   │
│   ├── composables/                     # Reusable Logic (Hooks)
│   │   ├── useAuth.ts
│   │   ├── useFetch.ts
│   │   ├── useForm.ts
│   │   └── useNotification.ts
│   │
│   ├── guards/                          # Route Guards
│   │   └── auth.guard.ts
│   │
│   ├── middleware/                      # Middleware (interceptors, etc)
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   │
│   ├── types/                           # TypeScript Interfaces
│   │   ├── common.types.ts
│   │   ├── models/
│   │   │   ├── user.model.ts
│   │   │   ├── product.model.ts
│   │   │   └── auth.model.ts
│   │   └── responses/
│   │       └── api-response.ts
│   │
│   ├── utils/                           # Utility Functions
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   ├── constants.ts
│   │   └── helpers.ts
│   │
│   ├── layouts/                         # Layout Components
│   │   ├── MainLayout.vue
│   │   ├── AuthLayout.vue
│   │   └── BlankLayout.vue
│   │
│   ├── router/                          # Vue Router Config
│   │   ├── index.ts
│   │   └── routes/
│   │       ├── auth.routes.ts
│   │       ├── product.routes.ts
│   │       └── user.routes.ts
│   │
│   ├── App.vue
│   ├── main.ts
│   └── vite-env.d.ts
│
├── public/
│   └── favicon.ico
│
├── tests/
│   ├── unit/
│   └── e2e/
│
├── .env
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
└── README.md
```

---

## 🚀 STEP-BY-STEP SETUP

### **STEP 1: Create Vue 3 Project**

```bash
# Navigate ke folder project
cd "d:\project ujikom (kpopick)"

# Create Vite + Vue 3 + TypeScript project
npm create vite@latest frontend -- --template vue-ts

# Navigate ke folder frontend
cd frontend

# Install dependencies
npm install
```

---

### **STEP 2: Install Required Packages**

```bash
# Core
npm install vue-router@4

# State Management
npm install pinia

# HTTP Client
npm install axios

# Form Validation
npm install vee-validate yup

# Tailwind CSS & PostCSS
npm install -D tailwindcss postcss autoprefixer

# UI Components (Shadcn/vue)
npm install -D class-variance-authority clsx tailwind-merge
npm install @radix-ui/primitive

# TypeScript utilities
npm install -D typescript
npm install zod

# Dev Dependencies
npm install -D @types/node
npm install -D @vitejs/plugin-vue
npm install -D tailwind-merge classnames

# Optional: Toast Notifications
npm install vue-sonner
```

---

### **STEP 3: Setup Tailwind CSS**

```bash
# Initialize Tailwind
npx tailwindcss init -p
```

**File: `tailwind.config.ts`**
```typescript
import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config
```

**File: `postcss.config.js`**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

### **STEP 4: Setup Vue Router**

**File: `src/router/index.ts`**
```typescript
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Import views
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'products',
        name: 'products',
        component: () => import('@/views/products/ProductListView.vue'),
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/views/profile/ProfileView.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/auth/LoginView.vue'),
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/views/auth/RegisterView.vue'),
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notfound',
    component: () => import('@/views/notfound/NotFoundView.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
```

---

### **STEP 5: Setup Pinia (State Management)**

**File: `src/stores/auth.store.ts`**
```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: string
  email: string
  name: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!token.value)

  const login = async (email: string, password: string) => {
    isLoading.value = true
    try {
      // Call API di sini
      // const response = await authApi.login(email, password)
      // token.value = response.token
      // user.value = response.user
      // localStorage.setItem('token', response.token)
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout
  }
})
```

---

### **STEP 6: Setup Axios Instance**

**File: `src/api/axiosInstance.ts`**
```typescript
import axios from 'axios'
import { useAuthStore } from '@/stores/auth.store'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
axiosInstance.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
```

---

### **STEP 7: Setup Environment Variables**

**File: `.env`**
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=KPopick
```

**File: `.env.example`**
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=KPopick
```

---

### **STEP 8: Update Main.ts**

**File: `src/main.ts`**
```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// Import Tailwind CSS
import './assets/styles/global.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')
```

---

### **STEP 9: Create Global Styles**

**File: `src/assets/styles/global.css`**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition;
  }

  .btn-secondary {
    @apply px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition;
  }

  .input-base {
    @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500;
  }
}
```

---

### **STEP 10: Run Development Server**

```bash
npm run dev
```

Akses di: `http://localhost:5173`

---

## 📦 Commands Reference

```bash
# Development
npm run dev

# Build
npm run build

# Preview
npm run preview

# Type Check
npm run type-check

# Lint (jika ada eslint)
npm run lint
```

---

## 🔑 Penting untuk Integrasi Backend

### **VITE_API_URL Configuration:**

**Development:**
```env
VITE_API_URL=http://localhost:3000/api
```

**Production:**
```env
VITE_API_URL=https://api.kpopick.com/api
```

---

## 📚 Struktur File Penting

### **Composable Example (src/composables/useAuth.ts)**
```typescript
import { useAuthStore } from '@/stores/auth.store'
import { ref } from 'vue'

export const useAuth = () => {
  const authStore = useAuthStore()
  const isLoading = ref(false)

  const login = async (email: string, password: string) => {
    isLoading.value = true
    try {
      await authStore.login(email, password)
    } finally {
      isLoading.value = false
    }
  }

  return {
    login,
    isLoading,
    isAuthenticated: authStore.isAuthenticated,
    user: authStore.user
  }
}
```

### **API Endpoint Example (src/api/endpoints/auth.api.ts)**
```typescript
import axiosInstance from '../axiosInstance'
import type { LoginRequest, AuthResponse } from '@/types/models/auth.model'

export const authApi = {
  login: (data: LoginRequest) =>
    axiosInstance.post<AuthResponse>('/auth/login', data),

  register: (data: RegisterRequest) =>
    axiosInstance.post<AuthResponse>('/auth/register', data),

  logout: () =>
    axiosInstance.post('/auth/logout'),

  refresh: () =>
    axiosInstance.post('/auth/refresh')
}
```

---

## ✅ Checklist Setup

- [ ] Vue 3 project created
- [ ] All packages installed
- [ ] Tailwind CSS setup
- [ ] Vue Router configured
- [ ] Pinia stores created
- [ ] Axios instance setup
- [ ] Environment variables configured
- [ ] Global styles imported
- [ ] Development server running
- [ ] Can access http://localhost:5173

---

## 📝 Next Steps

1. **Create basic layouts** (MainLayout, AuthLayout)
2. **Create router guards** untuk authentication
3. **Setup API endpoints** sesuai backend
4. **Create form components** dengan VeeValidate
5. **Connect ke backend** untuk real API calls
