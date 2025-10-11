<template>
  <section class="menu_management">
    <MenuList />
  </section>
</template>

<script setup lang="ts">
import MenuList from "../components/menu/MenuList.vue";
</script>

<style scoped lang="scss">
@import "@/styles/variables";
@import "@/styles/_mixins.scss";

.menu_management {
  background-color: $background-color;
  color: $text-color;
  @include responsive-padding();
  border: 1px solid black;
  // display: flex;
  // flex-direction: column;
  // align-items: center;
}
</style>
