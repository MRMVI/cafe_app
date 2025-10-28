<template>
  <section class="admin_dashboard">
    <!-- Loading state -->
    <div v-if="userStore.loading" class="loading">⏳ Loading user info...</div>

    <!-- Error state -->
    <div v-else-if="userStore.error" class="error-text">
      {{ userStore.error }}
    </div>

    <!-- User info -->
    <div v-else-if="userStore.user" class="heading">
      <h1>Welcome, {{ userStore.user.name }}!</h1>
      <div class="dashboard-tips">
        <p class="dashboard-tip">Check orders daily to keep customers happy!</p>
      </div>
    </div>

    <!-- Dashboard Cards -->
    <div class="card-container">
      <h2 class="card-heading">Menu Statistics</h2>
      <ul>
        <li>
          <span class="strong">Menu Items:</span>
          {{ menuStore.itemCount }}
        </li>
        <li>
          <span class="strong">Available Menu Items:</span>
          {{ menuStore.availableItemsCount }}
        </li>
        <li>
          <span class="strong">Unavailable Menu Items:</span>
          {{ +menuStore.itemCount - +menuStore.availableItemsCount }}
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useUserStore } from "../stores/userStore";
import { useMenuStore } from "../stores/menuStore";

const userStore = useUserStore();
const menuStore = useMenuStore();

onMounted(async () => {
  await userStore.fetchUser();
  await menuStore.fetchMenu();
});
</script>

<style scoped lang="scss">
@import "@/styles/variables";
@import "@/styles/_mixins.scss";

.admin_dashboard {
  @include responsive-flex-center();

  .loading {
    @include responsive-text();
    @include responsive-margin();
    color: $secondary-color;
  }

  .error-text {
    @include responsive-text();
    @include responsive-margin();
    color: $error-color;
  }

  .heading {
    @include responsive-text();
    @include responsive-margin();
    text-align: center;
    color: $text-color;
  }

  .dashboard-tips {
    .dashboard-tip {
      @include responsive-text();
      @include responsive-padding();
    }
  }

  .card-container {
    .card-heading {
      font-family: $font-family-heading;
      color: $primary-color;
      @include responsive-text();
      margin-bottom: $spacing-sm;
    }

    ul {
      list-style: none;

      li {
        background: $surface-color;
        border: 1px solid $border-color;
        border-radius: $border-radius;
        font-family: $font-family-base;
        color: $text-color;
        @include responsive-text();
        padding: 10px;

        &:hover {
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
          border: 1px solid rgba(59, 130, 246, 0.3);
        }
      }
    }

    .strong {
      font-weight: bold;
      color: $text-color;
    }

    width: 40%;
    @media (max-width: $breakpoint-desktop) {
      width: 60%;
    }

    @media (max-width: $breakpoint-tablet) {
      width: 80%;
    }

    @media (max-width: $breakpoint-mobile) {
      width: 100%;
    }
  }
}
</style>
