<template>
  <div>
    <h3>글쓰기 화면입니다.</h3>
    <EditForm
      :editMode="false"
      :post="post"
      :category="cateName"
      @update="update"
    />
  </div>
</template>

<script>
import EditForm from "../components/EditForm.vue";
import api from "../service/api";

export default {
  components: { EditForm },
  data() {
    return {
      post: {
        seq: null,
        title: "",
        contents: "",
        category: null,
        tags: [],
      },
      cateName: null,
    };
  },
  mounted() {
    console.log("[qs]", this.$route.query);
    this.cateName = this.$route.query.cate;
  },
  methods: {
    write() {},
    update(post) {
      console.log("[TITLE] ", post); // posts.tags [{}, {}, {}]
      // if (!post.cate) {
      //   post.cate = 0;
      // }
      post.upfiles.forEach((file) => {
        delete file.src; //
      });
      api.post
        .write(post.title, post.contents, post.upfiles, post.cate, post.tags)
        .then((res) => {
          if (res.data.success) {
            console.log(res);
            alert("글이 작성되었습니다.");
            this.$router.replace("/");
          }
        });
    },
  },
};
</script>

<style></style>
