<!-- Authentication Layout -->
<template>
  <div class="auth-container">
    <router-view />
    <div class="go-back">
      <router-link to="/" class="go-back-link">Go back</router-link>
    </div>
  </div>

  <footer class="footer">
    <p class="footer__text">© 2025 Fireside Café. All rights reserved.</p>
  </footer>
</template>
<script setup></script>
<style lang="scss">
@use "@/assets/styles/variables" as *;
@use "@/assets/styles/mixins" as *;

.auth-container {
  @include mainContainer();
}

.footer {
  background-color: $color-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  width: 100%;
}

.footer__text {
  @include body-text();
  @include responsive-font(0.5rem, 1.5vw, 1rem);

  color: $color-highlight;
}

.go-back {
  color: $color-accent;
  padding: 0.5rem;
  text-align: center;

  .go-back-link {
    font-size: 1rem;
    color: $color-primary;
  }
}

.footer__text {
  @include body-text();
  @include responsive-font(0.9rem, 2vw, 1.1rem);

  color: $color-highlight;
}
</style>
