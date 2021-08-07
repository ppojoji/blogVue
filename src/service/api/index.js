import axios from "axios";
axios.defaults.baseURL = "http://localhost:8888/blog";
axios.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});

/**
 * 사용자 관련 api
 */
const user = {
  login: (id, pwd) => {
    console.log("여기로 로그인 api 호출 코드 가져옴", id, pwd);
  },
};
/**
 * 게시물 관련 api
 */
const post = {
  all: () => {
    return axios.get("/api/posts");
  },
  detail: (postSeq) => {
    console.log("여기서 날림!");
    return axios.get("/api/readPosts/" + postSeq);
  },
  remove: (postSeq) => {
    const params = new URLSearchParams();
      params.append("pid", postSeq);
    console.log("글 삭제", postSeq);
    return axios.post("/article/api/delete",params )
  },
  update: (postSeq) => {
    console.log("수정!");
    return axios.get("/article/replies/" + postSeq);
  },
};

export default {
  user,
  post,
};
