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
    <!-- <PopupUI :bodyComponent="modalBody" /> -->
    <PopupSlot v-if="popupVisible" @closePopup="popupClose()">
      <PostPolicy :post="targetPost" @popupClose="popupClose()"> </PostPolicy>
    </PopupSlot>
    <table class="table">
      <tbody>
        <tr>
          <th>제목</th>
          <th>날짜</th>
          <th>삭제</th>
          <th>공개</th>
          <th>차단 해제</th>
          <th>차단 시간</th>
        </tr>
        <tr v-for="delY in delPosts" :key="delY.seq">
          <td>({{ delY.seq }}){{ delY.title }}</td>
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
            <button class="btn btn-danger" @click="DelPost(delY)">삭제</button>
          </td>
          <td>
            <button class="btn btn-danger" @click="showPostView(delY)">
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
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/export
import { admin } from "../../service/api";
// import PopupUI from "../../components/ui/PopupUI.vue";
import PopupSlot from "../../components/ui/PopupSlot.vue";
import PostPolicy from "../admin/PostPolicy.vue";
import api from "../../service/api";
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
  components: { PopupSlot, PostPolicy },
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
      targetPost: null,
    };
  },
  mounted() {
    // 사용자가 삭제한 글
    // admin.post.delY().then((res) => {
    //   console.log(res);
    //   this.delPosts = res.data.posts;
    // });
    admin.post.list().then((res) => {
      this.delPosts = res.data.posts;
    });
  },
  methods: {
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
    timeStampToDate(date) {
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let second = date.getSeconds();

      month = month >= 10 ? month : "0" + month;
      day = day >= 10 ? day : "0" + day;
      hour = hour >= 10 ? hour : "0" + hour;
      minute = minute >= 10 ? minute : "0" + minute;
      second = second >= 10 ? second : "0" + second;

      return `${date.getFullYear()}-${month}-${day} ${hour}:${minute}:${second}`;
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
    popupClose() {
      this.popupVisible = false;
    },
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
</style>
