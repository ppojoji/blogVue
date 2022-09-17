<template>
  <div v-if="readMode">
    <div class="post-detail" v-if="post">
      <div class="title">
        <h3>{{ post.title }}</h3>
        <span
          class="btn-bookmark material-icons-outlined"
          v-if="bookMarked"
          @click="bookMark(post)"
        >
          star
        </span>
        <span
          class="btn-bookmark material-icons-outlined"
          v-else
          @click="bookMark(post)"
        >
          star_outline
        </span>
        <img
          class="singo"
          src="../assets/singo.jpeg"
          @click="showBanPopup(post)"
        />
      </div>
      <div class="writer">
        <span @click="notePopup()">{{ post.writer.id }}</span
        ><span class="date">{{ post.creationDate }}</span>
      </div>
      <div class="content" v-html="post.contents"></div>
      <TagView :tags="post.tags" @tagSelected="tagList" />
      <!-- <div v-for="tagPost in tagPosts" :key="tagPost.seq">
        {{ tagPost.title }}
      </div> -->
      <PostOfTag
        v-if="activeTag"
        :tag="activeTag"
        @activePost="postClicked"
        :currentPost="post"
      />
      <PopupSlot v-if="popupVisible" @closePopup="popupClose()">
        <BanCode @bancode="policyClick" />
      </PopupSlot>
      <!-- 효율적인 코드는 아닌데 일단! 돌아가게 하겠음.-->
      <PopupSlot v-if="noteVisible" @closePopup="notePopupClose()">
        <NoteForm
          :receiver="post.writer"
          :sender="me"
          @close="notePopupClose()"
        />
      </PopupSlot>
      <UpfileList
        :files="upfiles"
        keyProp="seq"
        nameProp="originalName"
        sizeProp="fileSize"
        :isImageFile="(file) => file.contentType.startsWith('image')"
        :getImagePath="(file) => `${host}/upfile/${file.genName}`"
        v-bind:editMode="false"
        emptyMessage="첨부파일이 없습니다."
      />
      <ReplyView :post="post" />
      <div class="control" v-if="!hideControl">
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
    <EditForm :post="post" :editMode="true" @back="back" @update="updated" />
  </div>
</template>

<script>
import api from "../service/api";
import Loading from "../components/Loading.vue";
import EditForm from "../components/EditForm.vue";
import UpfileList from "../components/UpfileList.vue";
import TagView from "../views/TagView.vue";
import PostOfTag from "../components/PostOfTag.vue";
import toast from "../components/ui/toast";
import ReplyView from "../components/ReplyView.vue";
import PopupSlot from "../components/ui/PopupSlot.vue";
import BanCode from "../components/BanCode.vue";
import NoteForm from "../components/NoteForm.vue";

// import { mapState } from "vuex";

const msg = {
  NOT_OWNER_OF_POST: "글의 소유자가 아닙니다.",
  NOT_LOGIN: "로그인 해주세요.",
  BOOKMARK_REMOVE: "북마크 해제 되었습니다.",
  BOOKMARK_INSERT: "북마크 등록 되었습니다.",
};
const showToast = (cause) => {
  let message = msg[cause];
  if (!message) {
    message = "오류가 발생했습니다.";
  }
  toast.error(msg[cause], 5000);
};

