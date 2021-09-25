<template>
  <div class="cate">
    <select class="custom-select" id="cata" @change="cateSelected">
      <option value="0">[전체보기]</option>
      <option
        :value="cate.seq"
        v-for="cate in cates"
        :key="cate.seq"
        :selected="cate.seq === initValue"
      >
        {{ cate.name }}
      </option>
    </select>
    <button class="btn btn-primary" @click="popup">카테고리 추가</button>
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
    });
  },
  methods: {
    cateSelected(e) {
      // console.log("[cate]", e.target.value);
      // console.log("[cate] ", this.selectedCate);
      this.$emit("cateSelect", e.target.value);
    },
    popup() {
      this.popupVisible = true;
    },
    closePopup() {
      this.popupVisible = false;
    },
    addCate(cateName) {
      console.log(cateName);
      api.cate
        .insertCate(cateName)
        .then((res) => {
          console.log("[카테]", res);
          console.log("[카테11]", res.data.cate.name);
          //if (cateName === res.data.cate.name) {
          //alert("등록된 카테고리는 재등록 할수 없습니다.");
          //return;
          //}
          api.cate.all().then((res) => {
            this.cates = res.data.cates;
          });
        })
        .catch((error) => {
          console.log("여기로 옴");
          console.log(error);
          this.modalVisible = true;
          this.alertMessage = "등록된 카테고리는 재등록 할수 없습니다.";
          this.headText = "카테고리 중복";
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
