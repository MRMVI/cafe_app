<template>
  <section class="welcome">
    <h1 class="heading">Welcome to Fireside Café Admin Portal!</h1>
    <p>Manage menus and track customer orders easily.</p>

    <div
      class="buttons-container"
      v-if="uiStore.show"
      @click="uiStore.toggleShow"
    >
      <router-link to="/login" class="btn" active-class="btn-active"
        >Admin Login</router-link
      >
      <router-link to="/register" class="btn" active-class="btn-active"
        >Create Admin Account</router-link
      >
    </div>

    <div v-else>
      <router-view></router-view>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useUiStore } from "../stores/uiStore";

const uiStore = useUiStore();

onMounted(() => {
  uiStore.setShow(true);
});
</script>

<style scoped lang="scss">
@import "@/styles/variables";
@import "@/styles/_mixins.scss";

.welcome {
  min-height: 100vh;
  @include responsive-flex-center();

  .heading {
    text-align: center;
    @include responsive-margin();
  }

  .buttons-container {
    @include responsive-flex-center();
  }

  .btn {
    text-align: center;
    text-decoration: none;
    color: $surface-color;
    border-radius: $border-radius;
    cursor: pointer;
    @include responsive-padding();
    @include responsive-text();

    background: $gradient-primary;
    transition: background 0.2s ease, box-shadow 0.3s ease;

    &:hover {
      background: $gradient-accent;
    }

    &.btn-active {
      background: $gradient-accent;
    }
  }
}
</style>
