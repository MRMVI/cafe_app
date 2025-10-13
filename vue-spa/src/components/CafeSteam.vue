<!-- CafeSteamLogo.vue -->
<template>
  <div class="logo-container">
    <div class="steam steam-one"></div>
    <div class="steam steam-two"></div>
    <div class="steam steam-three"></div>
    <div class="steam steam-four"></div>
  </div>
  <img :src="logo" alt="Cafe Logo" class="logo" />
</template>

<script setup lang="ts">
import logo from "@/assets/logo.png";
// import logo from "@/assets/logo.png";
</script>

<style scoped lang="scss">
.logo-container {
  margin-top: 20px;
  position: relative;
  right: 50px;

  @media (max-width: $breakpoint-tablet) {
    top: -10px;
  }
}

/* Shared steam styles */
.steam {
  position: absolute;
  width: 100px;
  height: 100px;
  background-color: $cappuccino; /* replace $latte with actual color */
  border-radius: 50%;
  opacity: 0;
  z-index: 0;
}

/* Animation variants */
.steam-one {
  animation: steam-one 4s ease-out infinite;
}

.steam-three {
  animation: steam-one 4s ease-out 1s infinite;
}

.steam-two {
  animation: steam-two 4s ease-out 0.5s infinite;
}

.steam-four {
  animation: steam-two 4s ease-out 1.5s infinite;
}

/* Keyframes */
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

@keyframes steam-two {
  0% {
    transform: translateY(0) translateX(0) scale(0.25);
    opacity: 0.25;
  }
  100% {
    transform: translateY(-200px) translateX(-20px) scale(1);
    opacity: 0;
  }
}

/* Logo image */
.logo {
  width: clamp(80px, 22vw, 180px); // responsive width
  border-radius: 50%;
  border: 3px solid $color-primary;
  box-shadow: 0px 0px 25px $color-hover;
}
</style>
