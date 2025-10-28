<template>
  <section class="menu">
    <h2 class="menu__heading">Our Menu</h2>

    <!-- Empty state -->
    <div v-if="menuStore.items.length === 0" class="menu__empty">
      <img
        src="/src/assets/images/empty_plate.jpg"
        alt="Empty plate"
        class="menu__empty-img"
      />
      <p class="menu__empty-text">
        ☕ We’re preparing something delicious! <br />
        Please check back soon.
      </p>
    </div>

    <!-- Menu categories -->
    <div
      v-else
      v-for="(items, category) in groupedMenu"
      :key="category"
      class="menu__category"
    >
      <h2 class="menu__category-title">{{ category }}</h2>

      <!-- This is the grid container -->
      <div class="menu__grid">
        <MenuCard v-for="item in items" :key="item.id" :item="item" />
      </div>
    </div>
  </section>
</template>

<script setup>
import MenuCard from "./MenuCard.vue";
import { useMenuStore } from "@/stores/menuStore";
import { computed, onMounted, ref } from "vue";

const menuStore = useMenuStore();

onMounted(async () => {
  await menuStore.fetchMenu();
  menuStore.listenForUpdates();
});

const groupedMenu = computed(() => {
  const grouped = {};
  for (const item of menuStore.items) {
    // Handle different category formats safely
    const categoryName = item.category;

    if (!grouped[categoryName]) grouped[categoryName] = [];
    grouped[categoryName].push(item);
  }
  return grouped;
});
</script>

<style scoped lang="scss">
@use "@/assets/styles/variables" as *;
@use "@/assets/styles/mixins" as *;

.menu__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 3rem;
  padding: 2rem;
  color: $color-primary;
  animation: fadeIn 0.8s ease-in-out;
}

.menu__empty-img {
  width: 60%;
  max-width: 300px;
  height: auto;
  margin-bottom: 1.5rem;
  border-radius: $border-radius-sm;
  object-fit: cover;
  box-shadow: 0 4px 20px $color-primary;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.menu__empty-text {
  font-size: 1.2rem;
  line-height: 1.8;
  color: $color-primary;
  max-width: 400px;
  margin: 0 auto;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 600px) {
  .menu__empty {
    margin-top: 2rem;
    padding: 1.5rem;
  }

  .menu__empty-img {
    width: 80%;
    max-width: 220px;
  }

  .menu__empty-text {
    font-size: 1rem;
  }
}
</style>
