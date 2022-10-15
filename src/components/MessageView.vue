<template>
  <div class="msg-view">
    <div class="body" v-if="true">
      <div class="msg" @click="gotoNotePage" v-if="notes.length > 0">
        <!-- @click="newNote()"  -->
        새로운 쪽지 ({{ notes.length }}건)
      </div>
    </div>
  </div>
</template>

<script>
import api from "../service/api";

export default {
  data() {
    return {
      notes: [],
      interval: 10 * 1000,
      maxSeq: 0,
    };
  },
  mounted() {
    if (this.user) {
      const seq = localStorage.getItem("notes.seq");
      this.maxSeq = seq ? parseInt(seq) : 0;
      this.startTimer();
    } else {
      console.log("NO LOGIN");
    }
  },
  methods: {
    startTimer() {
      if (this.user) {
        setTimeout(() => {
          this.queryMessage();
        }, this.interval);
      }
    },
    queryMessage() {
      console.log("[여기서 서버에 신규 쪽지 조회 요청 보냄");
      api.note.queryMessage(this.maxSeq).then((res) => {
        console.log(res);
        const notes = res.data.filter((note) => {
          return note.seq > this.maxSeq;
        });
        this.notes = notes;
      });
      this.startTimer();
    },
    gotoNotePage() {
      this.maxSeq = this.notes[this.notes.length - 1].seq;
      let userSeq = this.user.seq;
      localStorage.setItem(`notes.${userSeq}`, this.maxSeq);
      this.notes = []; // empty array
      this.$router.push({
        path: "/me/note",
      });
    },
  },
  computed: {
    user() {
      return this.$store.state.user.loginUser;
    },
  },
  watch: {
    user(cur) {
      console.log("message view]", cur);
      if (cur) {
        const userSeq = cur.seq;
        const seq = localStorage.getItem(`notes.${userSeq}`);
        this.maxSeq = seq ? parseInt(seq) : 0;
        this.startTimer();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.msg-view {
  position: fixed;
  bottom: 8px;
  left: 8px;
  .body {
    .msg {
      background-color: #acdcff;
      padding: 8px 16px;
    }
  }
}
</style>
