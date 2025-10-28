import LoginForm from "@/components/auth/LoginForm.vue";
import RegisterForm from "@/components/auth/RegisterForm.vue";
import Cart from "@/components/Cart.vue";
import Menu from "@/components/Menu.vue";
import Orders from "@/components/Orders.vue";
import HomeView from "@/views/user/HomeView.vue";
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
        path: "/register",
        component: RegisterForm,
      },
    ],
  },
  {
    path: "/dashboard",
    redirect: "/dashboard/menu",
    component: HomeView,
    meta: { requiresAuth: true },
    children: [
      {
        path: "menu",
        component: Menu,
      },
      {
        path: "cart",
        component: Cart,
      },
      {
        path: "my-orders",
        component: Orders,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation gaurd
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta?.requiresAuth;
  const isLoggedIn = !!localStorage.getItem("access_token");

  if (requiresAuth && !isLoggedIn) {
    next("/login");
  } else {
    next();
  }
});

export default router;
