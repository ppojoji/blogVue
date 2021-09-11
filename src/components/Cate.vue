<template>
  <div>
    <select class="custom-select" id="cata" @change="cateSelected" sls>
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
  </div>
</template>
<script>
import api from "../service/api";

export default {
  props: ["initValue"],
  data() {
    return {
      cates: [],
      // selectedCate: null,
    };
  },
  mounted() {
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
  },
};
</script>
