<template>
  <div class="wrapper">
    <div>
      <select class="custom-select" id="cata">
        <option value="">[전체보기]</option>
        <option :value="cate.seq" v-for="cate in cates" :key="cate.seq">
          {{ cate.name }}
        </option>
      </select>
    </div>
    <table class="table">
      <thead>
        <tr>
          <td>제목</td>
          <td>카테코리</td>
          <td>조회수</td>
          <td>작성자</td>
          <td>작성일</td>
        </tr>
      </thead>
      <tbody id="blog-list-body">
        <tr v-for="post in lists" :key="post.seq" @click="viewPost(post.seq)">
          <td>
            <img
              class="iconNew"
              src="../assets/icon_new.png"
              v-if="isRecentPost(post)"
            />
            {{ post.title }}
            <img
              class="file"
              src="../assets/file.png"
              v-if="post.upfileCount > 0"
            />
          </td>
          <td>{{ post.category }}</td>
          <td>{{ post.viewCount }}</td>
          <td>{{ post.writer.id }}</td>
          <td>{{ diff(post) }}</td>
        </tr>
      </tbody>
    </table>
    <div class="controls">
      <button class="btn btn-primary" @click="postWrite">글쓰기</button>
    </div>
  </div>
</template>

<script>
//import axios from "axios";
import api from "../service/api";

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
  data() {
    return {
      cates: [],
      lists: [],
      limit: 0,
    };
  },
  mounted() {
    /*
    axios
      .get("http://localhost:8888/blog/api/posts", { withCredentials: true })
      .then((res) => {
        console.log(res);
        this.cates = res.data.cata;
        this.lists = res.data.posts;
        this.limit = res.data.limit;
      });
      */
    api.post.all().then((res) => {
      this.cates = res.data.cata;
      this.lists = res.data.posts;
      this.limit = res.data.limit;
    });
  },

  methods: {
    diff(post) {
      return timeDiff(post.creationDate, new Date().getTime());
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
    postWrite() {
      this.$router.push("/write");
    },
  },
};
</script>

<style scoped>
.iconNew {
  width: 18px;
  height: auto;
}
.file {
  width: 22px;
  height: auto;
}
</style>
