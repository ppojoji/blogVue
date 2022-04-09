<template>
  <div class="menu-wrapper">
    <LoginForm @loginSuccess="login" v-if="appReady && !user" />
    <div class="menu" v-if="user">
      <div class="menu-item">
        <a href="#" @click="changeMenu('post')">내글 관리</a>
      </div>
      <div class="menu-item">
        <a href="#" @click="changeMenu('bookmark')">북마크 관리</a>
      </div>
    </div>
    <div class="main-area" v-if="user">
      <!-- <h3>여기에 메뉴의 내용</h3> -->
      <PostConfig v-if="menuType === 'post'" />
      <BookMarkConfig v-else-if="menuType === 'bookmark'" />
      <div v-else>없는 메뉴</div>
    </div>
  </div>
</template>

<script>
import PostConfig from "./config/PostConfig.vue";
import BookMarkConfig from "./config/BookMarkConfig.vue";
import LoginForm from "../components/LoginForm.vue";

export default {
  components: { PostConfig, BookMarkConfig, LoginForm },
  data() {
    return {
      menuType: "post",
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
    appReady() {
      return this.$store.state.user.appReady;
    },
    user() {
      return this.$store.state.user.loginUser;
    },
  },
};
</script>

<style lang="scss" scoped>
.menu-wrapper {
  display: flex;
  .menu {
    width: 200px;
    .menu-item > a {
      padding: 8px 16px;
    }
  }
  .main-area {
    flex: 1;
  }
}
</style>
