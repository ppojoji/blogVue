<template>
  <div class="menu-wrapper">
    <LoginForm @loginSuccess="login" v-if="appReady && !user" />
    <div class="menu" v-if="user">
      <div class="menu-item">
        <router-link to="/me/post">내글 관리</router-link>
      </div>
      <div class="menu-item">
        <router-link to="/me/bookmark">북마크 관리</router-link>
      </div>
      <div class="menu-item">
        <router-link to="/me/note">쪽지함</router-link>
      </div>
      <div class="menu-item">
        <router-link to="/me/myInfo">내정보 관리</router-link>
      </div>
    </div>
    <div class="main-area" v-if="user">
      <!-- <h3>여기에 메뉴의 내용</h3> -->
      <PostConfig v-if="menuType === 'post'" key="post" />
      <BookMarkConfig v-else-if="menuType === 'bookmark'" key="bookmark" />
      <NoteConfig v-else-if="menuType === 'note'" key="note" />
      <MyInfo v-else-if="menuType === 'myInfo'" key="myInfo" />
      <div v-else>없는 메뉴</div>
    </div>
  </div>
</template>

<script>
import PostConfig from "./config/PostConfig.vue";
import BookMarkConfig from "./config/BookMarkConfig.vue";
import NoteConfig from "./config/NoteConfig.vue";
import LoginForm from "../components/LoginForm.vue";
import MyInfo from "./config/MyInfo.vue";

export default {
  components: { PostConfig, BookMarkConfig, LoginForm, NoteConfig, MyInfo },
  data() {
    return {
      menuType: "post",
    };
  },
  mounted() {
    console.log("[userinfo]");
    let type = this.$route.params.type;
    console.log("[type]", type);
    this.changeMenu(type);
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
    flex-shrink: 0;
    flex-grow: 0;
    .menu-item > a {
      padding: 8px 16px;
    }
  }
  .main-area {
    flex: 1;
  }
}
</style>
