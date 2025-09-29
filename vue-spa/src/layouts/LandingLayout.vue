<!-- Landing Page Layout -->

<template>
  <header>
    <nav>
      <router-link to="/login">Login</router-link>
      <router-link to="/register">Register</router-link>
    </nav>
  </header>

  <main>
    <!--  this renders LandingView.vue-->
    <router-view />
  </main>

  <footer></footer>
</template>

<script setup></script>

<style scoped>
nav {
  display: flex;
  gap: 1rem;
}
</style>