export default {
  props: ["postSeq", "hideControl"],
  components: {
    Loading,
    EditForm,
    UpfileList,
    TagView,
    PostOfTag,
    ReplyView,
    PopupSlot,
    BanCode,
    NoteForm,
  },
  data() {
    return {
      host: process.env.VUE_APP_BACKEND_HOST,
      post: null,
      upfiles: [],
      readMode: true,
      message: "읽어오는 중",
      //tagPosts: null,
      activeTag: null,
      bookMarked: false,
      popupVisible: false,
      noteVisible: false,
      // tags: [],
    };
  },
  computed: {
    // ...mapState({
    //   loginUser,
    // }),
    me() {
      return this.$store.state.user.loginUser;
    },
  },
  methods: {
    isMyPost() {
      return this.me && this.me.seq === this.post.writer.seq;
    },
    loadPost() {
      let pSeq;
      if (!this.postSeq) {
        pSeq = this.$route.params.post;
      } else {
        pSeq = this.postSeq;
      }

      api.post.detail(pSeq).then((res) => {
        console.log(res);
        this.post = res.data.post;
        this.upfiles = res.data.post.upFiles;
        if (res.data.bookMark === 0) {
          this.bookMarked = false;
        } else {
          this.bookMarked = true;
        }
        // this.tags = res.data.post.tags;
      });
    },
    deletePost() {
      console.log("삭제삭제", this.$route.params.post);
      api.post
        .remove(this.$route.params.post)
        .then((res) => {
          console.log(res);
          this.post = null;
          this.message = "삭제 완료";
          setTimeout(() => {
            this.$router.replace("/");
          }, 1000);
        })
        .catch((err) => {
          // toast.error(msg[err.response.data.cause], 5000);
          showToast(err.response.data.cause);
        });
    },
    updatePost() {
      this.readMode = false; // 편집모드로 바꿈
      api.cate.all().then((res) => {
        console.log("[카테고리 목록] ", res);
      });
    },
    buttonMain() {
      if (this.post.category) {
        this.$router.push({ path: `/posts/${this.post.category.name}` });
      } else {
        this.$router.push({ path: `/` });
      }
    },
    back() {
      console.log("cancel???");
      this.readMode = true;
    },
    popupClose() {
      this.popupVisible = false;
    },
    updated(post) {
      this.readMode = true;
      // this.post = null;

      let seq = this.post.seq;
      let title = post.title;
      let contents = post.contents;
      let cateSeq = post.cate;
      let tags = post.tags;
      console.log("[수정한태그]", tags);
      /*
       * 파일 업로드가 빠졌다...
       * (1) 파일도 같이 보내든가..
       * (2) EditForm.vue에서 파일 선택하면 바로 서버로 날려버림(업로드 바로 해버림)
       */
      api.post
        .update(seq, title, contents, cateSeq, tags)
        .then((res) => {
          console.log(res);
          this.loadPost();
        })
        .catch((err) => {
          //toast.error(msg[err.response.data.cause], 50000);
          showToast(err.response.data.cause);
        });
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
    tagList(tag) {
      console.log("tag", tag);
      this.activeTag = tag;
      // api.post.findByTag(tag.seq).then((res) => {
      //   console.log("!!", res);
      //   this.tagPosts = res.data;
      //   this.activeTag = tag;
      // });
    },
    postClicked(post) {
      if (this.post.seq !== post.seq) {
        this.$router.push({ path: `/article/${post.seq}` });
      }
    },
    bookMark(post) {
      // 나중에 코드를 정리해야함
      if (this.bookMarked) {
        api.bookMark
          .removeBookMark(post.seq)
          .then((res) => {
            console.log(res);
            toast.success(msg.BOOKMARK_REMOVE, 3000);
            this.bookMarked = false;
          })
          .catch((err) => {
            console.log(err);
            toast.error(msg.NOT_LOGIN, 3000);
          });
      } else {
        api.bookMark
          .bookMark(post.seq)
          .then((res) => {
            console.log(res);
            this.bookMarked = true;
            toast.success(msg.BOOKMARK_INSERT, 3000);
          })
          .catch((err) => {
            console.log(err);
            toast.error(msg.NOT_LOGIN, 3000);
          });
      }
    },
    showBanPopup(post) {
      console.log("[ppp]", post);
      if (this.me == null) {
        toast.info("로그인 후에 신고가능 합니다.", 3000);
        return;
      }
      if (this.me.id === post.writer.id) {
        toast.info("본인이 작성한 글은 신고할수 없습니다", 3000);
        return;
      }
      this.currentPost = post;
      this.popupVisible = true;
    },
    policyClick(ban) {
      console.log("클릭됨", ban.code);
      console.log("클릭됨", this.post.seq);
      api.post.userPostBan(this.post.seq, ban.code).then((res) => {
        console.log(res);
        //toast.success("신고 완료", 3000);
      });
    },
    notePopup() {
      this.noteVisible = true;
    },
    notePopupClose() {
      this.noteVisible = false;
    },
  },
  watch: {
    "$route.params.post"(cur, prev) {
      console.log("[router change]", prev, " > ", cur);
      this.loadPost();
    },
  },
  mounted() {
    this.loadPost();
  },
};
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  align-items: center;
  h3 {
    margin: 0px;
  }
  .btn-bookmark {
    cursor: pointer;
    user-select: none;
  }
  .singo {
    width: 22px;
    height: auto;
  }
}
</style>
