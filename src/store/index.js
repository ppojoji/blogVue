import Vue from "vue";
import Vuex from "vuex";
import api from "../service/api";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    loginUser: null,
  },
  mutations: {
    setUser(state, user) {
      state.loginUser = user;
    },
  },
  actions: {},
  modules: {},
});

api.user.myInfo().then((res) => {
  console.log("[로그인 확인] ", res);
  if (res.data.success) {
    store.state.loginUser = res.data.user;
  }
});
export default store;
