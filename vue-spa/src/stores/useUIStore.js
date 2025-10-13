import { defineStore } from "pinia";

export const useUIStore = defineStore("ui", {
  state: () => ({
    showCTA: true,
  }),

  actions: {
    toggleCTA() {
      this.showCTA = !this.showCTA;
    },
  },
});
