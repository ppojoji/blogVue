<template>
  <div class="reply-form">
    받는사람
    <div class="receiver">{{ receiver.userId }}</div>
    <div>
      작성자
      <div class="sender">{{ sender.userId }}</div>
    </div>
    <div class="field">
      내용
      <textarea
        class="form-control"
        rows="5"
        placeholder="최대 500자입니다."
        v-model="message"
      ></textarea>
    </div>
    <div class="error" v-if="textOverflow">500 글자를 초과 하였습니다.</div>
    <div class="footer">
      <div class="btns">
        <button @click="sendReply()">저장</button>
        <button>취소</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../service/api";
import toast from "./ui/toast";

export default {
  props: ["receiver", "sender", "prev_note"],
  data() {
    return {
      message: "",
      textOverflow: false,
    };
  },
  methods: {
    sendReply() {
      this.prev_note.seq;
      api.note
        .sendReply(
          this.sender.seq,
          this.receiver.seq,
          this.message,
          this.prev_note.seq
        )
        .then(() => {
          toast.success("답변이 등록 되었습니다.", 3000);
          this.$emit("close");
        });
    },
  },
  watch: {
    message(cur) {
      console.log(">>", cur.length);
      if (cur.length > 500) {
        this.textOverflow = true;
      } else {
        this.textOverflow = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.reply-form {
  .footer {
    display: flex;
    .btns {
      flex: 1 1 auto;
    }
    .char-cnt {
      &.error {
        color: red;
        font-weight: 500;
      }
    }
  }
}
</style>
