// import './assets/main.css'

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "@/plugins/vee-validate.js"; // global registration

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const toastOptions = {
  // default timeout
  timeout: 3000,
  position: "bottom-right",
  pauseOnHover: true,
  closeOnClick: true,
};

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(Toast, toastOptions);

app.mount("#app");
