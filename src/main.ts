import { createApp } from "vue";
import App from "./app/App.vue";
import { router } from "./app/routes";
import PrimeVue from "primevue/config";
import Lara from "@primevue/themes/lara";
import Button from "primevue/button";
import "primeicons/primeicons.css";
import ToastService from "primevue/toastservice";
import "./app/index.css";
import { createPinia } from "pinia";
import { definePreset } from "@primevue/themes";
import Tooltip from "primevue/tooltip";

import ConfirmationService from "primevue/confirmationservice";
const app = createApp(App);
const pinia = createPinia();
app.use(router);
app.use(pinia);
const LaraPreset = definePreset(Lara, {
  semantic: {
    primary: {
      50: "{surface.50}",
      100: "{surface.100}",
      200: "{surface.200}",
      300: "{surface.300}",
      400: "{surface.400}",
      500: "{surface.500}",
      600: "{surface.600}",
      700: "{surface.700}",
      800: "{surface.800}",
      900: "{surface.900}",
      950: "{surface.950}",
    },
    colorScheme: {
      light: {
        primary: {
          color: "{primary.950}",
          contrastColor: "#ffffff",
          hoverColor: "{primary.800}",
          activeColor: "{primary.700}",
        },
        highlight: {
          background: "{primary.950}",
          focusBackground: "{primary.700}",
          color: "#ffffff",
          focusColor: "#ffffff",
        },
      },
      dark: {
        primary: {
          color: "{primary.50}",
          contrastColor: "{primary.950}",
          hoverColor: "{primary.200}",
          activeColor: "{primary.300}",
        },
        highlight: {
          background: "{primary.50}",
          focusBackground: "{primary.300}",
          color: "{primary.950}",
          focusColor: "{primary.950}",
        },
      },
    },
  },
});

app.use(PrimeVue, {
  theme: {
    preset: LaraPreset,

    options: {
      darkModeSelector: ".p-dark",
    },
  },
});
app.use(ConfirmationService);
app.component("Button", Button);
app.use(ToastService);
app.directive("tooltip", Tooltip);

app.mount("#app");
