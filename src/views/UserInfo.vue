<template>
  <div class="menu-wrapper">
    <!-- <h3>사용자 상세 화면입니다.</h3> -->
    <div class="menu">
      <div class="menu-item">
        <a href="#" @click="changeMenu('cate')">카테고리</a>
      </div>
      <div class="menu-item">
        <a href="#" @click="changeMenu('post')">내글</a>
      </div>
      <div class="menu-item">
        <a href="#" @click="changeMenu('auth')">권한 관리</a>
      </div>
      <div class="menu-item">
        <a href="#" @click="changeMenu('code')">코드 관리</a>
      </div>
    </div>
    <div class="main-area">
      <!-- <h3>여기에 메뉴의 내용</h3> -->
      <CateConfig v-if="menuType === 'cate'" />
      <PostConfig v-else-if="menuType === 'post'" />
      <AuthConfig v-else-if="menuType === 'auth'" />
      <CodeConfig v-else-if="menuType === 'code'" />
      <div v-else>없는 메뉴</div>
    </div>
  </div>
</template>

<script>
import CateConfig from "./config/CateConfig.vue";
import PostConfig from "./config/PostConfig.vue";
import AuthConfig from "./config/AuthConfig.vue";
import CodeConfig from "./config/CodeConfig.vue";

export default {
  components: { CateConfig, PostConfig, AuthConfig, CodeConfig },
  data() {
    return {
      menuType: "cate",
    };
  },
  methods: {
    changeMenu(menuName) {
      this.menuType = menuName;
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
