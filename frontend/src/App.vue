<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-blue-600">KPopick</h1>
          </div>
          <div class="flex items-center gap-4">
            <router-link to="/" class="text-gray-700 hover:text-blue-600">Home</router-link>
            <router-link to="/about" class="text-gray-700 hover:text-blue-600">About</router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Router View -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
