<template>
  <section class="menu_list">
    <div v-if="loading" class="loading-text">⏳ Loading menu...</div>
    <div v-else-if="errorMessage">{{ errorMessage }}</div>
    <div v-else-if="!menuStore.items.length" class="empty-menu">
      The menu is empty — start by adding your first item!
    </div>

    <!-- Menu items -->
    <div v-else>
      <!-- Loading / Error states -->
      <div class="toggle-search-btn-container">
        <button class="toggle-search-btn" @click="handleCloseSearch">
          {{ search ? "Close Search" : "Search Menu" }}
        </button>
      </div>

      <div class="menu_search" v-if="search">
        <div>
          <label for="searchFiled">Search Field: </label>
          <select v-model="searchField" id="searchFiled">
            <option value="name">Name</option>
            <option value="category">Category</option>
            <option value="availability">Availability</option>
          </select>
        </div>

        <div v-if="searchField !== 'availability'">
          <label for="searchFiled">Search Field: </label>
          <input
            id="searchFiled"
            type="text"
            v-model="searchQuery"
            :placeholder="`Search by ${searchField}`"
          />
        </div>
        <div v-else>
          <label>
            <input type="checkbox" v-model="showAvailable" /> Available
          </label>
          <label>
            <input type="checkbox" v-model="showUnavailable" /> Unavailable
          </label>
        </div>
      </div>

      <div
        v-for="(items, category) in filteredMenu"
        :key="category"
        class="menu_category"
      >
        <div class="menu_category_items">
          <h3 class="menu_category_heading">
            {{ category }}
          </h3>
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

const search = ref(false);
const loading = ref(false);
const errorMessage = ref("");
const searchQuery = ref("");
const searchField = ref("name");

const showAvailable = ref(true); // default: show available items
const showUnavailable = ref(true); // default: show unavailable items

const filteredMenu = computed(() => {
  const query = searchQuery.value.toLocaleLowerCase().trim();
  const groups: Record<string, any[]> = {};
  if (!query && searchField.value !== "availability") {
    for (const item of menuStore.items) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category]?.push(item);
    }
    return groups;
  }

  for (const item of menuStore.items) {
    let match = false;

    switch (searchField.value) {
      case "name":
        match = item.name.toLocaleLowerCase().includes(query);
        break;
      case "category":
        match = item.category.toLocaleLowerCase().includes(query);
        break;

      case "availability":
        match =
          (showAvailable.value && item.is_available === true) ||
          (showUnavailable.value && item.is_available === false);
        break;
    }

    if (match) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category]?.push(item);
    }
  }

  return groups;
});

const handleCloseSearch = () => {
  search.value = !search.value;
  searchQuery.value = "";
  searchField.value = "name";
};

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

.menu_category_items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.loading-text {
  @include responsive-margin();
  @include responsive-text();
  text-align: center;
}

.menu_category_heading {
  text-transform: capitalize;
  color: $text-color;
  text-shadow: 0px 10px 10px $shadow-color;
  text-align: center;
  @include responsive-margin();
  font-size: 1.5rem;
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

.menu_search {
  margin: 0px auto;
  max-width: 50%;
  padding: 5px;
  margin-top: 10px;
  @media (max-width: $breakpoint-desktop) {
    max-width: 100%;
  }
}

.toggle-search-btn-container {
  display: flex;
  justify-content: flex-end; //
  margin: 15px;
}

.toggle-search-btn {
  background-color: $secondary-color;
  color: $background-color;
  font-weight: bold;
  border: none;
  border-radius: 4px;

  padding: 10px;

  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
}
</style>
