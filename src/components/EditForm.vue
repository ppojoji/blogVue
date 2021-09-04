<template>
  <div id="blog-container">
    <div>
      <input
        class="form-elem"
        id="title"
        type="text"
        placeholder="글제목"
        v-model="post.title"
      />
    </div>

    <div>
      <textarea class="form-elem" id="content"></textarea>
    </div>
    <div class="upfile-view">
      <input
        type="file"
        name="files"
        id="file"
        @change="attacheFile"
        accept=".txt, .gif, .jpg, .png"
      />
      <UpfileList
        :files="upfiles"
        nameProp="name"
        sizeProp="size"
        v-bind:editMode="true"
        @fileDelete="fileDelete"
        emptyMessage="파일 첨부 선택가능"
      />
    </div>
    <div>
      <button id="btnSubmit" @click="update">글작성</button>
      <button @click="cancel">취소</button>
    </div>
  </div>
</template>

<script>
import UpfileList from "../components/UpfileList.vue";
/* global $ */
// import UpfileList from "../components/UpfileList.vue";
export default {
  components: { UpfileList },
  props: ["post", "mode"],
  data() {
    return {
      summernoteJs: null,
      upfiles: [],
      // totalSize: 0, // 파생 필드
      // upfileInfos: [],
    };
  },
  methods: {
    cancel() {
      this.$emit("back");
      this.summernoteJs.remove();
    },
    update() {
      // console.log("[TITLE2] ", this.post.title);
      const contents = $("#content").summernote("code");
      this.$emit("update", {
        title: this.post.title,
        contents,
        upfiles: this.upfiles,
      });
    },
    attacheFile(e) {
      console.log(e.target.files);
      this.upfiles.push(e.target.files[0]);
      e.target.value = ""; // input file 초기화 하는 꼼수
      // this.totalSize += e.target.files[0].size;
    },
    fileDelete(file) {
      console.log("[지울 파일] ", file);
      const idx = this.upfiles.findIndex((f) => f === file);
      // this.totalSize -= file.size;

      this.upfiles.splice(idx, 1);
    },
  },
  mounted() {
    var script = document.createElement("script");
    this.summernoteJs = script;
    script.type = "text/javascript";
    script.src =
      "https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-bs4.min.js";
    script.onload = () => {
      $("#content").summernote({
        toolbar: [
          ["style", ["bold", "italic", "underline", "clear"]],
          ["font", ["strikethrough", "superscript", "subscript"]],
          ["fontsize", ["fontsize"]],
          ["color", ["color"]],
          ["para", ["ul", "ol", "paragraph"]],
          ["height", ["height"]],
          ["insert", ["imgur", "picture"]],
        ],
        //   buttons: {
        //     imgur: btnImgur,
        //   },
        dialogsFade: true,
      });
      var contents = this.post.contents;
      $("#content").summernote("code", contents);
    };
    document.head.appendChild(script);
  },
};
</script>

<style lang="scss"></style>
