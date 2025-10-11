<template>
  <section class="menu_list">
    <!-- Loading / Error states -->
    <div>
      <button
        type="button"
        class="refresh_btn"
        title="Refresh Menu"
        @click="refreshMenu"
      >
        ⟳
      </button>
      <h1 class="menu_list_heading">Menu</h1>
    </div>

    <div v-if="loading" class="loading-text">⏳ Loading menu...</div>
    <div v-else-if="errorMessage">{{ errorMessage }}</div>
    <div v-else-if="!menuStore.items.length" class="empty-menu">
      The menu is empty — start by adding your first item!
    </div>

    <!-- Menu items -->
    <div v-else>
      <div
        v-for="(items, category) in groupedMenu"
        :key="category"
        class="menu_category"
      >
        <h3 class="menu_category_heading">
          {{ category }}
        </h3>
        <div class="menu_category_items">
          <MenuItem v-for="item in items" :key="item.id" :id="item.id" />
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { useMenuStore } from "../../stores/menuStore";
import { onMounted, computed, ref } from "vue";
import MenuItem from "./MenuItem.vue";

const menuStore = useMenuStore();

const loading = ref(false);
const errorMessage = ref("");

onMounted(async () => {
  try {
    loading.value = true;
    await menuStore.fetchMenu();
  } catch (err: unknown) {
    if (err instanceof Error) errorMessage.value = err.message;
    else errorMessage.value = "Failed to fetch menu items";
  } finally {
    loading.value = false;
  }
});

const groupedMenu = computed(() => {
  const groups: Record<string, any[]> = {};

  for (const item of menuStore.items) {
    let category = item.category;
    if (!groups[category]) groups[category] = [];

    groups[category].push(item);
  }
  return groups;
});

async function refreshMenu() {
  try {
    loading.value = true;
    await menuStore.fetchMenu();
  } catch (err: unknown) {
    if (err instanceof Error) errorMessage.value = err.message;
    else errorMessage.value = "Failed to fetch menu items";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/variables";
@import "@/styles/_mixins.scss";

.empty-menu {
  text-align: center;
  padding: 3rem 0;
  @include responsive-text();
  transition: all 0.3s ease;

  // Add a subtle fade-in animation
  animation: fadeIn 0.6s ease;

  // Optional emoji animation
  &::after {
    content: " ☕";
    display: inline-block;
    animation: sparkle 1.5s ease-in-out infinite;
  }
}

// ✨ subtle sparkle animation
@keyframes sparkle {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

// 👻 fade-in for smooth appearance
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.loading-text {
  @include responsive-margin();
  @include responsive-text();
  text-align: center;
}

.menu_list_heading {
  text-align: center;
}

.menu_category_heading {
  text-transform: capitalize;
  @include responsive-margin();
  @include responsive-text();
  color: $text-color;
  text-shadow: 0px 10px 10px $shadow-color;
}
.refresh_btn {
  background-color: $background-color;
  color: $text-color;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 5px;
  font-size: 1.5rem;

  transition: 0.2s ease;
  &:hover {
    box-shadow: 0 0 8px $secondary-color;
  }
}
</style>
