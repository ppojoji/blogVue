<template>
  <div>
    <h3>글 상세보기 ({{ $route.params.post }})</h3>
    <div class="post-detail" v-if="post">
      <div class="title">{{ post.title }}</div>
      <div class="writer">
        <span>{{ post.writer.id }}</span
        ><span class="date">글쓴 시간</span>
      </div>
      <div class="content">본문 내용 여기 들어감</div>
    </div>
    <div class="loading" v-else>... 읽어오는 중...</div>
    <div class="control">
      <button>목록</button>
      <button>수정</button>
      <button>삭제</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
// import api from "../service/api";

export default {
  data() {
    return {
      post: null,
    };
  },
  methods: {
    loadPost() {
      axios
        .get(
          "http://localhost:8888/blog/api/readPosts/" + this.$route.params.post,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log(res);
          this.post = res.data.post;
        });
      /*
      api.post.detail(this.$route.params.post).then((res) => {
        console.log(res);
      });
      */
    },
  },
  mounted() {
    this.loadPost();
  },
};
</script>

<style></style>
