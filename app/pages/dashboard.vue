<script setup lang="ts">
import {useAuth} from "~/features/auth/composables/useAuth.ts";

const { logout } = useAuth()
</script>

<template>
  <div>
    <h1>Dashboard</h1>

    <button type="button" @click="logout">
      Logout
    </button>
  </div>
</template>