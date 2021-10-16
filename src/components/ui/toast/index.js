import store from "../../../store";
// TODO 메소드 중복 제거 필요함
const type = (type, text, duration) => {
  console.log("[info]", text, duration);
  store.commit("addMessage", {
    text,
    type: `${type}`,
    duration: duration || 3000,
  });
};

const success = (text, duration) => {
  type("success", text, duration);
};

const info = (text, duration) => {
  type("info", text, duration);
};

const warning = (text, duration) => {
  type("warning", text, duration);
};

const error = (text, duration) => {
  type("error", text, duration);
};

export default {
  success,
  info,
  warning,
  error,
};
