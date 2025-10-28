<template>
  <section class="orders">
    <h2 class="orders__heading">My Orders</h2>

    <!-- Loading State -->
    <div v-if="orderStore.loading" class="orders__loading">
      ⏳ Loading your orders...
    </div>

    <!-- Empty State -->
    <div v-else-if="orderStore.orders.length === 0" class="orders__empty">
      <p>You haven't placed any orders yet.</p>
      <router-link to="/dashboard/menu" class="orders__empty-link">
        Browse the menu 🍽️
      </router-link>
    </div>

    <!-- Orders List -->
    <div v-else class="orders__list">
      <div
        v-for="order in orderStore.orders"
        :key="order.id"
        class="orders__card"
      >
        <div class="orders__card-header">
          <h3>Order # {{ order.id }}</h3>
          <span
            class="orders__status"
            :class="{
              'orders__status--pending': order.status === 'pending',
              'orders__status--cancelled': order.status === 'cancelled',
              'orders__status--completed': order.status === 'completed',
            }"
          >
            {{ order.status }}
          </span>
        </div>

        <div class="orders__items">
          <div
            v-for="oi in order.order_items"
            :key="oi.id"
            class="orders__item"
          >
            <img
              :src="`http://127.0.0.1:8000/storage/${oi.item.photo_path}`"
              alt="item photo"
              class="orders__item-photo"
            />
            <div class="orders__item-details">
              <strong style="text-transform: capitalize">
                {{ oi.item.name }}
              </strong>
              <p>Quantity : {{ oi.quantity }}</p>
              <p>Price: {{ oi.price }} AMD</p>
            </div>
          </div>
        </div>

        <div class="orders__footer">
          <strong>Total: {{ order.total_price }} AMD</strong>

          <button
            v-if="order.status === 'pending'"
            class="orders__cancel-btn"
            @click="cancel(order.id)"
          >
            Cancel Order
          </button>
        </div>
      </div>

      <!-- Pagination -->
      <div class="orders__pagination">
        <button
          :disabled="orderStore.pagination.current_page === 1"
          @click="changePage(orderStore.pagination.current_page - 1)"
        >
          ◀ Prev
        </button>

        <span>
          Page {{ orderStore.pagination.current_page }} /
          {{ orderStore.pagination.last_page }}
        </span>

        <button
          :disabled="
            orderStore.pagination.current_page ===
            orderStore.pagination.last_page
          "
          @click="changePage(orderStore.pagination.current_page + 1)"
        >
          Next ▶
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from "vue";
import { useOrderStore } from "@/stores/orderStore";
import { useToast } from "vue-toastification";

const orderStore = useOrderStore();
const toast = useToast();

onMounted(async () => {
  try {
    await orderStore.fetchOrders(); // fetch first page
    orderStore.listenForUpdates();
  } catch (err) {
    toast.error("Failed to load orders");
  }
});

async function cancel(orderId) {
  try {
    await orderStore.cancelOrder(orderId);
    toast.success("Order cancelled successfully");
  } catch (err) {
    console.error(err);
    toast.error("Failed to cancel order");
  }
}

async function changePage(page) {
  await orderStore.fetchOrders(page);
}
</script>

<style scoped lang="scss">
@use "@/assets/styles/variables" as *;

.orders {
  max-width: 800px;
  margin: 2rem auto;
  background: $color-background;
  padding: 1.5rem;
  border-radius: $border-radius;
  box-shadow: 0 2px 8px $color-primary;

  &__heading {
    text-align: center;
    color: $color-primary;
    margin-bottom: 2rem;
  }

  &__loading,
  &__empty {
    text-align: center;
    color: $color-primary;
    font-size: 1.2rem;
  }

  &__empty-link {
    display: inline-block;
    margin-top: 1rem;
    color: $color-accent;
    font-weight: bold;
    text-decoration: underline;

    &:hover {
      color: $color-hover;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__card {
    background: white;
    padding: 1rem;
    border-radius: $border-radius-sm;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }

  &__card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    h3 {
      color: $color-primary;
      font-weight: 600;
    }
  }

  &__status {
    padding: 0.3rem 0.7rem;
    border-radius: 1rem;
    font-size: 0.9rem;
    text-transform: capitalize;

    &--pending {
      background: #fff3cd;
      color: #856404;
    }

    &--cancelled {
      background: #f8d7da;
      color: #721c24;
    }

    &--completed {
      background: #d4edda;
      color: #155724;
    }
  }

  &__items {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    flex: 1 1 calc(50% - 1rem);
    background: #fafafa;
    border-radius: $border-radius-sm;
    padding: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  &__item-photo {
    width: 60px;
    height: 60px;
    border-radius: $border-radius-sm;
    object-fit: cover;
  }

  &__item-details {
    color: $color-primary;
    font-size: 0.9rem;

    strong {
      display: block;
      margin-bottom: 0.2rem;
    }
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    color: $color-primary;
  }

  &__cancel-btn {
    background: $color-primary;
    color: $color-highlight;
    border: none;
    border-radius: $border-radius-sm;
    padding: 0.4rem 0.8rem;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
      background: $color-hover;
    }
  }

  &__pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 1.5rem;

    button {
      background: $color-primary;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: $border-radius-sm;
      cursor: pointer;
      transition: background 0.2s ease;

      &:hover:not(:disabled) {
        background: $color-hover;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
}

@media (max-width: $breakpoint-mobile) {
  .orders {
    &__item {
      flex: 1 1 100%;
    }
  }
}
</style>
