import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import * as orderService from "../api/adminOrderService";
import type { Order, PaginatedOrders } from "../types/order";
import { echo } from "../utils/echo";
export function useOrders() {
  const orders = ref<Order[]>([]);
  const total = ref(0);
  const perPage = ref(10);
  const currentPage = ref(1);
  const loading = ref(false);
  const searchQuery = ref("");
  const statusFilter = ref<"pending" | "confirmed" | "cancelled" | "">("");

  const totalPages = computed(() => Math.ceil(total.value / perPage.value));

  const fetchOrders = async () => {
    loading.value = true;
    try {
      const params = {
        page: currentPage.value,
        per_page: perPage.value,
        q: searchQuery.value,
        status: statusFilter.value || undefined,
      };
      const data: PaginatedOrders = await orderService.getOrders(params);
      orders.value = data.data;
      total.value = data.total;
      currentPage.value = data.current_page;
    } finally {
      loading.value = false;
    }
  };

  const handleRealtimeUpdate = (payload: any) => {
    console.log("Received Order Event:", payload);

    // Option 1: simply refetch to stay synced (recommended)
    fetchOrders();

    // Option 2 (optional): update locally without refetching
    // const updatedOrder = payload.order;
    // const index = orders.value.findIndex((o) => o.id === updatedOrder.id);
    // if (index !== -1) {
    //   orders.value[index] = updatedOrder;
    // } else {
    //   orders.value.unshift(updatedOrder); // in case of new order
    // }
  };

  // Re-fetch when filters or pagination change
  watch([currentPage, searchQuery, statusFilter], fetchOrders, {
    immediate: true,
  });

  // Subscribe to real-time order updates
  onMounted(() => {
    echo.channel("orders").listen(".order.updated", handleRealtimeUpdate);
  });

  onUnmounted(() => {
    echo.leave("orders");
  });

  return {
    orders,
    total,
    perPage,
    currentPage,
    totalPages,
    loading,
    searchQuery,
    statusFilter,
    fetchOrders,
  };
}
