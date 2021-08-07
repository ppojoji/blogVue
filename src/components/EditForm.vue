<template>
  <div id="blog-container">
    <div>
      <input
        class="form-elem"
        id="title"
        type="text"
        placeholder="글제목"
        :value="post.title"
      />
    </div>

    <div>
      <textarea
        class="form-elem"
        id="content"
        :value="post.contents"
      ></textarea>
    </div>
    <div>
      <input type="file" name="files" id="file" />
      <input type="file" name="files" id="file0" />
      <input type="file" name="files" id="file1" />
    </div>
    <div>
      <button id="btnSubmit" @click="update">글작성</button>
      <button @click="cancel">취소</button>
    </div>
  </div>
</template>

<script>
/* global $ */
export default {
  props: ["post", "mode"],
  data() {
    return {
      summernoteJs: null,
    };
  },
  methods: {
    cancel() {
      this.$emit("back");
      this.summernoteJs.remove();
    },
    update() {
      // FIXME api.blog.update(....)
      // api.blog.insert(....)
      var url = "http://localhost:8888";
      if (this.mode) {
        url += "/blog/article/api/update/" + this.post.seq;
      } else {
        url += "/blog/article/api/write";
      }
      console.log(url);
      var form = new FormData();
      form.append("title", $("#title").val());
      form.append("contents", $("#content").val());
      //   form.append("postSeq", $("#postSeq").val());
      $.ajax({
        url: url,
        method: "POST",
        data: form,
        processData: false,
        contentType: false,
        success: (res) => {
          if (res.success) {
            alert("편집 성공");
            this.$emit("updated");
            console.log(res);
          }
        },
      });
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
    };
    document.head.appendChild(script);
  },
};
</script>

<style></style>
