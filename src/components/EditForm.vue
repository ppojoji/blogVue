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
      <Cate
        :initValue="activeCate ? activeCate.name : ''"
        @cateSelect="cateSelect"
      />
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
        :isImageFile="isImageFile"
        :getImagePath="getImagePath"
        v-bind:editMode="true"
        @fileDelete="fileDelete"
        emptyMessage="파일 첨부 선택가능"
      />
    </div>
    <div>
      <button @click="update">
        {{ editMode ? "수정하기" : "글작성" }}
      </button>
      <button @click="cancel">취소</button>
    </div>
  </div>
</template>

<script>
import api from "../service/api";
import Cate from "../components/Cate.vue";
import UpfileList from "../components/UpfileList.vue";
import TagView from "../views/TagView.vue";
import toast from "../components/ui/toast";
/* global $ */
export default {
  components: { UpfileList, Cate, TagView },
  props: ["post", "editMode", "category"],
  data() {
    return {
      summernoteJs: null,
      upfiles: [],
      cates: [],
      // cateSeq: 0, // 얘는 없어짐!!
      activeCate: null,
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
      if (!this.activeCate) {
        toast.warning("카테고리를 선택해 주세요.", 3000);
        return;
      }
      this.$emit("update", {
        title: this.post.title,
        contents,
        upfiles: this.upfiles,
        cate: this.activeCate.seq, // FIXME seq 말고 cate 자체를 넘겨야 함
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

        // (4) 편집 상태에서는 첨부된 파일을 서버로 보내서 업로드해버림!
        if (this.editMode) {
          api.post.uploadFile(this.post.seq, file).then(() => {});
        }
      });
      reader.readAsDataURL(file); // (2)

      e.target.value = ""; // input file 초기화 하는 꼼수
      // this.totalSize += e.target.files[0].size;
    },
    fileDelete(file) {
      console.log("[지울 파일] ", file);
      api.post.deleteFile(file.genName).then(() => {
        const idx = this.upfiles.findIndex((f) => f === file);
        this.upfiles.splice(idx, 1);
      });
      // this.totalSize -= file.size;
    },
    tagClose(tag) {
      //api.post.tagDelete().then((res) => {
      //console.log(res);
      console.log("닫기", tag);
      const idx = this.delTags.findIndex((t) => t === tag);

      this.delTags.splice(idx, 1);
      //});
    },
    tagInsert(e) {
      console.log("[여기]", e);
      const index = this.delTags.findIndex(
        (tag) => e.target.value === tag.tagName
      );
      if (index >= 0) {
        toast.info("이미 있는 태그 입니다.", 3000);
        return;
      }

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
    cateSelect(cate) {
      // FIXME  여기도 봐야함
      console.log("[CATEGORY]", cate);

      this.activeCate = cate;
    },
    isImageFile(file) {
      if (file.seq) {
        return file.contentType.startsWith("image");
      } else {
        return file.type.startsWith("image");
      }
    },
    getImagePath(file) {
      console.log("pdddd");
      if (file.seq) {
        return "http://localhost:8080/upfile/" + file.genName;
      } else {
        return file.src;
      }
    },
  },
  mounted() {
    var script = document.createElement("script");
    this.summernoteJs = script;
    this.delTags = this.post.tags;
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
    if (this.editMode == true) {
      this.activeCate = this.post.category;
      this.upfiles = this.post.upFiles;
      // this.cateSeq = this.post.category ? this.post.category.seq : 0;
    }
  },
};
</script>

<style lang="scss"></style>
