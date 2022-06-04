<template>
  <div>
    <h3>내글 편집 화면</h3>
    <div class="ban-cate">
      <label><input type="radio" v-model="banType" value="P" />원글 </label>
      <label><input type="radio" v-model="banType" value="R" />답글 </label>
    </div>
    <BanList :banList="banList" @banclick="showBanControl"> </BanList>
    <PopupSlot v-if="popupVisible" @closePopup="closePopup()">
      <h3>{{ getContent(currentBan) }}</h3>
      <button @click="approve()">승인</button>
      <button @click="reject()">거절</button>
    </PopupSlot>
  </div>
</template>

<script>
import api from "../../service/api";
import util from "../../service/util";
import PopupSlot from "../../components/ui/PopupSlot.vue";
import BanList from "../admin/BanList.vue";
export default {
  components: { PopupSlot, BanList },
  data() {
    return {
      banList: null,
      banType: "P",
      popupVisible: false,
      currentBan: null,
    };
  },
  watch: {
    banType(cur) {
      // console.log("바뀜!", `${prev} -> ${cur}`);
      if (cur == "P") {
        this.banPostRepoter();
      } else if (cur == "R") {
        this.banReplyRepoter();
      }
    },
  },
  mounted() {
    this.banPostRepoter();
  },
  methods: {
    getContent(ban) {
      if (this.banType === "P") {
        return ban.CONTENTS;
      } else {
        return ban.CONTENT;
      }
    },
    banPostRepoter() {
      api.admin.ban.loadBanPostList().then((res) => {
        console.log(res);
        this.banList = res.data;
      });
    },
    banReplyRepoter() {
      api.admin.ban.loadBanReplyList().then((res) => {
        console.log(res);
        this.banList = res.data;
      });
    },
    banText(banCode) {
      console.log("[### post]", banCode);
      if (banCode == "AD") {
        return "광고성글";
      } else if (banCode == "PN") {
        return "음란성글";
      } else if (banCode == "AB") {
        return "명예훼손,비방";
      } else if (banCode == "GM") {
        return "도박";
      } else if (banCode == "ET") {
        return "기타";
      }
    },
    timeStampToDate(date) {
      return util.formatDate(date);
    },
    showBanControl(ban) {
      console.log(ban);
      this.currentBan = ban;
      this.popupVisible = true;
    },
    closePopup() {
      this.popupVisible = false;
    },
    approve() {
      console.log("승인처리 여기서");
      api.admin.ban.insertApprove(this.currentBan.seq).then((res) => {
        console.log(res);
        const idx = this.banList.findIndex(
          (e) => this.currentBan.seq === e.seq
        );
        this.banList.splice(idx, 1);
        /*
         * [a, b, c, d, e]
                  ^
                  2
           [a, b, d, e]
         */
        if (this.banList.length === 0) {
          this.currentBan = null;
          this.closePopup();
        } else if (this.banList.length === idx) {
          this.currentBan = this.banList[idx - 1];
        } else {
          this.currentBan = this.banList[idx];
        }

        // this.banList = res.data;
        /*
        if (this.currentBan.targettype == "R") {
          this.banReplyRepoter();
        } else {
          this.banPostRepoter();
        }
        */
      });
    },
    reject() {
      console.log("거부 처리 여기서");
      api.admin.ban.insertReject(this.currentBan.seq).then((res) => {
        console.log(res);
        const idx = this.banList.findIndex(
          (e) => this.currentBan.seq === e.seq
        );
        this.banList.splice(idx, 1);
        /*
         * [a, b, c, d, e]
                  ^
                  2
           [a, b, d, e]
         */
        if (this.banList.length === 0) {
          this.currentBan = null;
          this.closePopup();
        } else if (this.banList.length === idx) {
          this.currentBan = this.banList[idx - 1];
        } else {
          this.currentBan = this.banList[idx];
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.ban-cate {
  display: flex;
  column-gap: 16px;
  padding: 8px 16px;
  background-color: aliceblue;
  align-items: center;
  label {
    display: block;
    margin: 0;
  }
}
.table {
  tr {
    cursor: pointer;
    :hover {
      background-color: aliceblue;
    }
  }
  .ban-type {
    > span {
      white-space: nowrap;
    }
  }
}
</style>
