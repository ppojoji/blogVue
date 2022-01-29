<template>
  <div>
    <h4>관리자 페이지</h4>
    <div
      v-if="summary.visible"
      class="summary"
      ref="summaryEl"
      :style="{ top: summary.y + 'px', left: summary.x + 'px' }"
      v-html="summary.content"
    ></div>
    <div class="search-ctrl">
      <p>{{ searchType }}</p>
      <input type="radio" name="type" value="all" v-model="searchType" />전체글
      <input type="radio" name="type" value="AD" v-model="searchType" />광고글
      <input type="radio" name="type" value="PN" v-model="searchType" />음란성글
      <input
        type="radio"
        name="type"
        value="AB"
        v-model="searchType"
      />명예훼손,비방
      <input type="radio" name="type" value="GM" v-model="searchType" />도박
      <input type="radio" name="type" value="ET" v-model="searchType" />기타
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
  var diffMillis = curMillis - millis; // 밀리세컨드
  var sec = parseInt(diffMillis / 1000); // 초단위
  var min = parseInt(sec / 60); // 분단위
  if (min === 0) {
    return sec + "초전";
  }

  var hour = parseInt(min / 60); // 시간
  if (hour === 0) {
    return min + "분전";
  }
  var days = parseInt(hour / 24); // 일전~
  if (days === 0) {
    return hour + "시간전";
  }

  var month = parseInt(days / 30); // ~달전
  if (month === 0) {
    return days + "일전";
  }
  return month + "달전";
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
    };
  },
  mounted() {
    // 사용자가 삭제한 글
    // admin.post.delY().then((res) => {
    //   console.log(res);
    //   this.delPosts = res.data.posts;
    // });
    this.loadPost();
  },
  methods: {
    loadPost() {
      admin.post
        .list(this.searchType)
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
  }, // end methods
  watch: {
    searchType(cur, prev) {
      console.log(prev, " -> ", cur);
      this.loadPost();
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
}
</style>
