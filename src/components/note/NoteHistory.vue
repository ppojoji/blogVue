<template>
  <div class="history" style="overflow: auto; height: 80vh">
    <!-- <div class="box other">
      <div class="chat other">뭐하냐?</div>
    </div>
    <div class="box me">
      <div class="chat me">자다 일어남</div>
    </div>
    <div class="box other">
      <div class="chat other">나와라</div>
    </div>
    <div class="box me">
      <div class="chat me">싫어</div>
    </div>
    <div class="box other">
      <div class="chat other">꺼져</div>
    </div>
  </div> -->
    <div
      class="box"
      :class="user.id === history.senderId ? 'me' : 'other'"
      v-for="history in histories"
      :key="history.seq"
    >
      <div class="chat" :class="user.id === history.senderId ? 'me' : 'other'">
        <div class="msg">{{ history.content }}</div>
        <div class="writer">{{ history.senderId }}</div>
        <div class="time">{{ msToTime(history.sendTime) }}</div>
        <div class="unread" v-if="history.readTime == null">1</div>
      </div>
    </div>
    <!-- <div class="box me" v-for="history in histories" :key="history.seq">
      <div class="chat me">{{ history.content }}</div>
      <div class="chat me">{{ history.readTime }}</div>
    </div> -->
  </div>
</template>

<script>
import api from "../../service/api";
import util from "../../service/util";
export default {
  props: ["note", "mode"],
  data() {
    return {
      histories: null,
      scrollPostion: 0,
    };
  },
  mounted() {
    console.log("[노트 카톡 화면처럼]", this.note);
    this.showHistory();
  },
  computed: {
    // store 객체의 축약 필드를 맵핑해줌
    user() {
      return this.$store.state.user.loginUser;
    },
  },
  methods: {
    showHistory() {
      if (this.mode == "S") {
        api.note.noteHistory(this.note.seq, "S").then((res) => {
          console.log("[HISTORY]", res);
          this.histories = res.data;
        });
      } else {
        api.note.noteHistory(this.note.seq, "R").then((res) => {
          console.log("[HISTORY]", res);
          this.histories = res.data;
        });
      }
    },
    msToTime(millis) {
      const d = new Date(millis);
      return util.formatDate(d);
    },
    handleScroll(e) {
      this.scrollPostion = e.target.scrollTop;

      if (this.scrollPosition > 100) {
        console.log("UP");
      } else {
        console.log("DOWN");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.history {
  background-color: rgb(121, 172, 255);
  .box {
    display: flex;
    padding: 8px;
    &.other {
      justify-content: flex-start;
    }
    &.me {
      justify-content: flex-end;
    }
    .chat {
      width: 35%;
      margin-bottom: 16px;
      border-radius: 8px;
      padding: 4px 6px;
      position: relative;
      &.other {
        background-color: white;
      }
      &.me {
        background-color: yellow;
      }
    }
    .unread {
      display: flex;
      justify-content: left;
      color: #f2ff00;
      position: absolute;
      bottom: 0;
      left: -20px;
    }
  }
}
</style>
