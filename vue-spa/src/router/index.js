import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/views/LandingView.vue"),
  },
  {
    path: "/register",
    component: () => import("@/layouts/AuthLayout.vue"),
    children: [
      { path: "", component: () => import("@/views/RegisterView.vue") },
    ],
  },
  {
    path: "/login",
    component: () => import("@/layouts/AuthLayout.vue"),
    children: [{ path: "", component: () => import("@/views/LoginView.vue") }],
  },
  // Admin dashboard and nested routes
  {
    path: "/dashboard",
    component: () => import("@/layouts/AdminLayout.vue"),
    meta: { requiresAdmin: true },
    children: [
      {
        path: "",
        component: () => import("@/views/admin/DashboardView.vue"),
      },
      {
        path: "add-item",
        component: () => import("@/views/admin/AddItemView.vue"),
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
  const user = JSON.parse(localStorage.getItem("user"));

  if (to.meta.requiresAdmin && (!user || user.role !== "admin")) {
    next("/login");
  } else {
    next();
  }
});

export default router;
