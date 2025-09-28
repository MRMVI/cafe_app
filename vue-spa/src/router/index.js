import { createRouter, createWebHistory } from "vue-router";
import RegisterView from "@/views/RegisterView.vue";
import Learn from "@/components/Learn.vue";
import LoginView from "@/views/LoginView.vue";

const routes = [
  { path: "/register", name: "RegisterView", component: RegisterView },
  { path: "/login", name: "LoginView", component: LoginView },
  { path: "/learn", name: "Learnview", component: Learn },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
