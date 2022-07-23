<template>
  <div class="cate">
    <select class="custom-select" id="cata" @change="cateSelected">
      <option value="0">[전체보기]</option>
      <option
        :value="cate.seq"
        v-for="cate in cates"
        :key="cate.seq"
        :selected="cate.name === initValue"
      >
        {{ cate.name }}
      </option>
    </select>
    <!-- <button class="btn btn-primary" @click="popup">카테고리 추가</button> -->
    <Popup v-if="popupVisible" @closePopup="closePopup" @addCate="addCate" />
    <Alert
      v-if="modalVisible"
      @btnClose="btnClose"
      mode="warning"
      :alertMessage="alertMessage"
      :headText="headText"
    />
  </div>
</template>
<script>
import api from "../service/api";
import Popup from "./ui/Popup.vue";
import Alert from "../components/Alert.vue";
import toast from "./ui/toast";
// import toast from "./ui/toast";

// toast.error("hello");
export default {
  props: ["initValue"],
  components: {
    Popup,
    Alert,
  },
  data() {
    return {
      cates: [],
      popupVisible: false,
      // alert: {
      //   modalVisible: false,
      //   headText: null,
      //   alertMessage: null,
      // },
      modalVisible: false,
      headText: null,
      alertMessage: null,
      // selectedCate: null,
    };
  },
  mounted() {
    console.log(api);
    api.cate.all().then((res) => {
      this.cates = res.data.cates;
      const cate = this.cates.find((cate) => cate.name === this.initValue);
      this.$emit("cateSelect", cate);
    });
  },
  methods: {
    cateSelected(e) {
      const seq = parseInt(e.target.value);
      console.log(seq);
      const cate = this.cates.find((cate) => cate.seq === seq);
      this.$emit("cateSelect", cate);
    },
    popup() {
      this.popupVisible = true;
    },
    closePopup() {
      this.popupVisible = false;
    },
    autoClosePopup() {
      setTimeout(() => {
        this.modalVisible = false;
      }, 3000);
      console.log("팝업 자동 닫힘");
    },
    addCate(cateName) {
      console.log(cateName);
      api.cate
        .insertCate(cateName)
        .then((res) => {
          console.log("[카테]", res);
          console.log("[카테11]", res.data.cate.name);
          api.cate.all().then((res) => {
            this.cates = res.data.cates;
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
    btnClose() {
      this.modalVisible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.cate {
  display: flex;
  button {
    white-space: nowrap;
  }
}
</style>
