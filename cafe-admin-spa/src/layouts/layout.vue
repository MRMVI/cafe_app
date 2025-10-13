<template>
  <header class="app-header">
    <nav class="nav-bar">
      <!-- Logo or brand -->
      <div class="logo">
        <router-link to="/dashboard">Fireside Café</router-link>
      </div>

      <!-- Hamburger menu for mobile -->
      <button class="hamburger" @click="toggleMenu">
        <span :class="{ open: menuOpen }"></span>
        <span :class="{ open: menuOpen }"></span>
        <span :class="{ open: menuOpen }"></span>
      </button>

      <!-- Navigation links -->
      <ul :class="['nav-links', { open: menuOpen }]">
        <li>
          <router-link to="/dashboard" class="nav-link" @click="closeMenu"
            >Dashboard</router-link
          >
        </li>
        <li>
          <router-link to="/dashboard/menu" class="nav-link" @click="closeMenu"
            >Menu</router-link
          >
        </li>
        <li>
          <router-link
            to="/dashboard/add-item"
            class="nav-link"
            @click="closeMenu"
            >Add Item</router-link
          >
        </li>
        <li>
          <router-link
            to="/dashboard/orders"
            class="nav-link"
            @click="closeMenu"
            >Orders</router-link
          >
        </li>
        <li>
          <button type="button" @click="handleLogout" class="btn-logout">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  </header>
  <main><router-view></router-view></main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";
import { logout } from "../api/auth/auth";

const router = useRouter();
const userStore = useUserStore();

const menuOpen = ref(false);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const closeMenu = () => {
  menuOpen.value = false;
};

const handleLogout = async () => {
  try {
    await logout();
    localStorage.removeItem("access_token");
    userStore.logout();
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

  .nav-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    //position: relative;

    .logo a {
      text-decoration: none;
      font-weight: bold;
      font-size: 1.5rem;
      color: #3e2723;
      font-family: $font-heading;
    }

    /* Hamburger Menu */
    .hamburger {
      display: none;
      flex-direction: column;
      justify-content: space-around;
      width: 25px;
      height: 20px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;

      span {
        display: block;
        width: 100%;
        height: 3px;
        background: $text-color;
        border-radius: 2px;
        transition: all 0.3s ease;
      }

      span.open:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
      }
      span.open:nth-child(2) {
        opacity: 0;
      }
      span.open:nth-child(3) {
        transform: rotate(-45deg) translate(5px, -5px);
      }
    }

    /* Nav links */
    .nav-links {
      margin: 10px;
      list-style: none;
      gap: 1.5rem;
      display: flex;
      align-items: center;

      li {
        margin-top: 5px;

        .nav-link {
          text-decoration: none;
          padding: 5px 10px;
          border-radius: $border-radius-sm;
          transition: background 0.3s ease, color 0.3s ease;

          &:hover {
            background: $gradient-primary;
            color: $surface-color;
          }

          &.router-link-exact-active {
            background: $gradient-accent;
            color: $surface-color;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          }
        }

        .btn-logout {
          cursor: pointer;
          border: none;
          border-radius: $border-radius-sm;
          background: $gradient-primary;
          color: $surface-color;
          font-weight: bold;
          padding: 5px 10px;
          transition: background 0.3s ease, box-shadow 0.3s ease;

          &:hover {
            background: $gradient-accent;
          }
        }
      }
    }
  }

  /* Mobile responsiveness */
  @media (max-width: $breakpoint-desktop) {
    .app-header,
    .nav-bar {
      flex-wrap: wrap;

      .hamburger {
        display: flex;
      }

      .nav-links {
        flex-direction: column;
        max-height: 0;
        width: 100%;
        align-items: flex-start;

        overflow: hidden;
        transition: max-height 0.3s ease;

        &.open {
          max-height: 500px; /* enough to show all items */
        }

        li {
          .nav-link,
          .btn-logout {
            text-align: center;
            margin: 5px 0;
          }
        }
      }
    }
  }
}
</style>
