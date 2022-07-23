<template>
  <div>
    <div class="post-control">
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
    </div>
    <PhotoPost v-if="boardType === 'PH'" :postList="lists"> </PhotoPost>
    <ListPost v-else :lists="lists"> </ListPost>
    <div class="controls">
      <button class="btn btn-primary" @click="postWrite">글쓰기</button>
    </div>
    <!-- <div class="controls">
      <button class="btn btn-primary" @click="postWrite">글쓰기</button>
    </div> -->
  </div>
</template>

<script>
import api from "../service/api";
import ListPost from "./Post.vue";
import PhotoPost from "./PhotoPost.vue";
import Cate from "../components/Cate.vue";

export default {
  components: {
    ListPost,
    PhotoPost,
    Cate,
  },
  data() {
    return {
      cates: [],
      lists: [],
      limit: 0,
      boardType: null,
      timer: null,
      cateName: null,
    };
  },
  beforeDestroy() {
    this.stopInterval();
  },
  mounted() {
    this.cateName = this.$route.params.catename;
    console.log("[현재카테고리]", this.cateName);
    if (this.cateName) {
      this.selectByCateName(this.cateName);
    } else {
      api.post.all().then((res) => {
        this.cates = res.data.cata;
        this.lists = res.data.posts;
        this.limit = res.data.limit;
        console.log("[OK?]", res);
      });
    }
    // this.startInterval();
  },
  methods: {
    startInterval() {
      this.timer = window.setInterval(() => {
        this.currentTime = new Date().getTime();
        // console.log("[TICK]", this.currentTime);
      }, 1000);
    },
    stopInterval() {
      clearInterval(this.timer);
      this.timer = null;
      // console.log("[PAUSED]");
    },
    selectCate(cate) {
      if (cate) {
        this.selectByCateName(cate.name);
      } else {
        this.selectByCateName(null);
      }
    },
    selectByCateName(cateName) {
      console.log("1111111");
      let apiFn;
      if (!cateName) {
        apiFn = api.post.all;
      } else {
        apiFn = api.post.findByCate;
      }
      apiFn(cateName).then((res) => {
        this.lists = res.data.posts;
        this.lists.forEach((post) => {
          post.picUrl = null;
        });
        console.log(this.lists);

        this.boardType =
          this.lists.length === 0 ? "NM" : this.lists[0].category.type;
      });
    },
    postWrite() {
      this.$router.push({ path: "/write", query: { cate: this.cateName } }); // "/write?cate=abcabc" query string
    },
  },
};
</script>

<style lang="scss" scoped>
.post-control {
  display: flex;
  .fill-width {
    flex: 1 1 auto;
  }
}
.controls {
  padding: 16px;
}
</style>
