<!-- Landing Page Layout -->

<template>
  <section class="page-container">
    <main class="landing-page__main">
      <CafeSteam />

      <div class="ladining-page--overlay">
        <h1 class="cafe-name">Fireside Café</h1>
        <p class="quote">Where every cup tells a story.💬</p>

        <p class="call-to-action__text">
          Register now to explore our menu and place your orders online
          effortlessly.
        </p>

        <div class="call-to-action" v-show="uiStore.showCTA">
          <router-link to="/login" class="login-btn" @click="uiStore.toggleCTA"
            >Login</router-link
          >
          <router-link
            to="/register"
            class="register-btn"
            @click="uiStore.toggleCTA"
            >Register</router-link
          >
        </div>

        <router-view></router-view>
      </div>
    </main>

    <footer class="footer">
      <p class="footer__text">© 2025 Fireside Café. All rights reserved.</p>
    </footer>
  </section>
</template>

<script setup>
import CafeSteam from "@/components/CafeSteam.vue";
import { useUIStore } from "@/stores/useUIStore";

const uiStore = useUIStore();
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;
@use "@/assets/styles/mixins" as *;

.landing-page {
  // @include mainContainer();
  border: 1px solid black;
  margin: 0px;
}

.cafe-name {
  @include responsive-font(2rem, 6vw, 4rem);
  @include heading();
}

.quote {
  @include responsive-font(1rem, 3vw, 2rem);
  @include accent-text();
}

.landing-page__main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  .ladining-page--overlay {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 1.25rem;

    .call-to-action__text {
      @include body-text();
      @include responsive-font(1rem, 1.25vw, 2rem);
      // line-height: 1.5rem;
    }

    .call-to-action {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: clamp(1rem, 2vw, 2rem);
      width: 100%;
      color: $color-highlight;

      @media (max-width: $breakpoint-tablet) {
        flex-direction: column;
        .login-btn,
        .register-btn {
          width: 50%;
          flex: 1;
        }
      }
    }
  }
}
</style>
