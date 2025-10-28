<template>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>User</th>
          <th>Total</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td data-label="ID">{{ order.id }}</td>
          <td data-label="User">
            {{ order.user.name }} ({{ order.user.email }})
          </td>
          <td data-label="Total">{{ order.total_price }}</td>
          <td data-label="Status">{{ order.status }}</td>
          <td data-label="Actions">
            <div>
              <button
                :disabled="order.status !== 'pending'"
                @click="$emit('update-status', order.id, 'confirmed')"
                title="Confirm order"
              >
                Confirm
              </button>
              <button
                :disabled="order.status !== 'pending'"
                @click="$emit('update-status', order.id, 'cancelled')"
                title="Cancel order"
              >
                Cancel
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import type { Order } from "../types/order";

defineProps<{ orders: Order[] }>();
</script>

<style scoped lang="scss">
@import "@/styles/variables";
@import "@/styles/_mixins.scss";
.table-container {
  margin: 2rem;
  overflow-x: auto; // allow horizontal scroll on small screens
  background-color: $surface-color;
  border: 1px solid $border-color;
  border-radius: $border-radius-sm;
  box-shadow: 0 2px 4px $shadow-color;
  padding: $spacing-md;

  table {
    width: 100%;
    border-collapse: collapse;
    font-family: $font-family-base;
    font-size: $font-size-base;
    color: $text-color;

    thead {
      color: $primary-color;
      font-family: $font-family-heading;
      font-size: $font-size-lg;

      th {
        text-align: left;
        padding: $spacing-sm $spacing-md;
        border-bottom: 2px solid $primary-color;
      }
    }

    tbody {
      tr {
        border-bottom: 1px solid $border-color;

        &:hover {
          background-color: lighten($primary-color, 45%);
        }

        td {
          padding: $spacing-sm $spacing-md;
        }

        button {
          font-family: $font-family-base;
          font-size: $font-size-sm;
          padding: $spacing-xs $spacing-sm;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          margin: 0.1rem;

          &:first-of-type {
            background-color: $secondary-color;
            color: $surface-color;

            &:hover:not(:disabled) {
              background-color: darken($secondary-color, 10%);
            }
          }

          &:last-of-type {
            background-color: $error-color;
            color: $surface-color;

            &:hover:not(:disabled) {
              background-color: darken($error-color, 10%);
            }
          }

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        }
      }
    }
  }

  // Mobile responsiveness
  @media (max-width: $breakpoint-tablet) {
    table {
      font-size: $font-size-sm;

      thead {
        display: none; // hide headers on small screens
      }

      tbody {
        tr {
          display: block;
          margin-bottom: $spacing-md;
          border-bottom: 2px solid $border-color;
          padding: $spacing-sm;

          td {
            display: flex;
            justify-content: space-between;
            padding: $spacing-xs 0;

            &::before {
              content: attr(data-label);
              font-weight: bold;
              color: $text-muted;
            }
          }

          button {
          }
        }
      }
    }
  }

  @media (max-width: $breakpoint-mobile) {
    padding: $spacing-sm;
  }
}
</style>
