<template>
  <header class="app-header">
    <nav class="nav-bar">
      <!-- Logo -->
      <div class="logo">
        <router-link to="/dashboard/menu">Fireside Café</router-link>
      </div>

      <!-- Navigation links -->
      <ul class="nav-links">
        <li>
          <router-link to="/dashboard/menu" class="nav-link">
            Menu
          </router-link>
        </li>
        <li>
          <router-link to="/dashboard/cart" class="nav-link">
            🛒Cart
          </router-link>
        </li>
        <li>
          <router-link to="/dashboard/my-orders" class="nav-link">
            My orderss
          </router-link>
        </li>
        <li>
          <button type="button" @click="handleLogout" class="btn-logout">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  </header>

  <main>
    <router-view></router-view>
  </main>
</template>

<script setup>
import { useCartStore } from "@/stores/cartStore";
import { useRouter } from "vue-router";

const router = useRouter();
const cartStore = useCartStore();

async function handleLogout() {
  localStorage.removeItem("access_token");
  cartStore.items = [];

  router.push("/");
}
</script>

<style scoped lang="scss">
@use "@/assets/styles/variables" as *;
@use "@/assets/styles/mixins" as *;

.app-header {
  background-color: $color-primary;
  color: $color-highlight;
  font-family: $font-body;
  padding: 0.8rem 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;

  .nav-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
  }

  // ===== Logo =====
  .logo {
    font-family: $font-heading;
    font-size: 1.3rem;

    a {
      color: $color-highlight;
      text-decoration: none;
      transition: color 0.3s ease;

      &:hover {
        color: $color-accent;
      }
    }
  }

  // ===== Nav Links =====
  .nav-links {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    list-style: none;

    li {
      .nav-link {
        color: $color-highlight;
        text-decoration: none;
        font-weight: 500;
        font-size: 1rem;
        letter-spacing: 0.5px;
        position: relative;
        transition: color 0.3s ease;

        &:hover {
          color: $color-accent;
        }

        &::after {
          content: "";
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0%;
          height: 2px;
          background-color: $color-accent;
          transition: width 0.3s ease;
        }

        &:hover::after {
          width: 100%;
        }
      }
    }

    .btn-logout {
      background-color: $color-accent;
      color: $color-primary;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: $border-radius-sm;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;

      &:hover {
        background-color: $color-hover;
        color: $color-highlight;
      }
    }
  }

  @include mobile {
    .logo {
      font-size: 1.2rem;
    }

    .nav-links {
      gap: 1rem;

      .nav-link {
        font-size: 0.9rem;
      }
    }
  }
}

main {
  background-color: $color-background;
  min-height: 100vh;
  padding: 2rem;
}
</style>
