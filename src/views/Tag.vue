<template>
  <div>
    <h3>테그별 글 모음</h3>
    <div class="valid tags">
      <div v-for="tag in validTags" :key="tag.seq">
        <h3>{{ tag.tagName }}</h3>
        <div v-for="post in tag.posts" :key="post.seq">
          {{ post.title }}
        </div>
      </div>
    </div>
    <div class="empty tags">
      <span v-for="empTag in emptyTags" :key="empTag.seq">{{
        empTag.tagName
      }}</span>
    </div>
  </div>
</template>

<script>
import api from "../service/api";
export default {
  data() {
    return {
      tags: null,
      validTags: null,
      emptyTags: null,
    };
  },
  mounted() {
    api.tag.posts().then((res) => {
      console.log(res);
      this.tags = res.data;
      // 1. 1개라도 있는 태그 필더링
      this.validTags = this.tags.filter((tag) => {
        return tag.posts.length > 0;
      });
      // 2. 0개인 태그 필터링
      this.emptyTags = this.tags.filter((tag) => {
        return tag.posts.length === 0;
      });
    });
  },
  methods: {
    TagOrder() {},
  },
};
</script>

<style></style>
