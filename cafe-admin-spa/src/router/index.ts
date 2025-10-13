import { createRouter, createWebHistory } from "vue-router";
import RegisterForm from "../components/RegisterForm.vue";
import LoginForm from "../components/LoginForm.vue";
import Layout from "../layouts/layout.vue";
import Dashboard from "../pages/Dashboard.vue";
import OrdersPage from "../pages/OrdersPage.vue";
import AddMenuItemForm from "../components/menu/AddMenuItemForm.vue";
import WelcomePage from "../pages/WelcomePage.vue";
import MenuList from "../components/menu/MenuList.vue";

const routes = [
  {
    path: "/",
    component: WelcomePage,
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
  {
    path: "/dashboard",
    component: Layout,
    meta: { requiresAuth: true }, // parent gaurd, works for every child
    children: [
      {
        path: "",
        component: Dashboard,
      },
      {
        path: "menu",
        component: MenuList,
      },
      {
        path: "add-item",
        component: AddMenuItemForm,
      },
      {
        path: "orders",
        component: OrdersPage,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("access_token");

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (
    (to.path === "/login" || to.path === "/register") &&
    isAuthenticated
  ) {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;
