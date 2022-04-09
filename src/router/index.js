import Vue from "vue";
import VueRouter from "vue-router";
// import Post from "../views/Post.vue";
import PostWapper from "../views/PostWrapper.vue";
import Login from "../views/Login.vue";
import UserInfo from "../views/UserInfo.vue";
import PostDetail from "../views/PostDetail.vue";
import Overview from "../views/Overview.vue";
import PostWrite from "../views/PostWrite.vue";
import AdminPage from "../views/admin/AdminPage.vue";
import Tag from "../views/Tag.vue";
import store from "../store";

Vue.use(VueRouter);

console.log("[STORE 출력]", store);
const routes = [
  {
    path: "/",
    name: "Overview",
    component: Overview,
  },
  {
    path: "/posts",
    name: "Post",
    component: PostWapper,
  },
  {
    path: "/posts/:catename",
    name: "Post",
    component: PostWapper,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "about" */ "../views/About.vue");
    },
  },
  {
    path: "/tags",
    name: "Tag",
    component: Tag,
  },
  {
    path: "/article/:post",
    name: "post",
    component: PostDetail,
  },
  {
    path: "/me",
    name: "userInfo",
    component: UserInfo,
    meta: {
      loginCheck: true,
    },
  },
  {
    path: "/write",
    name: "PostWrite",
    component: PostWrite,
    meta: {
      loginCheck: true,
    },
  },
  {
    path: "/admin",
    name: "AdminPage",
    component: AdminPage,
    meta: {
      loginCheck: true,
      adminOnly: true,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  console.log("[FROM]", from);
  console.log("[TO  ]", to);
  // 1. 로그인 정보가 없을때
  if (!store.state.user.loginUser) {
    if (to.meta.loginCheck) {
      router.push({ path: "/login", query: { redirect: to.fullPath } });
    }
  } else {
    // 로그인은 된 상태
    // 관리자인지??
    // if (to.meta.adminOnly && store.state.user.loginUser.admin === "N") {
    // router.push({ path: "/login", query: { redirect: to.fullPath } });
    // }
  }
  next();
  /*
  if (to.meta.adminOnly && !store.state.user.loginUser) {
    // next({ name: "login" });
    router.push({ path: "/login", query: { redirect: to.fullPath } });
  } else {
    next();
  }
  */
});

export default router;
