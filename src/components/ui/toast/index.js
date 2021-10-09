import store from "../../../store";
// TODO 메소드 중복 제거 필요함
// warning 추가해야함
const success = (text, duration) => {
  console.log("[info]", text, duration);
  store.commit("addMessage", {
    text,
    type: "success",
    duration: duration || 3000,
  });
};

const info = (text, duration) => {
  console.log("[info]", text, duration);
  store.commit("addMessage", {
    text,
    type: "info",
    duration: duration || 3000,
  });
};

const error = (text, duration) => {
  console.log("[info]", text, duration);
  store.commit("addMessage", {
    text,
    type: "error",
    duration: duration || 3000,
  });
};
export default {
  success,
  info,
  error,
};
