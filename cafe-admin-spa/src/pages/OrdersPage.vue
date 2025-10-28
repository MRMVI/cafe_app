<template>
  <div>
    <OrderTable :orders="orders" @update-status="handleUpdateStatus" />
    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @page-changed="currentPage = $event"
    />
  </div>
</template>

<script lang="ts" setup>
import OrderTable from "../components/OrderTable.vue";
import Pagination from "../components/Pagination.vue";
import * as orderService from "../api/adminOrderService";
import { useOrders } from "../composables/useOrders";
import { onMounted } from "vue";

const { orders, totalPages, currentPage, fetchOrders } = useOrders();

const handleUpdateStatus = async (
  orderId: number,
  status: "confirmed" | "cancelled"
) => {
  try {
    await orderService.updateOrderStatus(orderId, status);
    // No need to refetch manually; real-time event will handle it.
  } catch (err: any) {
    alert("Error updating order");
  }
};

onMounted(async () => {
  await fetchOrders();
});
</script>
