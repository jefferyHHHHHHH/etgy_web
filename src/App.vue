<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
const appTitle = import.meta.env.VITE_APP_TITLE
</script>

<template>
  <header style="padding: 12px; border-bottom: 1px solid #eee">
    <strong>{{ appTitle }}</strong>
    <nav style="margin-top: 8px; display: flex; gap: 12px">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/user/42">User 42</RouterLink>
    </nav>
  </header>
  <main style="padding: 16px">
    <RouterView />
  </main>
</template>
