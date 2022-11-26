<template>
  <div class="kketook">
    <div
      class="history"
      style="overflow: auto; height: 80vh"
      :key="updated"
      ref="history"
    >
      <div class="by-date" v-for="[ymd, histories] in dateMap" :key="ymd">
        <div class="delim">
          <div class="bar"></div>
          <div class="date">{{ formatYMD(ymd) }}</div>
        </div>
        <div
          class="box"
          :class="user.id === history.senderId ? 'me' : 'other'"
          v-for="history in histories"
          :key="history.seq"
        >
          <!-- :class="history.seq === note.seq ? 'hl' : ''"  -->
          <div
            class="chat"
            :class="{
              me: user.id === history.senderId,
              other: user.id !== history.senderId,
              hl: history.seq === note.seq,
            }"
          >
            <div class="arrow"></div>
            <div class="msg">
              <div
                class="para"
                v-for="(txt, index) in history.content.split('\n')"
                :key="index"
              >
                {{ txt }}
              </div>
            </div>
            <div class="writer">{{ history.senderId }}</div>
            <!-- <div class="time">{{ msToTime(history.sendTime) }}</div> -->
            <div class="time">{{ formatTime(history.sendTime) }}</div>
            <div class="unread" v-if="history.readTime == null">1</div>
          </div>
        </div>
      </div>
    </div>
    <div class="input">
      <textarea
        rows="4"
        v-model="message"
        @keydown.enter.shift.exact.prevent="sendMessage()"
      ></textarea>
      <div>
        <button @click="sendMessage()">전송</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../service/api";
import util from "../../service/util";

const DAYS = "일월화수목금토".split("");

export default {
  props: ["note", "mode"],
  data() {
    return {
      histories: null,
      dateMap: null,
      scrollPostion: 0,
      message: "",
      prev_note: null,
      updated: 0,
    };
  },
  mounted() {
    console.log("[노트 카톡 화면처럼]", this.note);
    this.showHistory();
  },
  watch: {},
  computed: {
    // store 객체의 축약 필드를 맵핑해줌
    user() {
      return this.$store.state.user.loginUser;
    },
  },
  methods: {
    showHistory() {
      api.note.noteHistory(this.note.seq, this.mode).then((res) => {
        console.log("[HISTORY]", res);
        const dateMap = new Map();
        res.data.forEach((chat) => {
          const date = this.msToTime(chat.sendTime);
          const ymd = date.substring(0, 10);
          if (!dateMap.has(ymd)) {
            dateMap.set(ymd, []);
          }
          const chats = dateMap.get(ymd);
          chats.push(chat);
        });
        this.dateMap = dateMap;
        this.histories = res.data;
        const last = res.data.findLast((chat) => {
          console.log(chat);
          if (this.user.seq === chat.receiver) {
            return true;
          } else {
            return false;
          }
        });
        this.prev_note = last;
      });
    },
    refreshAll() {
      // 새로고침
      this.$router.go();
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
    formatTime(time) {
      // 123993999 long number
      // new Date(...)

      // console.log(hhmm);
      //ref: https://stackoverflow.com/questions/8888491/how-do-you-display-javascript-datetime-in-12-hour-am-pm-format
      const date = new Date(time);
      let hours = date.getHours();
      const ampm = hours >= 12 ? "오후" : "오전";

      const ymd = this.msToTime(time); // string
      const mm = ymd.substring(14, 16); // '22:09', '09:21'
      return `${ampm} ${hours}:${mm}`;
    },
    formatYMD(ymd) {
      // 2022-10-06 => ['2022', '10', '06']
      // 2022년 10월 06일 화요일
      // const y = ymd.substring(0, 4);
      // console.log("[y]", y);
      // const m = ymd.substring(5, 7);
      // console.log("[m]", m);
      // const d = ymd.substring(8, 10);
      // console.log("[d]", d);
      const [y, m, d] = ymd.split("-");

      const date = new Date(ymd);
      const day = DAYS[date.getDay()];
      return `${y}년 ${m}월 ${d}일 ${day}요일`;
    },
    sendMessage() {
      console.log(this.message, this.prev_note);

      api.note.sendReply(this.message, this.prev_note.seq).then((res) => {
        // toast.success("답변이 등록 되었습니다.", 3000);
        console.log("답변 등록됨! 지금 입력한 메세지가 화면에 나와야 함");
        const note = res.data.note;
        const date = this.msToTime(note.sendTime);
        const ymd = date.substring(0, 10);
        if (!this.dateMap.has(ymd)) {
          this.dateMap.set(ymd, []);
        }
        const chats = this.dateMap.get(ymd);
        chats.push(note);

        this.updated++;
        this.message = "";
        console.log(this.$refs.history);

        this.$nextTick(() => {
          this.$refs.history.scrollTop = 10000000000;
        });
        this.$emit("reply", note);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
$arrow-size: 12px;

.history {
  background-color: rgb(121, 172, 255);
  .box {
    display: flex;
    padding: 8px 20px;
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
        &.hl {
          outline: 8px solid #3881afc2;
        }
        .time {
          transform: translateX(120%);
          right: 0;
        }
        .arrow {
          left: 0;
          border-right: $arrow-size solid white;
          transform: translateX(-100%) skew(0deg, 30deg);
        }
      }
      &.me {
        background-color: yellow;
        &.hl {
          outline: 8px solid #3881afc2;
        }
        .time {
          transform: translateX(-120%);
          left: 0;
        }
        .arrow {
          right: 0;
          border-left: $arrow-size solid yellow;
          transform: translateX(100%) skew(0deg, -30deg);
        }
      }
      .arrow {
        // left: 0;
        position: absolute;
        width: $arrow-size;
        height: $arrow-size;
        background-color: transparent;

        border-top: $arrow-size solid transparent;
        // transform: translateX(-100%) skew(0deg, 30deg);
      }
      .time {
        position: absolute;

        bottom: 0;
      }
    }
    .unread {
      display: flex;
      justify-content: left;
      color: #f2ff00;
      position: absolute;
      top: 0;
      left: -20px;
    }
  }
  .delim {
    display: flex;
    justify-content: center;
    position: relative;
    margin-bottom: 16px;
    .bar {
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: #5e7092;
    }
    .date {
      color: #5e7092;
      background-color: #79acff;
      position: relative;
      z-index: 5;
    }
  }
}
.input {
  display: flex;
  textarea {
    width: 100%;
    resize: none;
    padding: 8px;
  }
  button {
    white-space: nowrap;
    height: 100%;
  }
}
</style>
