<template>
  <div>
    <h3>통계</h3>
    <div class="tab-ui">
      <button
        class="btn-tab"
        :class="{ active: mode === 'user' }"
        @click="changeTab('user')"
      >
        회원
      </button>
      <button
        class="btn-tab"
        :class="{ active: mode === 'comm' }"
        @click="changeTab('comm')"
      >
        커뮤니티
      </button>
    </div>
    <div class="tab-body">
      <UserStatView v-if="this.mode === 'user'" />
      <CommunityStatView v-else-if="mode === 'comm'" />
    </div>
  </div>
</template>

<script>
import CommunityStatView from "./CommunityStatView.vue";
import UserStatView from "./UserStatView.vue";

export default {
  components: { UserStatView, CommunityStatView },
  data() {
    return {
      mode: "comm",
    };
  },
  methods: {
    changeTab(tabName) {
      this.mode = tabName;
    },
  },
};
</script>

<style lang="scss" scoped>
.tab-ui {
  padding: 20px 10px 0 0;
  display: flex;
  column-gap: 8px;
  .btn-tab {
    border: 0;
    padding: 5px 10px;
    border-radius: 5px 5px 0 0;
    overflow: hidden;
    color: #777;
    &.active {
      background-color: #4287ea;
      color: white;
    }
  }
}
</style>
