<template>
  <div v-if="readMode">
    <h3>글 상세보기 ({{ $route.params.post }})</h3>
    <div class="post-detail" v-if="post">
      <div class="title">{{ post.title }}</div>
      <div class="writer">
        <span>{{ post.writer.id }}</span
        ><span class="date">{{ post.creationDate }}</span>
      </div>
      <div class="content" v-html="post.contents"></div>
      <UpfileList
        :files="upfiles"
        nameProp="originalName"
        sizeProp="fileSize"
        v-bind:editMode="false"
        emptyMessage="첨부파일이 없습니다."
      />
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
    <EditForm :post="post" :mode="true" @back="back" @update="updated" />
  </div>
</template>

<script>
import api from "../service/api";
import Loading from "../components/Loading.vue";
import EditForm from "../components/EditForm.vue";
import UpfileList from "../components/UpfileList.vue";
// import { mapState } from "vuex";

export default {
  components: {
    Loading,
    EditForm,
    UpfileList,
  },
  data() {
    return {
      post: null,
      upfiles: [],
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
      api.post.detail(this.$route.params.post).then((res) => {
        console.log(res);
        this.post = res.data.post;
        this.upfiles = res.data.post.upFiles;
      });
    },
    deletePost() {
      console.log("삭제삭제");
      api.post.remove(this.$route.params.post).then((res) => {
        console.log(res);
        this.post = null;
        this.message = "삭제 완료";
        setTimeout(() => {
          this.$router.replace("/");
        }, 1000);
      });
    },
    updatePost() {
      this.readMode = false; // 편집모드로 바꿈
      api.cate.all().then((res) => {
        console.log("[카테고리 목록] ", res);
      });
    },
    buttonMain() {
      this.$router.push({ path: "/" });
    },
    back() {
      this.readMode = true;
    },
    updated(post) {
      this.readMode = true;
      // this.post = null;
      this.loadPost();
      let seq = this.post.seq;
      let title = post.title;
      let contents = post.contents;
      let cateSeq = post.cate;
      api.post.update(seq, title, contents, cateSeq);
    },
    formatSize(file) {
      let fileSize = file.fileSize;
      let unit = null;
      // 1024 or 1024 >=
      console.log(file);
      if (fileSize < 1024) {
        unit = "B";
      } else if (fileSize >= 1024) {
        fileSize /= 1024;
        fileSize = fileSize.toFixed(1);
        unit = "KB";
      }
      return fileSize + " " + unit;
    },
  },
  mounted() {
    this.loadPost();
  },
};
</script>

<style></style>
