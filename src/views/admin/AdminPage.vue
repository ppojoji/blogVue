<template>
  <div class="admin-wrapper">
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
  </div>
</template>

<script>
import PostPage from "./PostPage.vue";
import CateConfig from "../config/CateConfig.vue";
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
