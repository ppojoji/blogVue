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

        <BanList
          :banList="detailBanUsers[badUser.seq]"
          v-if="detailBanUsers[badUser.seq]"
        >
        </BanList>
        <div class="ctrl">
          <button @click="banDuration(badUser.seq, 7)">7일</button>
          <button @click="banDuration(badUser.seq, 28)">28일</button>
          <button @click="banDuration(badUser.seq, 90)">90일</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../service/api";
import BanList from "../admin/BanList.vue";
export default {
  components: { BanList },
  data() {
    return {
      badUsers: [],
      banList: null,
      // visibleBanUsers: {}, // { 5: [..], 3: [...], 1: [...]}
      detailBanUsers: {},
      visibleBanUsers: [],
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
      if (this.visibleBanUsers.includes(banUserSeq)) {
        // this.$set(this.detailBanUsers, banUserSeq, null);
        this.detailBanUsers[banUserSeq] = null;
        const idx = this.visibleBanUsers.findIndex((b) => {
          return b === banUserSeq;
        });
        this.visibleBanUsers.splice(idx, 1);
      } else {
        api.admin.ban.loadDetail(banUserSeq).then((res) => {
          console.log(res); // res.data
          /*
           * https://v3.ko.vuejs.org/guide/change-detection.html
           */
          // this.detailBanUsers[1] = 333;
          this.$set(this.detailBanUsers, banUserSeq, res.data);
          this.visibleBanUsers.push(banUserSeq);
          //this.visibleBanUsers = banUserSeq;
          /*
        this.$set(this.someObject, 'b', 2)
        this.someObject.b = 2;
        */
        });
      }
    },
    banDuration(userSeq, duration) {
      // const banUserSeq = 3323;
      console.log("[userSeq] >>> ", userSeq, "[duration] >>> ", duration);
      api.admin.ban.banDuration(userSeq, duration).then((res) => {
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
.ctrl {
  > button {
    margin: 4px;
    outline: none;
    background-color: #8e9ddc;
    //display: flex;
    padding: 8px;
    border-radius: 40px;
    border: none;
    color: black;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px,
      rgba(0, 0, 0, 0.22) 0px 10px 10px;
    &:active {
      background-color: #5c72d6;
      transform: translate(2px, 2px);
    }
  }
}
</style>
