import { defineStore } from "pinia";
import api from "../api/axios";
import type { DestroyItemResponse, Item } from "../types";

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  photo_path: string;
  price: number;
  is_available: boolean;
  category: "beverages" | "food" | "specials" | "extras";
  created_at?: string;
  updated_at?: string;
}

export interface GetMenuItemsResponse {
  message: string;
  data: MenuItem[];
}
export const useMenuStore = defineStore("menu", {
  state: () => ({
    items: [] as MenuItem[],
    fetchMenuErroMessages: [] as string[],
    createMenuItemErrorMessages: [] as string[],
    updateMenuItemErrorMessages: [] as string[],
    deleteMenuItemErrorMessages: [] as string[],
  }),

  getters: {
    itemCount: (state) => state.items.length,
    availableItemCount: (state) =>
      state.items.filter((item) => item.is_available === true).length,
    getItem: (state) => {
      return (id: number) => state.items.find((item) => item.id === id);
    },
  },

  actions: {
    // fetch menu items from Laravel API
    async fetchMenu() {
      try {
        const response = await api.get<GetMenuItemsResponse>("/admin/items");
        this.items = response.data.data;
      } catch (err: unknown) {
        throw err;
      }
    },

    async createMenuItem(payload: Item) {
      try {
        this.createMenuItemErrorMessages = [];

        const response = await api.post("/admin/items", payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        this.items.push({ ...response.data.data });
      } catch (err: any) {
        const errorObj = err.response?.data?.errors;
        if (errorObj) {
          this.createMenuItemErrorMessages = Object.values(
            errorObj
          ).flat() as string[];
        } else {
          this.createMenuItemErrorMessages = [
            err.message || "Failed to add an item.",
          ];
        }
        throw err;
      }
    },

    async updateMenuItem(id: number, payload: Partial<Item>) {
      console.log("payload", payload);
      try {
        const response = await api.patch(`/admin/items/${id}`, payload);

        const updatedItem = { ...response.data.data };

        const index = this.items.findIndex((item) => item.id === +id);
        if (index !== -1) {
          this.items[index] = { ...this.items[index], ...updatedItem };
        }

        return updatedItem;
      } catch (err: unknown) {
        console.error(err);
        throw err;
      }
    },

    async deleteMenuItem(id: string) {
      try {
        await api.delete<DestroyItemResponse>(`/admin/items/${id}`);
        this.items = this.items.filter((item) => item.id !== +id);
      } catch (err: any) {
        throw err;
      }
    },
  },
});
