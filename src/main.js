import "./assets/style.css";
import "primeicons/primeicons.css";
import "/api";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import ToastService from "primevue/toastservice";

import PrimeVue from "primevue/config";
import Lara from "@primeuix/themes/lara";
import { definePreset } from "@primeuix/themes";

const MyPreset = definePreset(Lara, {
  semantic: {
    primary: {
      50: "{blue.50}",
      100: "{blue.100}",
      200: "{blue.200}",
      300: "{blue.300}",
      400: "{blue.400}",
      500: "{blue.500}",
      600: "{blue.600}",
      700: "{blue.700}",
      800: "{blue.800}",
      900: "{blue.900}",
      950: "{blue.950}",
    },
  },
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ToastService);
app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: false || "none",
    },
  },
});

app.mount("#app");
