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
      <div class="upfile-info" v-if="upfiles.length > 0">
        <span class="cnt">{{ upfiles.length }}개</span>
        <span class="total-size">{{ totalSize }} bytes</span>
      </div>
      <div class="upfile-list" v-if="upfiles.length > 0">
        <div class="file" v-for="upfile in upfiles" :key="upfile.name">
          <span class="fname">{{ upfile.name }}</span>
          <span class="fsize">{{ upfile.size }} BYTES</span>
          <button class="btn-close" @click="fileDelete(upfile)">X</button>
        </div>
      </div>
      <div v-else>첨부파일 선택 가능</div>
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
  computed: {
    totalSize() {
      let size = 0;
      this.upfiles.forEach((file) => {
        size += file.size;
      });
      return size;
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

<style lang="scss">
.upfile-info {
  padding: 6px 0;
  background-color: aliceblue;
  border-bottom: 1px solid #69a6d5;
  .cnt {
    margin: 12px;
  }
}
.upfile-list {
  background-color: aliceblue;
  .file {
    padding: 6px;
    .fname {
      margin-right: 20px;
    }
    .fsize {
      margin-right: 20px;
    }
    .btn-close {
      border: none;
      background: #ff6161;
      color: white;
      border-radius: 100px;
      font-size: 12px;
      padding: 4px 10px;
      &:hover {
        box-shadow: 1px 1px 4px #cccccc8d;
      }
      &:active {
        background: #812c2c;
      }
    }
    // .btn-close:hover {
    //   box-shadow: 1px 1px 4px #cccccc8d;
    // }
    // .btn-close:active {
    //   background: #812c2c;
    // }
  }
}
</style>
