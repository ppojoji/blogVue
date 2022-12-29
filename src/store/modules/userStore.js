// import api from "../../service/api";
const state = {
  appReady: false,
  loginUser: null,
  name: "good",
};
const getters = {};

const actions = {
  tryLogin(ctx, user) {
    console.log(user, ctx);
  },
};
const mutations = {
  setUser(state, user) {
    state.loginUser = user;
    console.log("완료", user);
  },
  updatePorfile(state, userpic) {
    state.loginUser.userpic = userpic;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
