import { defineStore } from "pinia";
import api from "../api/axios";

import type { User } from "../types";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchUser() {
      if (this.user) return; // already fetched

      try {
        this.loading = true;
        this.error = null;

        const { data } = await api.get<{ user: User }>("/user");
        this.user = data.user;
      } catch (err: unknown) {
        if (err instanceof Error) this.error = err.message;
        else this.error = "Failed to fetch user";
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
    },
  },
});
