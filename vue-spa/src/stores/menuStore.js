import { defineStore } from "pinia";
import echo from "@/plugins/echo";
import api from "@/api/axios";

export const useMenuStore = defineStore("menu", {
  state: () => ({
    items: [],
  }),

  actions: {
    // fetch menu initially when page loads
    async fetchMenu() {
      try {
        const response = await api.get("/menu");
        this.items = response.data.data;
      } catch (err) {
        console.error("Failed to fetch menu: ", err);
      }
    },
    listenForUpdates() {
      echo.channel("menu").listen(".menu.updated", (event) => {
        console.log(event);
        const { action, item } = event;
        const index = this.items.findIndex((i) => i.id === item.id);

        if (action === "deleted") {
          this.items.splice(index, 1);
        } else if (action === "updated") {
          this.items[index] = { ...this.items[index], ...item };
        } else if (action === "created") {
          this.items.push(item);
        }
      });
    },
  },
});
