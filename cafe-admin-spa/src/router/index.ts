import { createRouter, createWebHistory } from "vue-router";
import RegisterForm from "../components/RegisterForm.vue";
import LoginForm from "../components/LoginForm.vue";
import Layout from "../layouts/layout.vue";

const routes = [{
    path: "/dashboard", 
    component: Layout, 
    meta: {requiresAuth: true}
}, 
{
    path: "/register", 
    component: RegisterForm
}, 
{
    path: "/login", 
    component: LoginForm
}
];

const router = createRouter({
    history: createWebHistory(), 
    routes
});

// navigation guard runs before each route change
router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem("access_token");

    if (to.meta.requiresAuth && !isAuthenticated) {
        next("/login");
    } else if ((to.path === "/login" || to.path === "/register") && isAuthenticated) {
        next("/dashboard");
    } else {
        next();
    }
});

export default router;