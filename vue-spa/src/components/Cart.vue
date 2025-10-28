<template>
  <section class="cart">
    <h2 class="cart__heading">Your cart</h2>

    <!-- Empty state -->
    <div v-if="cart.items.length === 0" class="cart__empty">
      Your cart is empty!
      <router-link to="/dashboard/menu" class="cart__empty-link">
        Browse the menu
      </router-link>
      to add something tasty.
    </div>

    <!-- Cart items -->
    <div v-else>
      <div v-for="i in cart.items" :key="i.id" class="cart__item">
        <img
          :src="`http://127.0.0.1:8000/storage/${i.photo_path}`"
          alt="Menu item photo"
          class="cart__item-photo"
        />
        <div>
          <strong class="cart__item-name">{{ i.name }}</strong>
          <p class="cart__item-price">{{ i.price }} AMD</p>
        </div>

        <div>
          <label>Quantity:</label>
          <input
            type="number"
            min="1"
            v-model.number="i.quantity"
            @input="i.quantity = Math.max(1, i.quantity)"
            @change="updateQuantity(i)"
            class="cart__item-quantity"
          />
        </div>

        <button
          class="cart__item-remove"
          @click="removeItem(i.id)"
          title="Remove Item"
        >
          Remove
        </button>
      </div>

      <!-- Summary -->
      <div class="cart__summary">
        <h3 class="cart__summary__total">Total: {{ cart.totalPrice }} AMD</h3>
        <button
          class="cart__summary__place-order"
          @click="placeOrder"
          :disabled="loadingOrder"
        >
          {{ loadingOrder ? "Placing..." : "Place Order" }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCartStore } from "@/stores/cartStore";
import { useToast } from "vue-toastification";
import api from "@/api/axios";
import { useRouter } from "vue-router";

const router = useRouter();

const cart = useCartStore();
const toast = useToast();
const loadingOrder = ref(false);

// Fetch cart on mount
onMounted(async () => {
  try {
    cart.fetchCart();
  } catch (err) {
    console.error(err);
  }
});

// Update quantity
async function updateQuantity(item) {
  try {
    await cart.updateQuantity(item.id, item.quantity);
  } catch (err) {
    toast.error("Failed to update quantity");
  }
}

// Remove item
async function removeItem(itemId) {
  try {
    await cart.removeFromCart(itemId);
  } catch (err) {
    toast.error("Failed to remove item");
  }
}

// Place order
async function placeOrder() {
  if (!cart.items.length) return;

  loadingOrder.value = true;
  try {
    const res = await cart.checkout();
    console.log("response: ", res);
    toast.success(
      `"Order placed successfully — Click here to view your orders.`,
      {
        timeout: 5000,
        closeOnClick: false,
        onClick: () => {
          router.push("/dashboard/my-orders");
        },
      }
    );
  } catch (err) {
    const msg =
      err.response?.data?.message || "Failed to place order. Please try again.";
    console.error(msg);
    toast.error(`Failed to place the order. Try again later.`);
  } finally {
    loadingOrder.value = false;
  }
}
</script>

<style scoped lang="scss">
@use "@/assets/styles/variables" as *;
@use "@/assets/styles/mixins" as *;

.cart {
  background: $color-background;
  padding: 1rem;
  border-radius: $border-radius;
  max-width: 600px;
  margin: 2rem auto;

  &__heading {
    font-family: $font-heading;
    font-weight: 400;
    color: $color-primary;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  &__empty {
    text-align: center;
    font-size: 1.2rem;
    color: $color-primary;

    .cart__empty-link {
      color: $color-accent;
      font-weight: 600;
      text-decoration: underline;

      &:hover {
        color: $color-hover;
      }
    }
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0.8rem 1rem;
    background: $color-background;
    border-radius: $border-radius-sm;
    gap: 1rem;
    box-shadow: 0 2px 8px $color-primary;
    margin-bottom: 1rem;

    &-photo {
      border-radius: $border-radius-sm;
      object-fit: cover;
      width: 100px;
      max-width: 30%;
      height: auto;
      flex-shrink: 0;
    }

    &-name {
      flex: 1 1 auto;
      color: $color-primary;
      text-transform: capitalize;
      min-width: 120px;
    }

    &-price {
      margin-top: 1rem;
      color: $color-green;
      font-weight: 500;
    }

    &-quantity {
      max-width: 60px;
      height: 32px;
      padding: 0 0.3rem;
      border: 1px solid $border-color;
      border-radius: $border-radius-sm;
      text-align: center;
      font-size: 1rem;
    }

    &-remove {
      background: $color-primary;
      color: $color-highlight;
      border: none;
      border-radius: $border-radius-sm;
      padding: 0.4rem 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      flex-shrink: 0;

      &:hover {
        background: $color-hover;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }

  &__summary {
    margin-top: 2rem;
    text-align: right;

    &__total {
      font-size: 1.5rem;
      color: $color-primary;
      margin-bottom: 1rem;
    }

    &__place-order {
      background: $color-green-light;
      color: $espresso;
      padding: 0.6rem 1.2rem;
      font-size: 1rem;
      border-radius: $border-radius-sm;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: $color-green;
      }
    }
  }
}

/* Responsive adjustments */
@media (max-width: $breakpoint-mobile) {
  .cart {
    padding: 1rem;

    &__item {
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;

      &-photo {
        width: 50%;
        max-width: 100%;
      }

      &-name {
        min-width: 0;
      }

      &-quantity,
      &-remove {
        width: 50%;
      }
    }

    &__summary {
      text-align: center;
    }
  }
}
</style>
