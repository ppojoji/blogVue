import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

console.log("[ENV] MODE : ", process.env.VUE_APP_MODE);
console.log("[ENV] BACKEND : ", process.env.VUE_APP_BACKEND_HOST);

new Vue({
  router,
  store,
  render: function (h) {
    return h(App);
  },
}).$mount("#app");
