<template>
  <section class="admin-dashboard">
    <h1>Welcome, {{ userName }}!</h1>
  </section>
</template>
<script setup>
import { ref, onMounted } from "vue";
const userName = ref("");

onMounted(() => {
  userName.value = JSON.parse(localStorage.getItem("user")).name || "Admin";
});
</script>
