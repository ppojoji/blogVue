<template>
  <div class="wrapper">
    <div
      v-if="summary.visible"
      class="summary"
      ref="summaryEl"
      :style="{ top: summary.y + 'px', left: summary.x + 'px' }"
      v-html="summary.content"
    ></div>
    <!-- <div class="post-control">
      <Cate class="fill-width" @cateSelect="selectCate" :initValue="cateName" />
      <button
        class="btn"
        :class="{ enabled: timer, disabled: !timer }"
        @click="
          () => {
            timer ? stopInterval() : startInterval();
          }
        "
      >
        <span class="material-icons-outlined">
          {{ timer ? "restore" : "sync_disabled" }}</span
        >
      </button>
    </div> -->
    <table class="table">
      <thead>
        <tr>
          <td>제목</td>
          <td>카테코리</td>
          <td>조회수</td>
          <td>작성자</td>
          <td>작성일</td>
          <td>수정시간</td>
        </tr>
      </thead>
      <tbody class="blog-list-body">
        <tr v-if="lists.length === 0">
          <td colspan="6" style="text-align: center">
            <div class="logo">
              <span class="icon material-icons-outlined"> report_problem </span>
            </div>
            <p>글이 없습니다.</p>
          </td>
        </tr>
        <tr
          v-else
          v-for="post in lists"
          :key="post.seq"
          @click="viewPost(post.seq)"
        >
          <td>
            <img
              class="iconNew"
              src="../assets/icon_new.png"
              v-if="isRecentPost(post)"
            />
            <span
              class="title"
              @mouseenter="showSummary(post)"
              @mousemove="moveSummary"
              @mouseleave="hideSummary"
              >{{ post.title }}</span
            >
            <img
              class="file"
              src="../assets/file.png"
              v-if="post.upfileCount > 0"
            />
          </td>
          <!-- <td v-if="post.category">{{ post.category.name }}</td>
          <td v-else></td> -->
          <td>{{ post.category ? post.category.name : "" }}</td>
          <td>{{ post.viewCount }}</td>
          <td>
            <span
              @mouseenter="showInfo(post)"
              @mousemove="moveSummary"
              @mouseleave="hideSummary"
              >{{ post.writer.id }}</span
            >
          </td>
          <td>
            <span
              @mouseenter="showTimeStamp(post.creationDate)"
              @mousemove="moveSummary"
              @mouseleave="hideSummary"
            >
              {{ diff(post.creationDate, currentTime) }}
            </span>
          </td>
          <td>
            <span
              @mouseenter="showTimeStamp(post.lastDate)"
              @mousemove="moveSummary"
              @mouseleave="hideSummary"
            >
              {{ diff(post.lastDate, currentTime) }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <slot name="footer" />
    <!-- <div class="controls">
      <button class="btn btn-primary" @click="postWrite">글쓰기</button>
    </div> -->
  </div>
</template>

<script>
//import axios from "axios";
import api from "../service/api";
import util from "../service/util";

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
  props: ["lists"],
  data() {
    return {
      // cates: [],
      // lists: [],
      limit: 0,
      summary: {
        visible: false,
        x: 0,
        y: 0,
        content: "",
      },
      currentTime: new Date().getTime(),
      timer: null,
      cateSeq: 0,
      cateName: null,
    };
  },
  mounted() {},
  methods: {
    // startInterval() {
    //   this.timer = window.setInterval(() => {
    //     this.currentTime = new Date().getTime();
    //     // console.log("[TICK]", this.currentTime);
    //   }, 1000);
    // },
    // stopInterval() {
    //   clearInterval(this.timer);
    //   this.timer = null;
    //   // console.log("[PAUSED]");
    // },
    diff(time, current) {
      return timeDiff(time, current);
    },
    isRecentPost(post) {
      return new Date().getTime() - post.creationDate < this.limit;
    },
    viewPost(postSeq) {
      // 프로그래밍 방식으로 페이지 이동
      // ref: https://router.vuejs.org/kr/guide/essentials/dynamic-matching.html
      this.$router.push({
        path: "/article/" + postSeq,
      });
      // http://localhost:8080/article/46432
    },
    showSummary(post) {
      // this.$refs.summaryEl.style.display = "block";
      // this.$refs.summaryEl.innerHTML = post.contents;
      this.summary.visible = true;
      this.summary.content = post.contents;
    },
    moveSummary(e) {
      // this.$refs.summaryEl.style.left = e.clientX + 20 + "px";
      // this.$refs.summaryEl.style.top = e.clientY + "px";
      this.summary.x = e.clientX + 20;
      this.summary.y = e.clientY;
    },
    hideSummary() {
      //this.$refs.summaryEl.style.display = "none";
      this.summary.visible = false;
    },
    showInfo(post) {
      this.summary.visible = true;
      this.summary.content = post.writer.email;
    },
    showTimeStamp(timeStamp) {
      this.summary.visible = true;
      this.summary.content = this.timeStampToDate(new Date(timeStamp));
    },
    timeStampToDate(date) {
      return util.formatDate(date);
    },
    selectCate(cateName) {
      console.log("1111111");
      let apiFn;
      if (cateName === "") {
        apiFn = api.post.all;
      } else {
        apiFn = api.post.findByCate;
      }
      apiFn(cateName).then((res) => {
        this.lists = res.data.posts;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 0 16px;
}
.iconNew {
  width: 18px;
  height: auto;
}
.file {
  width: 22px;
  height: auto;
}
.blog-list-body {
  .title {
    padding: 4px;
  }

  .logo {
    text-align: center;
    margin-top: 40px;

    .icon {
      font-size: 60px;
    }
  }
}
.summary {
  padding: 8px;
  background-color: aliceblue;
  position: fixed;
  top: 300px;
  left: 200px;
  box-shadow: 1px 1px 2px #0000009e;
}

.post-control {
  display: flex;
  align-items: center;
  padding: 8px 0;
  column-gap: 8px;
  .fill-width {
    flex: 1 1 auto;
  }
  button.btn {
    border: none;
    padding: 4px;
    display: block;
    &.enabled {
      background-color: aliceblue;
      border: 1px solid #5086b4;
    }
    span {
      font-size: 24px;
      line-height: 1;
      vertical-align: middle;
    }
  }
}
</style>
