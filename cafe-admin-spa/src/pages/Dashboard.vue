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
      <h2 class="card-heading">Statistics</h2>
      <ul>
        <li>Total Orders: 12</li>
        <li>Pending Orders: 5</li>
        <li>Completed Orders: 7</li>
        <li>Menu Items: {{ menuStore.itemCount }}</li>
        <li>Available Menu Items: {{ menuStore.availableItemCount }}</li>
      </ul>
    </div>

    <!-- Recent orders -->
    <div class="card-container">
      <h2 class="card-heading">Recent Orders</h2>
      <ul>
        <li>John Doe - $25 - new</li>
        <li>Jane Smith - $40 - preparing</li>
        <li>Mike Brown - $18 - done</li>
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
    @include responsive-padding();

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
    width: 100%;
    max-width: 400px;

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
        @include responsive-padding();
        font-family: $font-family-base;
        color: $text-color;
        @include responsive-text();
        transition: background 0.2s ease;

        &:hover {
          background: $gradient-accent;
          color: $surface-color;
        }
      }
    }
  }
}
</style>
