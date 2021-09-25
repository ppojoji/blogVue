import axios from "axios";
axios.defaults.baseURL = "http://localhost:8888/blog";
axios.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});

const cate = {
  all: () => {
    return axios.get("/api/cates");
  },
  insertCate: (cateName) => {
    const form = new FormData();
    form.append("cate", cateName);
    return axios.post("api/cate", form);
  },
};
/**
 * 사용자 관련 api
 */
const user = {
  login: (id, pwd) => {
    console.log("여기로 로그인 api 호출 코드 가져옴", id, pwd);
  },
  myInfo: () => {
    return axios.get("/api/myinfo");
  },
  logout: () => {
    return axios.get("/logout");
  },
};
/**
 * 게시물 관련 api
 */
const post = {
  all: () => {
    return axios.get("/api/posts");
  },
  findByCate: (cateSeq) => {
    console.log("카테고리 시퀀스", cateSeq);
    return axios.get("/api/posts/cate/" + cateSeq);
  },
  detail: (postSeq) => {
    console.log("여기서 날림!");
    return axios.get("/api/readPosts/" + postSeq);
  },
  remove: (postSeq) => {
    const params = new URLSearchParams();
    params.append("pid", postSeq);
    console.log("글 삭제", postSeq);
    return axios.post("/article/api/delete", params);
  },
  write: (title, contents, upfiles, cates) => {
    const form = new FormData();
    form.append("title", title);
    form.append("contents", contents);
    form.append("cate", cates);

    upfiles.forEach((file) => {
      form.append("files", file);
    });
    return axios.post("/article/api/write", form, {
      headers: {
        "Content-Type": "multipart/formdata",
      },
    });
  },
  update: (postSeq, title, contents, cateSeq) => {
    console.log("수정!");

    const form = new FormData();
    form.append("title", title);
    form.append("contents", contents);
    form.append("cateSeq", cateSeq);

    return axios.post("/article/api/update/" + postSeq, form, {
      headers: {
        "Content-Type": "multipart/formdata",
      },
    });
  },
  overviews: () => {
    return axios.get("/api/post/overviews");
  },
};

export default {
  cate,
  user,
  post,
};
