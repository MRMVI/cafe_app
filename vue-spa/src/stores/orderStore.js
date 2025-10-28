import { defineStore } from "pinia";
import echo from "@/plugins/echo";
import api from "@/api/axios";

export const useOrderStore = defineStore("order", {
  state: () => ({
    orders: [],
    currentOrder: null,
    loading: false,
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 5,
      total: 0,
    },
  }),

  actions: {
    async fetchOrders(page = 1) {
      this.loading = true;
      try {
        const res = await api.get(`/user/orders?page=${page}`);
        const data = res.data.data;

        // Laravel pagination returns:
        // data.data = actual orders
        // data.meta or other pagination fields may differ
        this.orders = data.data || [];
        this.pagination = {
          current_page: data.current_page,
          last_page: data.last_page,
          per_page: data.per_page,
          total: data.total,
        };
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        this.loading = false;
      }
    },

    async fetchOrder(id) {
      this.loading = true;
      try {
        const res = await api.get(`/user/orders/${id}`);
        this.currentOrder = res.data.data;
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        this.loading = false;
      }
    },

    async createOrder(items) {
      this.loading = true;
      try {
        const res = await api.post("/user/orders", { items });
        return res.data.data;
      } catch (err) {
        console.error("Failed to create order:", err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async cancelOrder(orderId) {
      this.loading = true;
      try {
        await api.put(`/user/orders/${orderId}`, { status: "cancelled" });
        // Refresh current page after cancelling
        await this.fetchOrders(this.pagination.current_page);
      } catch (err) {
        console.error("Failed to cancel order:", err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // Real-time updates
    listenForUpdates() {
      console.log("Listening for updates...");
      echo.channel("orders").listen(".order.updated", (event) => {
        const { action, order } = event;
        const index = this.orders.findIndex((o) => o.id === order.id);

        if (action === "updated" && index !== -1) {
          this.orders[index] = { ...this.orders[index], ...order };
        } else if (action === "created") {
          this.orders.unshift(order); // add new ones to the top
        }

        if (this.currentOrder?.id === order.id) {
          this.currentOrder = order;
        }
      });
    },
  },
});
