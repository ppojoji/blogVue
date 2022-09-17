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
    <div class="footer">
      <div class="btns">
        <button @click="sendNote()">전송</button>
        <button>취소</button>
      </div>
      <div class="char-cnt">{{ message.length }}/500</div>
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
  }
}
</style>
