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
      <tr v-for="note in notes" :key="note.seq" @click="readNote(note)">
        <td>{{ note.seq }}</td>
        <td v-if="mode === 'S'">{{ note.receiverId }}</td>
        <td v-else>{{ note.senderId }}</td>
        <td class="content">
          <div class="inner">{{ note.content }}</div>
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
      </tr>
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
        />
      </PopupSlot>
      <AppAlert
        v-if="alertVisible"
        message="쪽지를 삭제하시겠습니까?"
        @confirm="(yn) => deleteNote(yn)"
      ></AppAlert>
    </table>
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
      noteVisible: false,
      activeNote: null,
      mode: null,
      alertVisible: false,
      replyPopupVisible: false,
      historyVisible: false,
    };
  },
  mounted() {
    this.loadSendNote(this.notes);
  },
  methods: {
    loadSendNote() {
      api.note.loadSendNote().then((res) => {
        console.log("[NOTE]", res);
        this.mode = "S";
        this.notes = res.data;
      });
    },
    loadReceiverNote() {
      api.note.loadReceiverNote().then((res) => {
        console.log("[NOTE]", res);
        this.mode = "R";
        this.notes = res.data;
      });
    },
    timeStampToDate(millis) {
      if (millis) {
        return util.formatDate(new Date(millis));
      } else {
        return "읽지않음";
      }
    },
    readNote2(note) {
      const methodName = this.mode === "R" ? "readNote" : "readSentNote";
      api.note[methodName](note.sq).then((res) => {
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
  }
}
</style>
