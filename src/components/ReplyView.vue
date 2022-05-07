<template>
  <div class="reply-view">
    <div class="input-area">
      <textarea class="form-control" v-model="contents"></textarea>
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
        {{ reply.content }}({{ reply.writer.id }})
        <button
          class="btn btn-sm btn-primary"
          v-if="isMyReply(reply)"
          @click="removeReply(reply)"
        >
          삭제
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import api from "../service/api";
export default {
  props: ["post"],
  data() {
    return {
      contents: "",
      replyList: null,
    };
  },
  mounted() {
    this.selectReply();
    console.log(this.user);
  },
  methods: {
    reply() {
      api.post.replyInsert(this.post.seq, this.contents).then((res) => {
        console.log(res);
        this.replyList.unshift(res.data.reply);
      });
    },
    selectReply() {
      api.post.selectReply(this.post.seq).then((res) => {
        console.log(res);
        this.replyList = res.data;
      });
    },
    isMyReply(reply) {
      return this.user && this.user.id === reply.writer.id;
    },
    removeReply(reply) {
      api.post.removeReply(reply.seq).then((res) => {
        console.log(res);
        const idx = this.replyList.findIndex((r) => r === reply);
        this.replyList.splice(idx, 1);
      });
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
  }
  .input-area {
    display: flex;
    .btn-submit {
      white-space: nowrap;
    }
  }
}
</style>
