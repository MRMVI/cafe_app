<template>
  <header class="app-header">
    <nav class="nav-bar">
      <button type="button" @click="hanldeLogout" class="btn-logout">
        logout
      </button>
      <ul class="nav-links">
        <li>
          <router-link to="/dashboard" class="nav-link">dashboard</router-link>
        </li>
        <li>
          <router-link to="/dashboard/menu" class="nav-link">menu</router-link>
        </li>
        <li>
          <router-link to="/dashboard/add-item" class="nav-link"
            >Add Menu Item</router-link
          >
        </li>
        <li>
          <router-link to="/dashboard/orders" class="nav-link"
            >orders</router-link
          >
        </li>
      </ul>
    </nav>
  </header>
  <main>
    <router-view></router-view>
  </main>
</template>
<script setup lang="ts">
import { logout } from "../api/auth/auth";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";

const router = useRouter();
const userStore = useUserStore();
const hanldeLogout = async () => {
  try {
    await logout();
    // remove token from LocalStorage
    localStorage.removeItem("access_token");
    userStore.logout();
    // redirect to login page
    router.push("/login");
  } catch (err) {
    console.error(err);
  }
};
</script>

<style scoped lang="scss">
@import "@/styles/variables";
@import "@/styles/_mixins.scss";

.app-header {
  width: 100%;
  background-color: $surface-color;
  border-bottom: 1px solid $border-color;
  @include responsive-padding();

  .nav-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;

    .btn-logout {
      cursor: pointer;
      border: none;
      border-radius: $border-radius;
      background: $gradient-primary;
      color: $surface-color;
      font-weight: bold;
      @include responsive-padding();
      @include responsive-text();
      transition: background 0.3s ease, box-shadow 0.3s ease;

      &:hover {
        background: $gradient-accent;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }

    .nav-links {
      display: flex;
      list-style: none;
      @include responsive-gap();
      @include responsive-padding();
      @include responsive-text();
      @include responsive-margin();

      .nav-link {
        text-decoration: none;
        color: $text-color;
        @include responsive-text();
        border-radius: $border-radius;
        @include responsive-padding();
        transition: background 0.3s ease;

        &:hover {
          background: $gradient-primary;
          color: $surface-color;
        }

        &.router-link-exact-active {
          background: $gradient-accent;
          color: $surface-color;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
      }
    }
  }
}
</style>
