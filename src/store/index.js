import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
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
