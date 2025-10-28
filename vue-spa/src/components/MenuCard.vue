<template>
  <div class="menu__card">
    <img
      class="menu__photo"
      :src="`http://127.0.0.1:8000/storage/${item.photo_path}`"
      alt="Menu item photo"
    />
    <div class="menu__info">
      <h4 class="menu__name">{{ item.name }}</h4>
      <p class="menu__description">{{ item.description }}</p>
      <p
        class="menu__availability"
        :class="item.is_available ? 'available' : 'unavailable'"
      >
        {{ item.is_available ? "Available" : "Unavailable" }}
      </p>
      <p class="menu__price">{{ item.price }} AMD</p>
      <div class="menu__quantity" v-if="item.is_available">
        <label>Quantity:</label>
        <input
          type="number"
          min="1"
          v-model.number="quantity"
          @input="validateQuantity"
        />
      </div>
      <button
        class="menu__btn"
        :disabled="!item.is_available || loading"
        @click="addToCart"
      >
        {{ loading ? "Adding..." : "Add to cart" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useCartStore } from "@/stores/cartStore";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";

const props = defineProps({
  item: Object,
});

const quantity = ref(1);
const loading = ref(false);
const cartStore = useCartStore();
const toast = useToast();
const router = useRouter();

// Ensure quantity is at least 1
function validateQuantity() {
  if (!quantity.value || quantity.value < 1) quantity.value = 1;
}

async function addToCart() {
  try {
    validateQuantity();
    loading.value = true;

    await cartStore.addToCart(props.item, quantity.value);

    toast.success(`${props.item.name} added to cart (${quantity.value})`, {
      timeout: 3500,
      onClick: () => {
        router.push("/dashboard/cart");
      },
    });

    quantity.value = 1; // reset input
  } catch (err) {
    console.error(err);
    toast.error("Failed to add item to cart");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped lang="scss">
.menu__card {
  background-color: $color-background;
  border-radius: $border-radius;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .menu__photo {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  .menu__info {
    padding: 1rem;

    .menu__name {
      font-family: $font-heading;
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
      color: $color-primary;
      text-transform: capitalizecd;
    }

    .menu__description {
      font-family: $font-body;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .menu__availability {
      font-weight: 600;
      margin-bottom: 0.5rem;

      &.available {
        color: green;
      }

      &.unavailable {
        color: red;
      }
    }

    .menu__price {
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .menu__quantity {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;

      input {
        width: 60px;
        padding: 0.25rem;
        border-radius: $border-radius-sm;
        border: 1px solid $border-color;
        text-align: center;
      }
    }

    .menu__btn {
      background-color: $color-primary;
      color: $color-highlight;
      border: none;
      border-radius: $border-radius-sm;
      padding: 0.5rem 1rem;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;

      &:hover:not(:disabled) {
        background-color: $color-hover;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }
}

/* Responsive */
@media (max-width: $breakpoint-tablet) {
  .menu__card {
    .menu__photo {
      height: 150px;
    }
  }
}
</style>
