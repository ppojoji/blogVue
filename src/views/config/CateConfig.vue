<template>
  <div>
    <h3>카테고리 편집 화면</h3>
    <select class="custom-select" id="cata" @change="cateSelected">
      <option value="">[전체보기]</option>
      <option
        :value="cate.name"
        v-for="cate in cates"
        :key="cate.seq"
        :selected="cate.name === initValue"
      >
        {{ cate.name }}
      </option>
    </select>
    <button class="btn btn-primary" @click="popup">카테고리 추가</button>
    <Popup v-if="popupVisible" @closePopup="closePopup" @addCate="addCate" />
    <RadioPopup
      v-if="editCate"
      :initValue="initModelValue"
      :models="targetModel"
      @closePopup="useYnClosePopup"
      @updateUseYn="updateUseYn"
      @click="popup"
    />
    <table class="table">
      <tr>
        <th>이름</th>
        <th>글갯수</th>
        <th>사용 여부</th>
        <th>답변 여부</th>
        <th>게시판 타입</th>
        <th></th>
        <th>순서</th>
      </tr>
      <tr v-for="cate in cates" :key="cate.seq">
        <td>
          <input
            type="text"
            ref="input"
            :value="cate.name"
            v-if="cate === activeCate"
            @keyup.enter="updateCateName($event, cate)"
            @keyup.esc="setActiveCate(null)"
            @keydown.tab.exact.prevent="nextTab(cate, 1)"
            @keydown.shift.tab.prevent="nextTab(cate, -1)"
          />
          <a href="#" @click="setActiveCate(cate)" v-else>{{ cate.name }}</a>
        </td>
        <td>
          <a href="#">{{ cate.post_cnt }}개</a>
        </td>
        <td>
          <a href="#" @click="useYnPopup(cate)">{{ cate.useYn }}</a>
        </td>
        <td>
          <a href="#" @click="replyYnPopup(cate)">{{ cate.replyYN }}</a>
        </td>
        <td>
          <a href="#" @click="boardTypePopup(cate)">{{ cate.type }}</a>
        </td>
        <td>
          <button class="btn btn-danger" @click="deleteCate(cate)">삭제</button>
        </td>
        <td>
          <button class="btn">
            <span class="material-icons-outlined" @click="changeOrder(cate, 1)">
              keyboard_arrow_down
            </span>
          </button>
          <button class="btn">
            <span
              class="material-icons-outlined"
              @click="changeOrder(cate, -1)"
            >
              keyboard_arrow_up
            </span>
          </button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import toast from "../../components/ui/toast";
import api from "../../service/api";
import Popup from "../../components/ui/Popup.vue";
import RadioPopup from "../../components/ui/RadioPopup.vue";
/**
 * 내 카테고리 조회,
 * 삭제,
 * 추가,
 * 이름변경,
 * 순서(ordering)
 *
    [카테고리 추가]
    +----------------+---------+
     java            |  34개   |  삭제  ^ v
     vue             |  9개    |  삭제  ^ v
     javascript      |  12개   |  삭제  ^ v
     spring          |  없음   |  삭제  ^ v
    ++---------------+---------+

 */
