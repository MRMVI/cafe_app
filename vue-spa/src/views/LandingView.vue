<!-- Landing Page Layout -->

<template>
  <section class="landing-page">
    <main class="landing-page__main">
      <div class="logo-container">
        <div id="wrap">
          <div id="steam" class="steam-one"></div>
          <div id="steam" class="steam-two"></div>
          <div id="steam" class="steam-three"></div>
          <div id="steam" class="steam-four"></div>
        </div>
        <img :src="logo" alt="Cafe Logo" class="logo" />
      </div>

      <div class="ladining-page--overlay">
        <h1 class="cafe-name">Fireside Café</h1>
        <p class="quote">Where every cup tells a story.💬</p>

        <p class="call-to-action__text">
          Register now to explore our menu and place your orders online
          effortlessly.
        </p>

        <div class="call-to-action">
          <router-link to="/login" class="login-btn">Login</router-link>
          <router-link to="/register" class="register-btn"
            >Register</router-link
          >
        </div>
      </div>
    </main>

    <footer class="footer">
      <p class="footer__text">© 2025 Fireside Café. All rights reserved.</p>
    </footer>
  </section>
</template>

<script setup>
import logo from "@/assets/logo.png";
</script>

<style lang="scss">
@use "@/assets/styles/variables" as *;
@use "@/assets/styles/mixins" as *;
#wrap {
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
}
#steam {
  position: absolute;
  width: 150px;
  height: 150px;
  background-color: $latte;
  border-radius: 50%;
  margin-left: 75px;
  margin-top: -75px;
  z-index: 0;
  opacity: 0;
}
.steam-one {
  animation: steam-one 4s ease-out infinite;
}
.steam-three {
  animation: steam-one 4s ease-out 1s infinite;
}
@keyframes steam-one {
  0% {
    transform: translateY(0) translateX(0) scale(0.25);
    opacity: 0.25;
  }
  100% {
    transform: translateY(-200px) translateX(20px) scale(1);
    opacity: 0;
  }
}
.steam-two {
  animation: steam-two 4s ease-out 0.5s infinite;
}
.steam-four {
  animation: steam-two 4s ease-out 1.5s infinite;
}
@keyframes steam-two {
  0% {
    transform: translateY(0) translateX(0) scale(0.25);
    opacity: 0.5;
  }
  100% {
    transform: translateY(-200px) translateX(-20px) scale(1);
    opacity: 0;
  }
}

.logo-container {
  position: relative;
  display: flex;
  justify-content: center;
}

.logo {
  width: clamp(80px, 22vw, 180px); // responsive width
  border-radius: 50%;
  border: 3px solid $color-primary;
  box-shadow: 0px 0px 25px $color-hover;
}

.cafe-name {
  @include responsive-font(2rem, 6vw, 4rem);
  @include heading();
}

.quote {
  @include responsive-font(1rem, 3vw, 2rem);
  @include accent-text();
}

.landing-page {
  @include mainContainer();
}

.landing-page__main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .ladining-page--overlay {
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: center;

    gap: clamp(1rem, 2vw, 2rem);

    .call-to-action__text {
      @include body-text();
      @include responsive-font(1rem, 1.25vw, 2rem);
      line-height: 1.5rem;
    }

    .call-to-action {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: clamp(1rem, 2vw, 2rem);

      @media (max-width: 600px) {
        flex-direction: column;

        a {
          width: 50%; // each button takes full width
        }
      }
    }
  }
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
</style>
