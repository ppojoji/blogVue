import axios from "axios";
axios.defaults.baseURL = process.env.VUE_APP_BACKEND_HOST;
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
  // updateCate: (cateSeq, cateName) => {
  //   return axios.put(`api/cate/${cateSeq}/name`, { value: cateName });
  // },
  updateCate: (cateSeq, prop, value) => {
    return axios.put(`api/cate/${cateSeq}`, { prop, value });
  },

  /*
  updateCateUse: (cateSeq, yesNo) => {
    return axios.put(`api/cate/${cateSeq}/useYn`, { value: yesNo });
  },
  updateCateReplay: (cateSeq, yesNo) => {
    return axios.put(`api/cate/${cateSeq}/replyYN`, { value: yesNo });
  },
  */
  deleteCate: (cateSeq) => {
    return axios.delete(`api/cate/${cateSeq}`);
  },
  changeOrder: (srcCateSeq, dstCateSeq) => {
    return axios.put(`api/cate/order/${srcCateSeq}/${dstCateSeq}`);
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
  join: (singUp) => {
    const form = new FormData();
    form.append("id", singUp.id);
    form.append("email", singUp.email);
    form.append("pwd", singUp.pwd);
    form.append("pwhint", singUp.pwhint);
    form.append("pwhintans", singUp.pwhintans);
    return axios.post("/user/join", form);
  },
  checkProp: (prop, value) => {
    return axios.get("/user/join/checked", { params: { prop, value } });
  },
  hint: (hint) => {
    const form = new FormData();
    form.append("email", hint.email);
    form.append("hint", hint.pwhint);
    form.append("hintAns", hint.pwAns);
    return axios.post(`/api/user/hint`, form);
  },
};
const bookMark = {
  bookMark: (postSeq) => {
    // who:34
    // what: 938
    // bmk <> un bookmark
    return axios.post(`/user/bookmark/${postSeq}`);
  },
  removeBookMark: (postSeq) => {
    // who:34
    // what: 938
    // bmk <> un bookmark
    return axios.delete(`/user/bookmark/${postSeq}`);
  },
  loadBookMark: () => {
    return axios.get("/api/bookmarks");
  },
};
/**
 * 게시물 관련 api
 */
const post = {
  all: () => {
    return axios.get("/api/posts");
  },
  allForAdmin: () => {
    return axios.get("/api/admin/posts");
  },
  findByCate: (cateName) => {
    console.log("카테고리 이름", cateName);
    return axios.get("/api/posts/cate/" + cateName);
  },
  detail: (postSeq) => {
    console.log("여기서 날림!");
    return axios.get("/api/readPosts/" + postSeq);
  },
  remove: (postSeq) => {
    const form = new FormData();
    form.append("pid", postSeq);
    console.log("글 삭제", postSeq);
    return axios.post("/article/api/delete", form);
  },
  write: (title, contents, upfiles, cates, tags) => {
    const form = new FormData();
    form.append("title", title);
    form.append("contents", contents);
    form.append("cate", cates);

    const tagSeqList = tags.map((t) => t.seq);
    form.append("tag", tagSeqList);
    // tag: [34, 56, 78]

    upfiles.forEach((file) => {
      form.append("files", file);
    });
    return axios.post("/article/api/write", form, {
      headers: {
        "Content-Type": "multipart/formdata",
      },
    });
  },
  /**
   * 글 편집화면에서 첨부한 파일을 서버에 업로드합니다.
   */
  uploadFile: (postSeq, file) => {
    const form = new FormData();
    form.append("file", file);

    return axios.post("/article/api/upFile/" + postSeq, form, {
      headers: {
        "Content-Type": "multipart/formdata",
      },
    });
  },
  deleteFile: (genName) => {
    return axios.delete("/article/api/deleteFile/" + genName);
  },
  update: (postSeq, title, contents, cateSeq, tags) => {
    console.log("수정!");

    const tagSeqList = tags.map((t) => t.seq);
    const form = new FormData();
    form.append("title", title);
    form.append("contents", contents);
    form.append("cateSeq", cateSeq);
    form.append("tag", tagSeqList);

    /*
    [{seq, }, {seq, }, {seq, }] => [seq, seq, seq, ...]
    */

    return axios.post("/article/api/update/" + postSeq, form, {
      headers: {
        "Content-Type": "multipart/formdata",
      },
    });
  },
  overviews: () => {
    return axios.get("/api/post/overviews");
  },
  updateProp: (postSeq, prop, value) => {
    return axios.put(`/api/post/${postSeq}`, { prop, value });
  },
  findByTag: (tagSeq) => {
    return axios.get(`/api/post/tag/${tagSeq}`);
  },
  /**
   * 주어진 태그를 조회함
   * @param {태그명} tagName
   * @returns
   */
  tagInsert: (tagName) => {
    return axios.get(`/api/tagSelect/${tagName}`);
  },
  userPostBan: (postSeq, banCode) => {
    return axios.post(`/api/post/${postSeq}/ban/${banCode}`);
  },
};