const msg = {
  DUP_CATE_NAME: "이미 존재하는 이름입니다",
  EMPTY_CATE_NAME: "카테고리 이름이 없습니다.",
  NOT_EMPTY_CATE: "카테고리에 글이 있습니다.",
};
export default {
  props: ["initValue"],
  components: {
    Popup,
    RadioPopup,
  },
  data() {
    return {
      no: "no",
      cates: null,
      activeCate: null,
      popupVisible: false,
      editCate: null,
      targetProp: null,
      targetModel: null,
      initModelValue: null,
      // replyYnCate: null,
    };
  },
  mounted() {
    api.cate.all().then((res) => {
      console.log("[모든 카테고리]", res);
      this.cates = res.data.cates;
    });
  },
  methods: {
    changeOrder(cate, delta) {
      console.log(delta);
      const idx = this.cates.findIndex((t) => t.seq === cate.seq);
      const nextIndex = idx + delta;
      const targetCate = this.cates[nextIndex];
      if (nextIndex === this.cates.length) {
        toast.info("마지막입니다", 3000);
        return;
      }
      if (nextIndex === -1) {
        toast.info("첫번째입니다", 3000);
        return;
      }
      api.cate.changeOrder(cate.seq, targetCate.seq).then((res) => {
        console.log(res);
        this.cates.splice(nextIndex, 1);
        this.cates.splice(idx, 0, targetCate);
        toast.success("성공", 3000);
      });
    },
    nextTab(cate, delta) {
      console.log("[Tab]", delta);
      const idx = this.cates.findIndex((c) => c.seq === cate.seq);
      // this.activeCate = this.cates[idx + 1]
      //console.log("[idx]" + idx);
      //this.activeCate = cate;
      const nextIndex = (this.cates.length + idx + delta) % this.cates.length;
      this.setActiveCate(this.cates[nextIndex]);
    },
    setActiveCate(cate) {
      console.log(cate);
      this.activeCate = cate;
      // if (this.activeCate) {
      //   console.log("[INPUT]", this.$refs.input);
      //   this.$refs.input[0].focus();
      // }
      this.$nextTick(() => {
        if (this.activeCate) {
          // console.log("[INPUT]", this.$refs.input);
          this.$refs.input[0].focus();
        }
      });
    },
    updateCateName(e, cate) {
      // if(e.keyCode === 13)
      console.log(e.target.value, cate);
      const cateName = e.target.value.trim();
      if (cateName.length === 0) {
        toast.error("공백은 입력하면 안됩니다.", 3000);
        return;
      }
      api.cate
        .updateCate(cate.seq, "name", cateName)
        .then((res) => {
          console.log(res);
          this.activeCate.name = res.data.cate.name;
          this.activeCate = null;
        })
        .catch((error) => {
          console.log(error);
          const message =
            msg[error.response.data.cause] ||
            `요청이 실패했습니다(${error.response.data.cause})`;
          // const text = "등록된 카테고리는 재등록 할수 없습니다.";
          toast.error(message, -1);
        });
    },
    deleteCate(cate) {
      if (cate.post_cnt > 0) {
        toast.warning("글이 있습니다.", 3000);
        return;
      }
      // TODO 토스트 메세지로 결과 알려주기
      api.cate
        .deleteCate(cate.seq)
        .then((res) => {
          const idx = this.cates.findIndex((c) => c.seq === cate.seq);
          this.cates.splice(idx, 1);
          this.activeCate = null;
          console.log("삭제", res);

          const text = "삭제에 성공 했습니다.";
          toast.success(text, 5000);
          // setTimeout(() => {
          //   //this.$store.commit("deleteMessage", msg);
          // }, 3000);
        })
        .catch((err) => {
          console.log("[실패했다]", err);
          const message =
            msg[err.response.data.cause] ||
            `요청이 실패했습니다(${err.response.data.cause})`;
          toast.error(message, 5000);
        });
    },
    popup() {
      this.popupVisible = true;
    },
    closePopup() {
      this.popupVisible = false;
    },
    useYnClosePopup() {
      this.editCate = null;
    },
    useYnPopup(cate) {
      this.editCate = cate;
      this.targetProp = "useYn";
      this.initModelValue = cate.useYn;
      this.targetModel = [
        { text: "사용", value: "Y" },
        { text: "사용안함", value: "N" },
      ];
    },
    replyYnPopup(cate) {
      this.editCate = cate;
      this.targetProp = "replyYN";
      this.initModelValue = cate.replyYN;
      this.targetModel = [
        { text: "사용", value: "Y" },
        { text: "사용안함", value: "N" },
      ];
    },
    boardTypePopup(cate) {
      console.log(cate);
      this.editCate = cate;
      this.targetProp = "type";
      this.initModelValue = cate.type;
      this.targetModel = [
        { text: "일반", value: "NM" },
        { text: "방명록", value: "VB" },
        { text: "공지사항", value: "NC" },
        { text: "사진", value: "PH" },
      ];
    },
    addCate(cateName) {
      console.log(cateName);
      api.cate
        .insertCate(cateName)
        .then((res) => {
          console.log("[카테]", res);
          console.log("[카테11]", res.data.cate.name);
          api.cate.all().then((res) => {
            this.cates = res.data.cates; // not bad...
          });
        })
        .catch((error) => {
          console.log("여기로 옴");
          console.log(error);
          // this.modalVisible = true;
          // this.alertMessage = "등록된 카테고리는 재등록 할수 없습니다.";
          // this.headText = "카테고리 중복";
          const text = "등록된 카테고리는 재등록 할수 없습니다.";
          // const type = "error";
          // const duration = 10000;

          toast.error(text, -1);
          // toast.type("error", text, 5000);

          // this.$store.commit("addMessage", {
          //   text,
          //   type,
          //   duration,
          // });
          // this.autoClosePopup();
        });
    },
    cateSelected(e) {
      //console.log("[cate]", e.target.value);
      // console.log("[cate] ", this.selectedCate);
      this.$emit("cateSelect", e.target.value);
    },
    updateUseYn(selected) {
      console.log("선택된 값", selected);
      // (seq, selected)
      api.cate
        .updateCate(this.editCate.seq, this.targetProp, selected)
        .then((res) => {
          console.log("[res]", res);

          this.editCate[this.targetProp] = selected;
          this.useYnClosePopup();
        });
    },
    updateReplyYn(selected) {
      console.log("답글 여부", selected);
    },
  },
};
</script>

<style lang="scss" scoped></style>
