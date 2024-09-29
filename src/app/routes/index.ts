import { createRouter, createWebHistory } from "vue-router";
import { MainPage } from "../../pages/home";
import { LoginPage } from "../../pages/auth/login";
import { RegistrationPage } from "../../pages/auth/registration";
import { WorkspacePage } from "../../pages/workspace";
import { useAuthStore } from "../../entities/auth/model/store";
import { SettingsPages } from "../../pages/settings";
import { StatisticPage } from "../../pages/statistic";
import { BalancerPage } from "../../pages/balancer";

const routes = [
  {
    path: "/",
    name: "main",
    component: MainPage,
  },
  {
    path: "/settings",
    name: "settings",
    component: SettingsPages,
    meta: {
      requiresAuth: true,
      title: "Settings",
    },
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
    meta: {
      requiresNotAuth: true,
      title: "Login",
    },
  },
  {
    path: "/workspace",
    name: "workspace",
    component: WorkspacePage,
    meta: { requiresAuth: true, title: "Workspace" },
  },
  {
    path: "/invite/:inviteString?",
    name: "Workspace",
    component: WorkspacePage,
  },
  {
    path: "/statistic",
    name: "statistic",
    component: StatisticPage,
    meta: { requiresAuth: true, title: "Statistic" },
  },
  {
    path: "/signUp",
    name: "registration",
    component: RegistrationPage,
    meta: {
      requiresNotAuth: true,
      title: "Registration",
    },
  },
  {
    path: "/balancer",
    name: "balancer",
    component: BalancerPage,
    meta: {
      requiresAuth: true,
      title: "Balancer",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  await authStore.userData();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: "login" });
  } else if (to.meta.requiresNotAuth && authStore.isAuthenticated) {
    next({ name: "workspace" });
  } else {
    next();
  }
});

export { router };
