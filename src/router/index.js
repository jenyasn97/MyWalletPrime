import { getCookie } from "@/lib/utils";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/layouts/HomeLayout.vue"),
      meta: {
        auth: true,
      },
    },
    {
      path: "/orders",
      name: "orders",
      component: () => import("@/layouts/OrdersLayout.vue"),
      meta: {
        auth: true,
      },
    },
    {
      path: "/products",
      name: "products",
      component: () => import("@/layouts/ProductsLayout.vue"),
      meta: {
        auth: true,
      },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/pages/LoginPage.vue"),
      meta: {
        auth: false,
      },
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/pages/RegisterPage.vue"),
      meta: {
        auth: false,
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "404",
      component: () => import("@/pages/NotFoundPage.vue"),
      meta: {
        auth: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta.auth && !getCookie("Wallet-Access-Token")) {
    next({ name: "login" });
  } else if (!to.meta.auth && getCookie("Wallet-Access-Token")) {
    next({ name: "404" });
  } else {
    next();
  }
});

export default router;
