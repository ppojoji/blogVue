<template>
  <div class="note-config">
    <div class="note">
      <button
        class="btn-tab"
        :class="{ active: mode === 'S' }"
        @click="loadSendNote()"
      >
        보낸 쪽지함
      </button>
      <button
        class="btn-tab"
        :class="{ active: mode === 'R' }"
        @click="loadReceiverNote()"
      >
        받은 쪽지함
      </button>
    </div>
    <table class="table">
      <tr>
        <th>번호</th>
        <th v-if="mode === 'S'">수신자</th>
        <th v-else>송신자</th>
        <th>내용</th>
        <th>보낸시간</th>
        <th>읽은시간</th>
        <th>삭제</th>
        <th>이력</th>
      </tr>
      <tr v-for="note in notes" :key="note.seq">
        <template v-if="note.isLine">
          <td class="line" colspan="7"></td>
        </template>
        <template v-else>
          <td>{{ note.seq }}</td>
          <td v-if="mode === 'S'" :class="{ deleteUser: !note.receiverId }">
            {{ note.receiverId || "탈퇴회원" }}
          </td>
          <td v-else :class="{ deleteUser: !note.senderId }">
            {{ note.senderId || "탈퇴회원" }}
          </td>
          <!-- <td v-else>{{ note.senderId ? note.senderId : "탈퇴회원" }}</td> -->
          <td class="content">
            <div class="inner" @click="readNote(note)">{{ note.content }}</div>
          </td>
          <td>{{ timeStampToDate(note.sendTime) }}</td>
          <td>{{ timeStampToDate(note.readTime) }}</td>
          <td>
            <span
              class="del material-icons-outlined"
              @click.stop="showAlert(note)"
            >
              delete_forever
            </span>
          </td>
          <td>
            <button class="btn-history" @click.stop="showHistory(note)">
              조회
            </button>
          </td>
        </template>
      </tr>
    </table>
    <div class="more">
      <div class="form-inline">
        <div class="form-group mb-2">
          <div v-if="notes" class="all-search">
            총 <span class="num">{{ notes.length }}</span
            >건
          </div>
        </div>
        <div class="form-group mx-sm-3 mb-2">
          <select class="form-control" name="listPageSize" v-model="size">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <p v-if="endOfNote">마지막 글 입니다.</p>
        <button class="btn btn-primary mb-2" v-else @click="lodeMore">
          더 보기
        </button>
      </div>
    </div>

    <PopupSlot v-if="noteVisible" @closePopup="popupClose()">
      <div>{{ activeNote.content }}</div>
      <div v-if="activeNote.count > 0" class="rep-cont">
        {{ activeNote.count }}개 답변 <span v-if="mode === 'R'">보냈음</span
        ><span v-else>받았음</span>
      </div>
      <template v-else>
        <div v-if="mode === 'R'">보낸 답변이 없습니다.</div>
        <div v-else>받은 답변이 없습니다.</div>
      </template>
      <div class="ctrl">
        <button v-if="mode === 'R'" class="form bora" @click="ReplyInsert()">
          답변하기
        </button>
        <button class="form bora" @click="popupClose()">닫기</button>
        <button class="form red" @click="showAlert(activeNote)">삭제</button>
      </div>
    </PopupSlot>
    <PopupSlot v-if="replyPopupVisible" @closePopup="replyPopupClose()">
      <ReplyForm
        :receiver="{
          seq: activeNote.sender,
          userId: activeNote.senderId,
        }"
        :sender="{
          seq: activeNote.receiver,
          userId: activeNote.receiverId,
        }"
        :prev_note="activeNote"
        @close="replyPopupClose()"
      />
    </PopupSlot>
    <PopupSlot v-if="historyVisible" @closePopup="showHistoryClose()">
      <NoteHistory
        :note="historyVisible"
        :mode="mode"
        @close="showHistoryClose()"
        @reply="addReply"
      />
    </PopupSlot>
    <AppAlert
      v-if="alertVisible"
      message="쪽지를 삭제하시겠습니까?"
      @confirm="(yn) => deleteNote(yn)"
    ></AppAlert>
  </div>
</template>

<script>
import api from "../../service/api";
import util from "../../service/util";
import PopupSlot from "../../components/ui/PopupSlot.vue";
import toast from "../../components/ui/toast";
// import MessageView from "../../components/MessageView.vue";
import AppAlert from "../../components/form/AppAlert.vue";
import ReplyForm from "../../components/ReplyForm.vue";
import NoteHistory from "../../components/note/NoteHistory.vue";

