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
  </div>
</template>
<script>
import api from "../service/api";
import Popup from "./ui/Popup.vue";

export default {
  props: ["initValue"],
  components: {
    Popup,
  },
  data() {
    return {
      cates: [],
      popupVisible: false,
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
      api.cate.insertCate(cateName).then((res) => {
        console.log("[카테]", res);
      });
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
