import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

// import global styles
import "./styles/_globals.scss";

// create Vue app
const app = createApp(App);

// create pinia instance
const pinia = createPinia();

// use pinia and router
app.use(pinia);
app.use(router);

// mount the app
app.mount("#app");
