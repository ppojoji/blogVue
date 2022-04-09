<template>
  <div>
    <h4>글관리</h4>
    <div
      v-if="summary.visible"
      class="summary"
      ref="summaryEl"
      :style="{ top: summary.y + 'px', left: summary.x + 'px' }"
      v-html="summary.content"
    ></div>
    <div class="search-ctrl" v-if="chkVisible">
      <label
        ><input
          type="radio"
          name="type"
          value="all"
          v-model="searchType"
        />전체글</label
      >
      <label
        ><input
          type="radio"
          name="type"
          value="AD"
          v-model="searchType"
        />광고글</label
      >
      <label
        ><input
          type="radio"
          name="type"
          value="PN"
          v-model="searchType"
        />음란성글</label
      >
      <label
        ><input
          type="radio"
          name="type"
          value="AB"
          v-model="searchType"
        />명예훼손/비방</label
      >
      <label
        ><input
          type="radio"
          name="type"
          value="GM"
          v-model="searchType"
        />도박</label
      >
      <label
        ><input
          type="radio"
          name="type"
          value="ET"
          v-model="searchType"
        />기타</label
      >
      <button class="btn btnShow" @click="chkShow(false)">
        <span class="material-icons-outlined"> keyboard_arrow_down </span>
      </button>
    </div>
    <div class="search-ctrl" v-else>
      <label
        ><input
          type="checkbox"
          name="chk"
          value="AD"
          v-model="chkType"
        />광고글</label
      >
      <label
        ><input
          type="checkbox"
          name="chk"
          value="PN"
          v-model="chkType"
        />음란성글</label
      >
      <label
        ><input
          type="checkbox"
          name="chk"
          value="AB"
          v-model="chkType"
        />명예훼손/비방</label
      >
      <label
        ><input
          type="checkbox"
          name="chk"
          value="GM"
          v-model="chkType"
        />도박</label
      >
      <label
        ><input
          type="checkbox"
          name="chk"
          value="ET"
          v-model="chkType"
        />기타</label
      >
      <button class="btn btn-primary" @click="search()">조회</button>
      <button class="btn btnShow">
        <span class="material-icons-outlined" @click="chkShow(true)">
          keyboard_arrow_up
        </span>
      </button>
    </div>
    <!-- <PopupUI :bodyComponent="modalBody" /> -->
    <PopupSlot v-if="popupVisible" @closePopup="popupClose('popupVisible')">
      <PostPolicy :post="targetPost" @popupClose="popupClose('popupVisible')">
      </PostPolicy>
    </PopupSlot>
    <PopupSlot
      v-if="banPopupVisible"
      @closePopup="popupClose('banPopupVisible')"
    >
      <Ban :banList="banList" :post="banPost" />
    </PopupSlot>
    <LoadingPanel v-if="!delPosts && !isError" />
    <table class="table" v-if="delPosts">
      <tbody>
        <tr>
          <th>제목</th>
          <th>날짜</th>
          <th>삭제</th>
          <th>공개</th>
          <th>차단 해제</th>
          <th>차단 시간</th>
        </tr>
        <tr
          :class="{ isSuccess: !delY.ban, isBan: delY.ban }"
          v-for="delY in delPosts"
          :key="delY.seq"
        >
          <td @click="showBanHistory(delY)">
            ({{ delY.seq }}){{ delY.title }}
          </td>
          <td>
            <span
              @mouseenter="showTimeStamp(delY.creationDate)"
              @mousemove="moveSummary"
              @mouseleave="hideSummary"
            >
              {{ diff(delY.creationDate, currentTime) }}
            </span>
          </td>
          <td>
            <button
              class="btn"
              :class="{ 'btn-success': !delY.ban, 'btn-danger': delY.ban }"
              @click="DelPost(delY)"
            >
              삭제
            </button>
          </td>
          <td>
            <button
              class="btn"
              :class="{ 'btn-success': !delY.ban, 'btn-danger': delY.ban }"
              @click="showPostView(delY)"
            >
              {{ banText(delY) }}
            </button>
          </td>
          <td>
            <button
              v-if="delY.ban"
              class="btn btn-danger"
              @click="clearBan(delY)"
            >
              해제
            </button>
          </td>
          <td>
            <div v-if="delY.ban">
              {{ timeStampToDate(new Date(delY.recentBan.banTime)) }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="isError">
      <h1>관리자가 아닙니다.</h1>
    </div>
  </div>
</template>

<script>
// https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/export
import { admin } from "../../service/api";
// import PopupUI from "../../components/ui/PopupUI.vue";
import PopupSlot from "../../components/ui/PopupSlot.vue";
import PostPolicy from "../admin/PostPolicy.vue";
import api from "../../service/api";
import Ban from "../admin/Ban.vue";
import LoadingPanel from "../../components/LoadingPanel.vue";
import util from "../../service/util";
// import UserPolicy from "../admin/UserPolicy.vue";

function timeDiff(millis, curMillis) {
  return util.timeDiff(millis, curMillis);
}

export default {
  components: { PopupSlot, PostPolicy, Ban, LoadingPanel },
  data() {
    return {
      delPosts: null,
      currentTime: new Date().getTime(),
      // modalBody: UserPolicy
      summary: {
        visible: false,
        x: 0,
        y: 0,
        content: "",
      },
      popupVisible: false,
      banPopupVisible: false,
      targetPost: null,
      banList: null,
      banPost: null,
      isError: false,
      searchType: "all",
      chkType: ["AD"],
      chkVisible: false,
    };
  },
  mounted() {
    // 사용자가 삭제한 글
    // admin.post.delY().then((res) => {
    //   console.log(res);
    //   this.delPosts = res.data.posts;
    // });
    this.loadPost(["all"]);
  },
  methods: {
    loadPost(banTypes) {
      admin.post
        .list(banTypes)
        .then((res) => {
          this.delPosts = res.data.posts;
        })
        .catch((error) => {
          console.log(error);
          if (error.response.data.cause == "NOT_ADMIN") {
            this.isError = error.response.data.cause;
          } else {
            this.isError = "UNKNOWN_ERROR";
          }
        });
    },
    DelPost(post) {
      admin.post.delete(post.seq).then((res) => {
        console.log(res);
        let idx = this.delPosts.findIndex((del) => del.seq === post.seq);
        this.delPosts.splice(idx, 1);
      });
    },
    diff(time, current) {
      return timeDiff(time, current);
    },
    showTimeStamp(timeStamp) {
      this.summary.visible = true;
      this.summary.content = this.timeStampToDate(new Date(timeStamp));
    },
    // 코.드.중.복(이거 다른데도 똑같이 쓰고 있음)
    timeStampToDate(date) {
      return util.formatDate(date);
    },
    moveSummary(e) {
      this.summary.x = e.clientX + 20;
      this.summary.y = e.clientY;
    },
    hideSummary() {
      this.summary.visible = false;
    },
    showPostView(post) {
      this.popupVisible = true;
      this.targetPost = post;
    },
    popupClose(modalName) {
      // popupVisible, banPopupVisble
      // this.popupVisible = false;
      this[modalName] = false;
    },
    // banPopupClose() {
    //   this.banPopupVisible = false;
    // },
    banText(post) {
      if (post.ban == null) {
        return "공개중";
      } else if (post.ban == "AD") {
        return "광고성글";
      } else if (post.ban == "PN") {
        return "음란성글";
      } else if (post.ban == "AB") {
        return "명예훼손,비방";
      } else if (post.ban == "GM") {
        return "도박";
      } else if (post.ban == "ET") {
        return "기타";
      }
    },
    clearBan(post) {
      console.log(post);
      api.admin.post.clearBan(post.seq).then((res) => {
        console.log(res);
        if (res.data.success == true) {
          post.ban = null;
        }
      });
    },
    showBanHistory(post) {
      admin.post.banHistory(post.seq).then((res) => {
        this.banPost = post;
        console.log(res);
        // this.banPopupVisible = res.data.ban;
        this.banPopupVisible = true;
        this.banList = res.data.ban;
      });
    },
    chkShow(visible) {
      console.log("11111");
      this.chkVisible = visible;

      if (this.chkVisible == true) {
        this.loadPost([this.searchType]);
      } else if (this.chkVisible == false) {
        this.loadPost(this.chkType);
      }
    },
    toggleChk() {
      this.chkVisible = !this.chkVisible;
    },
    search() {
      console.log(this.chkType);
      this.loadPost(this.chkType);
    },
  }, // end methods
  watch: {
    // TODO 체크박스 바꾸면 그냥 업데이트 되게 해주세요.(라디오 버튼처럼)
    // 조회 버튼은 없애도 됨
    // TODO 관리자 페이지에서 검색 상태를 저장했다가 페이지에 반영하고 싶음
    searchType(cur, prev) {
      console.log(prev, " -> ", cur);
      this.loadPost([this.searchType]);
    },
  },
};
</script>

<style lang="scss" scoped>
.summary {
  padding: 8px;
  background-color: aliceblue;
  position: fixed;
  top: 300px;
  left: 200px;
  box-shadow: 1px 1px 2px #0000009e;
}
.search-ctrl {
  padding: 8px;
  border: 1px solid #444444aa;
  display: flex;
  align-items: center;
  column-gap: 8px;
  .btnShow {
    margin-left: auto;
  }
}

label {
  margin-bottom: 0px;
}
.isSuccess {
  background-color: #e8faff;
  color: #4b6d71;
  .btn-success {
    background-color: inherit;
    color: #4b6d71;
    border: none;
  }
}
.isBan {
  background-color: #ffe0dd;
  color: #85281c;
  .btn-danger {
    background-color: inherit;
    color: #85281c;
    border: none;
  }
}
</style>
