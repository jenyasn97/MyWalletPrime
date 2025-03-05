import { getCookie } from "@/lib/utils";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "dashBoard",
      component: () => import("@/layouts/DashBoardLoyaut.vue"),
      meta: {
        auth: true,
      },
    },
    {
      path: "/signin",
      name: "signin",
      component: () => import("@/layouts/LoginLoyaut.vue"),
      meta: {
        auth: false,
      },
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("@/layouts/RegisterLoyaut.vue"),
      meta: {
        auth: false,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta.auth && !getCookie("Wallet-Access-Token")) {
    next({ name: "signin" });
  } else if (!to.meta.auth && getCookie("Wallet-Access-Token")) {
    next({ name: "dashBoard" });
  } else {
    next();
  }
});

export default router;
