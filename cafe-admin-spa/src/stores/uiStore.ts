import { defineStore } from "pinia";

export const useUiStore = defineStore("ui", {
  state: () => ({
    show: true,
  }),

  actions: {
    toggleShow() {
      this.show = !this.show;
    },
    setShow(value: boolean) {
      this.show = value;
    },
  },
});
