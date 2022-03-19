<template>
  <div class="posts">
    <h3 v-if="tag">{{ tag.tagName }}</h3>
    <div
      class="post"
      v-for="post in posts"
      :key="post.seq"
      @click="postClicked(post)"
    >
      <span
        v-if="currentPost && post.seq === currentPost.seq"
        class="material-icons-outlined"
      >
        check
      </span>
      <span v-else class="material-icons-outlined">_</span>
      <span v-if="post.category" class="cate">[{{ post.category.name }}]</span>
      <span v-else class="cate">[전체]</span>
      <span>{{ post.title }}</span>
      <!-- <a :href="'/article/' + post.seq">{{ post.title }}</a> -->
    </div>
    <div v-if="posts && posts.length === 0">관련 글이 없습니다.</div>
  </div>
</template>

<script>
import api from "../service/api";
export default {
  props: ["tag", "currentPost"],
  data() {
    return {
      posts: null,
      // currentPost: null,
    };
  },
  mounted() {
    this.loadPost();
  },
  methods: {
    postClicked(post) {
      this.$emit("activePost", post);
    },
    loadPost() {
      api.post.findByTag(this.tag.seq).then((res) => {
        console.log(res);
        this.posts = res.data;
      });
    },
  },
  watch: {
    tag() {
      // console.log("[tag 바뀜]", prev, " > ", cur);
      this.loadPost();
    },
  },
};
</script>

<style lang="scss" scoped>
.posts {
  .post {
    display: flex;
    align-items: center;
    cursor: pointer;
    &:hover {
      background-color: aquamarine;
    }
    .material-icons-outlined {
      font-size: 18px;
      padding: 0 8px;
    }
  }
  .cate {
    margin-right: 17px;
  }
}
</style>
