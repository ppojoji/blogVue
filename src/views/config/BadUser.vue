<template>
  <div>
    <h3>내글 편집 화면</h3>
    <div class="ban-user-list">
      <div class="ban-user" v-for="badUser in badUsers" :key="badUser.seq">
        <h5>{{ badUser.email }}</h5>
        <span @click="loadDetail(badUser.seq)">{{ badUser.banCnt }}건</span>
        <!-- <div class="ban-histo">
          <ul>
            <li>광고 도배</li>
            <li>음란글</li>
            <li>음란글</li>
          </ul>
        </div> -->
        <div class="ctrl">
          <button>7일</button>
          <button>28일</button>
          <button>90일</button>
        </div>
      </div>
      <!-- <div class="ban-user">
        <h5>aaaa@naver.com</h5>
        <div class="ban-histo">
          <ul>
            <li>광고 도배</li>
            <li>음란글</li>
            <li>음란글</li>
          </ul>
        </div>
        <div class="ctrl">
          <button>7일</button>
          <button>28일</button>
          <button>90일</button>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import api from "../../service/api";
export default {
  data() {
    return {
      badUsers: [],
    };
  },
  mounted() {
    this.loadBadUser();
  },
  methods: {
    loadBadUser() {
      api.admin.ban.loadBadUsers().then((res) => {
        console.log(res);
        this.badUsers = res.data;
      });
    },
    loadDetail(banUserSeq) {
      api.admin.ban.loadDetail(banUserSeq).then((res) => {
        console.log(res);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.ban-user-list {
  .ban-user {
    border: 1px solid #ededed;
    margin: 4px;
    padding: 8px;
    .ctrl {
      text-align: right;
    }
  }
}
</style>