export default {
  components: { PopupSlot, AppAlert, ReplyForm, NoteHistory },
  props: ["receiver"],
  data() {
    return {
      notes: null,
      endOfNote: false,
      noteVisible: false,
      activeNote: null,
      mode: null,
      alertVisible: false,
      replyPopupVisible: false,
      historyVisible: false,
      size: "10",
    };
  },
  mounted() {
    this.loadSendNote(this.notes);
  },
  methods: {
    lodeMore() {
      const lastNote = this.notes[this.notes.length - 1];
      api.note.loadMore(this.mode, lastNote.seq, this.size).then((res) => {
        // res.data.forEach((note) => {
        //   this.notes.push(note);
        // });
        this.notes.push({ seq: Math.random() * 10000, isLine: true });
        this.notes.push(...res.data);

        this.$nextTick().then(() => {
          document.scrollingElement.scrollTop = 100000000;
        });
        if (res.data.length === 0) {
          this.endOfNote = true;
          toast.info("마지막 글입니다.", 3000);
        }
      });
    },
    addReply(note) {
      console.log(note);
      if (this.mode == "S") {
        this.notes.push(note);
      }
    },
    loadSendNote() {
      api.note.loadSendNote().then((res) => {
        console.log("[NOTE]", res);
        this.mode = "S";
        this.endOfNote = false;
        this.notes = res.data;
      });
    },
    loadReceiverNote() {
      api.note.loadReceiverNote().then((res) => {
        console.log("[NOTE]", res);
        this.mode = "R";
        this.endOfNote = false;
        this.notes = res.data;
      });
    },
    timeStampToDate(millis) {
      const date = new Date(); // 현재 시간
      const now = util.formatDate(date); // '2022-11-26 11:31:32'
      if (millis) {
        const time = util.formatDate(new Date(millis));
        // 2022-11-21 21:44:12
        const date1 = now.substring(0, 10);
        const time1 = time.substring(0, 10);
        if (date1 === time1) {
          return time.substring(11, 16) + "🤭";
        } else {
          return time1;
        }
      } else {
        return "읽지않음";
      }
    },
    readNote2(note) {
      const methodName = this.mode === "R" ? "readNote" : "readSentNote";
      api.note[methodName](note.seq).then((res) => {
        this.activeNote = res.data;
        // this.notes.splice(idx, 1, res.data);
        note.readTime = res.data.readTime;
        note.content = res.data.content;
      });
    },
    readNote(note) {
      if (this.mode === "R") {
        api.note.readNote(note.seq).then((res) => {
          console.log(res);
          this.noteVisible = true;
          this.activeNote = res.data;
          // this.notes.splice(idx, 1, res.data);
          note.readTime = res.data.readTime;
          note.content = res.data.content;
        });
      } else if (this.mode === "S") {
        api.note.readSentNote(note.seq).then((res) => {
          console.log(res);
          this.noteVisible = true;
          this.activeNote = res.data;
          note.content = res.data.content;
        });
      } else {
        alert("S R 이 아님");
      }
    },
    // readSentNote(note) {
    //   api.note.readSentNote(note.seq).then((res) => {
    //     console.log(res);
    //     this.activeNote = res.data;
    //   });
    // },
    popupClose() {
      this.activeNote = null;
      this.noteVisible = false;
    },
    deleteNote(yesno) {
      // console.log(note);
      //if (confirm("삭제하시겠습니까?")) {
      // this.showAlert()
      this.alertVisible = false;
      if (yesno === false) {
        // this.activeNote = null;
        this.popupClose();
        return;
      }
      const note = this.activeNote;
      api.note.deleteNote(note.seq, this.mode).then((res) => {
        console.log(res);
        const idx = this.notes.findIndex((n) => n.seq === note.seq);
        this.notes.splice(idx, 1);
        console.log("삭제", res);
        // this.activeNote = null;
        this.popupClose();
        const text = "삭제에 성공 했습니다.";
        toast.success(text, 3000);
      });
      //}
    },
    showAlert(note) {
      this.alertVisible = true;
      this.activeNote = note;
    },
    ReplyInsert() {
      this.replyPopupVisible = true;
    },
    replyPopupClose() {
      this.replyPopupVisible = false;
    },
    showHistory(note) {
      console.log("[조회 팝업 띄우기]", note);
      this.historyVisible = note;
    },
    showHistoryClose() {
      this.historyVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.note-config {
  display: flex;
  flex-direction: column;
  .note {
    padding: 20px 10px 0 0;
    display: flex;
    column-gap: 8px;
    .btn-tab {
      border: 0;
      padding: 5px 10px;
      border-radius: 5px 5px 0 0;
      overflow: hidden;
      color: #777;
      &.active {
        background-color: #4287ea;
        color: white;
      }
    }
  }
  .table {
    tr {
      td.content {
        position: relative;
        .inner {
          position: relative;
          max-width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      td.line {
        background-color: #f2f2f2;
        padding: 4px;
      }
      td.deleteUser {
        color: #999;
        font-size: 14px;
      }
    }
  }
  span.del {
    color: #6077cd;
  }
  .ctrl {
    display: flex;
    justify-content: flex-end;
  }
  .btn-history {
    border: none;
    background: none;
    color: rgb(38, 158, 150);
    white-space: nowrap;
  }
}
</style>
