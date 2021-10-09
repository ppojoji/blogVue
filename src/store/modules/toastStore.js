let seq = 0;
const nextInt = () => {
  return seq++;
};
const state = {
  messages: [],
};

const getters = {};

const actions = {};

const mutations = {
  addMessage(state, msg) {
    msg.seq = nextInt();
    state.messages.push(msg);
    if (msg.duration > 0) {
      msg.timeout = setTimeout(() => {
        this.commit("deleteMessage", msg);
      }, msg.duration);
    }
  },
  deleteMessage(state, msg) {
    console.log("[mutation] delete", msg);
    const index = state.messages.findIndex((m) => m.seq === msg.seq);
    console.log(index);
    state.messages.splice(index, 1);
    clearTimeout(msg.timeout);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
