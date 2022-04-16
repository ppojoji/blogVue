<template>
  <div class="admin-wrapper">
    <template v-if="user && user.admin === 'Y'">
      <div class="menu">
        <div class="menu-item">
          <a href="#" @click="changeMenu('cate')">카테고리 관리</a>
        </div>
        <div class="menu-item">
          <a href="#" @click="changeMenu('post')">글 관리</a>
        </div>
      </div>
      <div class="viewer">
        <CateConfig v-if="menuType === 'cate'" />
        <PostPage v-else-if="menuType === 'post'" />
      </div>
    </template>
    <div v-else class="alert">관리자가 아닙니다.</div>
    <!-- <LoginForm @loginSuccess="login" v-if="appReady && !user" /> -->
  </div>
</template>

<script>
import PostPage from "./PostPage.vue";
import CateConfig from "../config/CateConfig.vue";
// import LoginForm from "../../components/LoginForm.vue";
export default {
  components: { CateConfig, PostPage },
  data() {
    return {
      menuType: "cate",
    };
  },
  methods: {
    changeMenu(menuName) {
      this.menuType = menuName;
    },
    login(user) {
      this.$store.state.user.loginUser = user;
    },
  },
  computed: {
    user() {
      return this.$store.state.user.loginUser;
    },
  },
};
</script>

<style lang="scss" scoped>
.admin-wrapper {
  display: flex;
  .menu {
    width: 200;
    flex: 0 0 200px;
  }
  .viewer {
    flex: 1 1 auto;
  }
}
</style>
