import Vue from "vue";
import Vuex from "vuex";
import api from "../service/api";

import user from "./modules/userStore";
import toast from "./modules/toastStore";
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user,
    toast,
  },
});
api.user.myInfo().then((res) => {
  console.log("[로그인 확인] ", res);
  if (res.data.success) {
    // store.dispatch("tryLogin", res.data.user);
    store.commit("setUser", res.data.user);
    // store.actions.tryLogin(res.data.user)
    // store.state.loginUser = res.data.user;
    console.log("[ready]", store.state.user.appReady);
  } else {
    // 로그인 정보가 없음
  }
  store.state.user.appReady = true;
});

export default store;
