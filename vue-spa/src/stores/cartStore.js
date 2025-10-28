import { defineStore } from "pinia";
import api from "@/api/axios";
import { useOrderStore } from "./orderStore";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
  }),

  getters: {
    totalPrice: (state) =>
      state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    totalItems: (state) => state.items.reduce((sum, i) => sum + i.quantity, 0),
  },

  actions: {
    async fetchCart() {
      try {
        const res = await api.get("/user/cart");
        this.items = res.data.data.cart_items.map((ci) => ({
          id: ci.id,
          quantity: ci.quantity,
          ...ci.item,
        }));
      } catch (err) {
        console.error("Failed to fetch cart", err);
      }
    },

    async addToCart(item, quantity = 1) {
      try {
        const res = await api.post("/user/cart/add", {
          item_id: item.id,
          quantity,
        });
        const cartItem = res.data.cart_item;
        const existing = this.items.find((i) => i.id === cartItem.item.id);
        if (existing) {
          existing.quantity = cartItem.quantity;
        } else {
          this.items.push({
            id: cartItem.id,
            quantity: cartItem.quantity,
            ...cartItem.item,
          });
        }
      } catch (err) {
        console.error("Failed to add to cart", err);
      }
    },

    async updateQuantity(itemId, quantity) {
      if (quantity < 1) quantity = 1;
      try {
        await api.put(`/user/cart/update/${itemId}`, {
          item_id: itemId,
          quantity,
        });
        const existing = this.items.find((i) => i.id === itemId);
        if (existing) existing.quantity = quantity;
      } catch (err) {
        console.error("Failed to update quantity", err);
      }
    },

    async removeFromCart(itemId) {
      try {
        await api.delete(`/user/cart/remove/${itemId}`);
        this.items = this.items.filter((i) => i.id !== itemId);
      } catch (err) {
        console.error("Failed to remove item", err);
      }
    },

    async clearCart() {
      try {
        await api.delete("/user/cart/clear");
        this.items = [];
      } catch (err) {
        console.error("Failed to clear cart", err);
        throw err;
      }
    },

    // ✅ Delegate order creation to orderStore
    async checkout() {
      try {
        const orderStore = useOrderStore();
        const items = this.items.map((i) => ({
          item_id: i.id,
          quantity: i.quantity,
        }));

        const order = await orderStore.createOrder(items);
        console.log("hi order", order);

        await this.clearCart();
        return order;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
  },
});
