<template>
  <header>
    <nav>
      <button type="button" @click="hanldeLogout">logout</button>
      <ul>
        <li><router-link to="/menu">menu</router-link></li>
        <li><router-link to="/orders">orders</router-link></li>
      </ul>
    </nav>
  </header>
  <main>
    <router-view></router-view>
  </main>
  <footer class="footer">
    <p class="footer__text">© 2025 Fireside Café. All rights reserved.</p>
  </footer>
</template>
<script setup lang="ts">
import { logout } from "../api/auth/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const hanldeLogout = async () => {
  try {
    await logout();
    // remove token from LocalStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    // redirect to login page
    router.push("/login");
  } catch (err) {
    console.error(err);
  }
};
</script>
