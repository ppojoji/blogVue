<template>
  <div>
    <div>
      <button @click="loadSendNote()">보낸 쪽지함</button>
      <button @click="loadReceiverNote()">받은 쪽지함</button>
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
      </tr>
      <tr v-for="note in notes" :key="note.seq" @click="readNote(note)">
        <td>{{ note.seq }}</td>
        <td v-if="mode === 'S'">{{ note.receiverId }}</td>
        <td v-else>{{ note.senderId }}</td>
        <td>{{ note.content }}</td>
        <td>{{ timeStampToDate(note.sendTime) }}</td>
        <td>{{ timeStampToDate(note.readTime) }}</td>
        <td>
          <button class="btn-del" @click.stop="deleteNote(note)">X</button>
        </td>
      </tr>
      <PopupSlot v-if="activeNote" @closePopup="popupClose()">
        <div>{{ activeNote.content }}</div>
      </PopupSlot>
    </table>
  </div>
</template>

<script>
import api from "../../service/api";
import util from "../../service/util";
import PopupSlot from "../../components/ui/PopupSlot.vue";
export default {
  components: { PopupSlot },
  data() {
    return {
      notes: null,
      // noteVisible: false,
      activeNote: null,
      mode: null,
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
          this.activeNote = res.data;
          // this.notes.splice(idx, 1, res.data);
          note.readTime = res.data.readTime;
          note.content = res.data.content;
        });
      } else if (this.mode === "S") {
        api.note.readSentNote(note.seq).then((res) => {
          console.log(res);
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
    },
    deleteNote(note) {
      console.log(note);
      api.note.deleteNote(note.seq, this.mode).then((res) => {
        console.log(res);
      });
    },
  },
};
</script>

<style></style>
