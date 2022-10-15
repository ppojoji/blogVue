<template>
  <div class="note-form">
    <div class="receiver">{{ receiver.email }}</div>
    <div class="field">
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
        <button @click="sendNote()" :disabled="textOverflow">전송</button>
        <button>취소</button>
      </div>
      <div class="char-cnt" :class="{ error: textOverflow }">
        {{ message.length }}/500
      </div>
    </div>
  </div>
</template>

<script>
import api from "../service/api";
import toast from "../components/ui/toast";

export default {
  props: ["receiver", "sender"],
  data() {
    return {
      message: "",
      textOverflow: false,
    };
  },
  methods: {
    sendNote() {
      api.note
        .send(this.sender.seq, this.receiver.seq, this.message)
        .then(() => {
          toast.success("쪽지가 전송되었습니다.", 3000);
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
.note-form {
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
