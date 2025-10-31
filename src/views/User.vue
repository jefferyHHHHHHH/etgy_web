<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
const id = route.params.id as string
</script>

<template>
  <div style="padding: 16px">
    <h2>User</h2>
    <p>当前用户 ID：{{ id }}</p>
  </div>
</template>
