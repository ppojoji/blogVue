<template>
  <div v-if="readMode">
    <h3>글 상세보기 ({{ $route.params.post }})</h3>
    <div class="post-detail" v-if="post">
      <div class="title">{{ post.title }}</div>
      <div class="writer">
        <span>{{ post.writer.id }}</span
        ><span class="date">{{ post.creationDate }}</span>
      </div>
      <div class="content">{{ post.contents }}</div>
      <div class="control">
        <button @click="buttonMain">목록</button>
        <!-- <template v-if="me && me.seq === post.writer.seq">
        <button>수정</button>
        <button>삭제</button>
      </template> -->
        <template v-if="isMyPost()">
          <button @click="updatePost()">수정</button>
          <button @click="deletePost()">삭제</button>
        </template>
      </div>
    </div>
    <Loading v-else :msg="message" />
  </div>
  <div v-else>
    <EditForm :post="post" :mode="true" @back="back" @updated="updated" />
  </div>
</template>

<script>
import api from "../service/api";
import Loading from "../components/Loading.vue";
import EditForm from "../components/EditForm.vue";
// import { mapState } from "vuex";

export default {
  components: {
    Loading,
    EditForm,
  },
  data() {
    return {
      post: null,
      readMode: true,
      message: "읽어오는 중",
    };
  },
  computed: {
    // ...mapState({
    //   loginUser,
    // }),
    me() {
      return this.$store.state.loginUser;
    },
  },
  methods: {
    isMyPost() {
      return this.me && this.me.seq === this.post.writer.seq;
    },
    loadPost() {
      // this.$store.state.loginUser
      /*
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
      */
      api.post.detail(this.$route.params.post).then((res) => {
        console.log(res);
        this.post = res.data.post;
      });
    },
    deletePost() {
      console.log("삭제삭제");
      api.post.remove(this.$route.params.post).then((res) => {
        console.log(res);
        this.post = null;
        this.message = "삭제 완료";
      });
    },
    updatePost() {
      this.readMode = false; // 편집모드로 바꿈
    },
    buttonMain() {
      this.$router.push({ path: "/" });
    },
    back() {
      this.readMode = true;
    },
    updated() {
      this.readMode = true;
      this.post = null;
      this.loadPost();
    },
  },
  mounted() {
    this.loadPost();
  },
};
</script>

<style></style>
