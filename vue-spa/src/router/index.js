import LoginForm from "@/components/auth/LoginForm.vue";
import RegisterForm from "@/components/auth/RegisterForm.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/views/LandingView.vue"),
    children: [
      {
        path: "/login",
        component: LoginForm,
      },
      {
        path: "/register", // ✅ fixed typo here
        component: RegisterForm,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation gaurd

export default router;
