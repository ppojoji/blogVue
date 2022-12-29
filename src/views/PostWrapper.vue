<template>
  <div>
    <div class="post-control">
      <Cate
        class="fill-width"
        @cateSelect="changeCategory"
        :initValue="cateName"
      />
      <button
        class="btn"
        :class="{ enabled: timer, disabled: !timer }"
        @click="
          () => {
            timer = !timer;
          }
        "
      >
        <span class="material-icons-outlined">
          {{ timer ? "restore" : "sync_disabled" }}</span
        >
      </button>
    </div>
    <PhotoPost v-if="boardType === 'PH'" :postList="lists"> </PhotoPost>
    <ListPost :timerOn="timer" v-else :lists="lists"> </ListPost>
    <div>
      <button @click="prev">이전</button>
      <button @click="next">다음</button>
    </div>
    <!--v-if="user.admin === 'Y'" -->
    <div class="controls" v-if="boardType === 'NC'">
      <button
        class="btn btn-primary"
        v-if="user && user.admin === 'Y'"
        @click="postWrite"
      >
        공지사항 작성
      </button>
    </div>
    <div class="controls" v-else>
      <button class="btn btn-primary" @click="postWrite">글쓰기</button>
    </div>
  </div>
</template>

<script>
import api from "../service/api";
import ListPost from "./Post.vue";
import PhotoPost from "./PhotoPost.vue";
import Cate from "../components/Cate.vue";
import toast from "../components/ui/toast";

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

      cateName: null,
      timer: true,
    };
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
  computed: {
    user() {
      return this.$store.state.user.loginUser;
    },
  },
  watch: {
    $route(cur) {
      console.log("[카테고리 변경]", cur.params.catename);
      this.selectByCateName(cur.params.catename);
    },
  },
  methods: {
    next() {
      // 시간적으로 이전 글들
      const lastPost = this.lists[this.lists.length - 1];
      const cateName = this.$route.params.catename;
      api.post.nextPosts(lastPost.seq, cateName).then((res) => {
        console.log(res);
        if (res.data.posts.length > 0) {
          this.lists = res.data.posts;
        } else {
          toast.info("마지막 페이지 입니다.", 3000);
        }
      }); //
    },
    prev() {
      // 시간적으로 이후 글들
      const leadPost = this.lists[0];
      const cateName = this.$route.params.catename;
      api.post.prevPosts(leadPost.seq, cateName).then((res) => {
        console.log(res);
        // 원래는 백엔드에서 순서를 바로잡아주는게 맞을 듯....
        if (res.data.posts.length > 0) {
          this.lists = res.data.posts;
        } else {
          toast.info("첫 페이지 입니다.", 3000);
        }
      });
    },
    changeCategory(cate) {
      const cateName = cate ? cate.name : null;
      if (this.$route.params.catename === cateName) {
        return;
      }
      if (cateName) {
        this.$router.push(`/posts/${cateName}`); // this.selectByCateName(cate.name);
      } else {
        this.$router.push(`/posts`);
      }
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
