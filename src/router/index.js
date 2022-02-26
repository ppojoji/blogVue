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
Vue.use(VueRouter);

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
  },
  {
    path: "/write",
    name: "PostWrite",
    component: PostWrite,
  },
  {
    path: "/admin",
    name: "AdminPage",
    component: AdminPage,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
