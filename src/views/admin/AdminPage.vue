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
        <div class="menu-item">
          <a href="#" @click="changeMenu('ban')">신고내역</a>
        </div>
        <div class="menu-item">
          <a href="#" @click="changeMenu('badUser')">불량유저</a>
        </div>
        <div class="menu-item">
          <a href="#" @click="changeMenu('stats')">통계</a>
        </div>
      </div>
      <div class="viewer">
        <CateConfig v-if="menuType === 'cate'" />
        <PostPage v-else-if="menuType === 'post'" />
        <BanReporter v-else-if="menuType === 'ban'" />
        <BadUser v-else-if="menuType === 'badUser'" />
        <StatisticPage v-else-if="menuType === 'stats'" />
      </div>
    </template>
    <div v-else class="alert">관리자가 아닙니다.</div>
    <!-- <LoginForm @loginSuccess="login" v-if="appReady && !user" /> -->
  </div>
</template>

<script>
import PostPage from "./PostPage.vue";
import CateConfig from "../config/CateConfig.vue";
import BanReporter from "../config/BanReport.vue";
import BadUser from "../config/BadUser.vue";
import StatisticPage from "../config/stats/StatisticPage.vue";
export default {
  components: { CateConfig, PostPage, BanReporter, BadUser, StatisticPage },
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
