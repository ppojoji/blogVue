<template>
  <div class="reply-view">
    <div class="input-area">
      <!-- v-on:keydown.enter.shift.exact="() => {}" -->
      <textarea
        class="form-control"
        v-model="contents"
        v-on:keydown.enter="reply($event)"
      ></textarea>
      <button class="btn-submit btn btn-primary" @click="reply">답글</button>
    </div>
    <!-- :class="{mine: user && user.id === reply.writer.id }"-->
    <ul class="reply-list">
      <li
        class="reply"
        :class="{ mine: isMyReply(reply) }"
        v-for="reply in replyList"
        :key="reply.seq"
      >
        <p v-for="(line, idx) in splitContent(reply.content)" :key="idx">
          {{ line }}
        </p>
        ({{ reply.writer.id }})
        <button
          class="btn btn-sm btn-primary"
          v-if="isMyReply(reply)"
          @click="removeReply(reply)"
        >
          삭제
        </button>
        <img
          class="singo"
          src="../assets/singo.jpeg"
          @click="showBanPopup(reply)"
        />
      </li>
    </ul>
    <PopupSlot v-if="popupVisible" @closePopup="popupClose()">
      <BanCode @bancode="policyClick" />
    </PopupSlot>
  </div>
</template>

<script>
import api from "../service/api";
import PopupSlot from "../components/ui/PopupSlot.vue";
import BanCode from "../components/BanCode.vue";
import toast from "../components/ui/toast";
export default {
  components: { PopupSlot, BanCode },
  props: ["post"],
  data() {
    return {
      contents: "",
      replyList: null,
      popupVisible: false,
    };
  },
  mounted() {
    this.selectReply();
    console.log(this.user);
  },
  methods: {
    reply(e) {
      console.log(e.target.value);
      if (!e.shiftKey) {
        e.preventDefault();
        api.reply
          .replyInsert(this.post.seq, this.contents)
          .then((res) => {
            console.log(res);
            this.replyList.unshift(res.data.reply);
            this.contents = "";
          })
          .catch((err) => {
            console.log(err);
            toast.error("로그인 후에 답글 작성 가능합니다.", 5000);
          });
      }
    },
    splitContent(content) {
      return content.split("\r\n");
    },
    selectReply() {
      api.reply.selectReply(this.post.seq).then((res) => {
        console.log(res);
        this.replyList = res.data;
      });
    },
    isMyReply(reply) {
      return this.user && this.user.id === reply.writer.id;
    },
    removeReply(reply) {
      api.reply
        .removeReply(reply.seq)
        .then((res) => {
          console.log(res);
          const idx = this.replyList.findIndex((r) => r === reply);
          this.replyList.splice(idx, 1);
          toast.success("삭제 완료", 3000);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data.cause, 6000);
        });
    },
    showBanPopup(reply) {
      console.log("[fffff]", reply);
      if (this.user == null) {
        toast.info("로그인 후에 신고가능 합니다.", 3000);
        return;
      }
      if (this.user.id === reply.writer.id) {
        toast.info("본인이 작성한 글은 신고할수 없습니다", 3000);
        return;
      }
      this.currentReply = reply;
      this.popupVisible = true;
    },
    popupClose() {
      this.popupVisible = false;
    },
    policyClick(ban) {
      console.log("클릭됨", ban.code);

      api.reply.ban(this.currentReply.seq, ban.code).then((res) => {
        console.log(res);
        toast.success("신고 완료", 3000);
      });
      this.currentReply = null;
      this.popupVisible = false;
    },
  },
  computed: {
    user() {
      return this.$store.state.user.loginUser;
    },
  },
};
</script>

<style lang="scss" scoped>
.reply-view {
  padding: 16px;
  .reply-list {
    padding: 0;
    list-style: none;
    .reply {
      padding: 8px;
      &.mine {
        background-color: #ecff6587;
      }
    }
    p {
      margin: 0;
    }
  }
  .input-area {
    display: flex;
    .btn-submit {
      white-space: nowrap;
    }
  }
  .singo {
    width: 22px;
    height: auto;
  }
}
</style>