const reply = {
  /**
   * 답글 신고하기
   * @param {int} replySeq
   * @param {string} banCode
   * @returns
   */
  ban: (replySeq, banCode) => {
    return axios.post(`/article/reply/${replySeq}/ban/${banCode}`);
  },
  replyInsert: (postSeq, contents) => {
    // 하나 빠진 값이 있음.
    const form = new FormData();
    form.append("parent", postSeq);
    form.append("contents", contents);
    return axios.post("/article/replyPost", form, {
      headers: {
        "Content-Type": "multipart/formdata",
      },
    });
  },
  selectReply: (postSeq) => {
    return axios.get(`/article/replies/${postSeq}`);
  },
  removeReply: (replySeq) => {
    return axios.delete(`/article/reply/${replySeq}`);
  },
};

const tag = {
  posts: () => {
    return axios.get(`/api/postBytag`);
  },
};
const admin = {
  post: {
    list: (banTypes) => {
      /*
      /admin/api/posts/AD
      /admin/api/posts/PN
      /admin/api/posts/AD,PN

      */
      //  Cannot read properties of undefined (reading 'join')"
      const searchType = banTypes.join(",");
      return axios.get(`/admin/api/posts/${searchType}`);
    },
    delY: () => {
      return axios.get("/admin/api/posts/del");
    },
    delete: (postSeq) => {
      return axios.delete(`/admin/api/delete/${postSeq}`);
    },
    policy: (postSeq, code) => {
      return axios.post(`/admin/api/post/${postSeq}/policy/${code}`);
    },
    clearBan: (postSeq) => {
      return axios.post(`/admin/api/post/${postSeq}/policy/null`);
    },
    banHistory: (postSeq) => {
      return axios.get(`/admin/api/post/${postSeq}/ban`);
    },
  },
  cate: {},
  user: {},
  ban: {
    loadBanPostList: () => {
      return axios.get(`/admin/api/ban/post`);
    },
    loadBanReplyList: () => {
      return axios.get(`/admin/api/ban/reply`);
    },
    loadBanList: (type) => {
      return axios.get(`/admin/api/ban/${type}`);
    },
    // insertApprove: (banSeq) => {
    //   return axios.post(`admin/api/ban/${banSeq}/approve`);
    // },
    // insertReject: (banSeq) => {
    //   return axios.post(`admin/api/ban/${banSeq}/reject`);
    // },
    insertDecision: (banSeq, decision) => {
      return axios.post(`admin/api/ban/${banSeq}/${decision}`);
    },
    loadBadUsers: () => {
      return axios.get(`admin/api/ban/badUser`);
    },
    loadDetail: (banUserSeq) => {
      return axios.get(`admin/api/ban/detail/${banUserSeq}`);
    },
    banDuration: (banUserSeq, duration) => {
      return axios.post(`admin/api/ban/user/${banUserSeq}/days/${duration}`);
    },
  },
};

const note = {
  send: (sender, receiver, content) => {
    //console.log(senderSeq, receiverSeq, content);
    return axios.post(`/note`, { sender, receiver, content });
  },
  /*
   SELECT :  axios.get..
   insert : axios.post
   update : axios.put...
   delete : axios.delete..
  */
  loadSendNote: () => axios.get(`/notes/S`),
  loadReceiverNote: () => axios.get(`/notes/R`),
  readNote: (noteSeq) => axios.put(`/note/${noteSeq}`),
  readSentNote: (noteSeq) => axios.get(`/note/${noteSeq}`),
  deleteNote: (noteSeq, mode) => axios.delete(`/note/${noteSeq}/${mode}`),
};
export { admin, cate, user, post };
export default {
  cate,
  user,
  post,
  reply,
  admin,
  tag,
  bookMark,
  note,
};
