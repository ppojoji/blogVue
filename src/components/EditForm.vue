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
      <Cate :initValue="cateSeq" @cateSelect="cateSelect" />
    </div>

    <div>
      <textarea class="form-elem" id="content"></textarea>
    </div>
    <div class="taglist">
      <input type="text" @keyup.enter="tagInsert($event)" />
      <!-- <div class="tags">
        <span class="tag" v-for="delTag in delTags" :key="delTag.seq"
          >{{ delTag.tagName }}
          <span class="close material-icons-outlined" @click="tagClose(delTag)"
            >close</span
          >
        </span>
      </div> -->
      <TagView :tags="delTags" @tagclose="tagClose" :editable="true" />
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
        keyProp="name"
        nameProp="name"
        sizeProp="size"
        :isImageFile="(file) => file.type.startsWith('image')"
        :getImagePath="(file) => file.src"
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
import api from "../service/api";
import Cate from "../components/Cate.vue";
import UpfileList from "../components/UpfileList.vue";
import TagView from "../views/TagView.vue";
/* global $ */
export default {
  components: { UpfileList, Cate, TagView },
  props: ["post", "mode", "category"],
  data() {
    return {
      summernoteJs: null,
      upfiles: [],
      cates: [],
      cateSeq: 0,
      delTags: [], // []
      // totalSize: 0, // 파생 필드
      // upfileInfos: [],
    };
  },
  methods: {
    cancel() {
      console.log("취소 버튼 클릭");
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
        cate: this.cateSeq,
        tags: this.delTags, // [{seq, tagName}, {seq, tagName}]
      });
    },
    attacheFile(e) {
      console.log(e.target.files);
      const file = e.target.files[0];

      const reader = new FileReader(); // (1)
      reader.addEventListener("load", () => {
        // (3)
        const src = reader.result;
        file.src = src;
        this.upfiles.push(file);
      });
      reader.readAsDataURL(file); // (2)

      e.target.value = ""; // input file 초기화 하는 꼼수
      // this.totalSize += e.target.files[0].size;
    },
    fileDelete(file) {
      console.log("[지울 파일] ", file);
      const idx = this.upfiles.findIndex((f) => f === file);
      // this.totalSize -= file.size;

      this.upfiles.splice(idx, 1);
    },
    tagClose(tag) {
      //api.post.tagDelete().then((res) => {
      //console.log(res);
      console.log("닫기", tag);
      const idx = this.delTags.findIndex((t) => t === tag);

      this.delTags.splice(idx, 1);
      //});
    },
    /*
        $('#input).keyup((e) => {
          e.target.value
          if(e.keyCode === 13) {

          }
        })
        */
    tagInsert(e) {
      console.log("[여기]", e);
      /*
      this.delTags.push({
        seq: parseInt(Math.random() * 100000),
        tagName: e.target.value,
      });
       e.target.value = "";
       */
      api.post.tagInsert(e.target.value).then((res) => {
        console.log(res);
        // this.delTags.push({
        //   seq: res.data.seq,
        //   tagName: res.data.tagName,
        // });
        this.delTags.push(res.data.tag); // {success: true, tag: {seq: 2333, tagName: 'gasdfasd'}}
        e.target.value = "";
      });
    },
    cateSelect(cateSeq) {
      console.log("[CATEGORY]", cateSeq);
      this.cateSeq = cateSeq;
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
    api.post.all().then((res) => {
      this.cates = res.data.cata;
    });
    if (this.mode == true) {
      this.cateSeq = this.post.category ? this.post.category.seq : 0;
    }
  },
};
</script>

<style lang="scss"></style>
