<template>
  <div class="popup-wrapper">
    <div class="dimmer" @click="closePopup"></div>
    <div class="popup-body">
      <h3>카테고리 목록</h3>
      <ul class="cate-list list-group">
        <li class="cate list-group-item" v-for="cate in cates" :key="cate.seq">
          <span
            class="check material-icons-outlined"
            v-if="cateSelect && cateSelect.seq === cate.seq"
          >
            check
          </span>
          <span class="empty" v-else></span>
          <a href="#" @click="catePostClick(cate)"> {{ cate.name }} </a>
        </li>
      </ul>
      <div>
        <button class="btn btn-danger" @click="closePopup">닫기</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../service/api";
export default {
  props: ["cateSelect"],
  data() {
    return {
      cates: null,
    };
  },
  mounted() {
    console.log(this.cateSelect);
    this.cateList();
  },
  methods: {
    closePopup() {
      this.$emit("cateClosePopup");
    },
    cateList() {
      api.cate.all().then((res) => {
        console.log(res);
        this.cates = res.data.cates;
      });
    },
    catePostClick(category) {
      this.$emit("postCateClick", category);
    },
  },
};
</script>

<style lang="scss" scoped>
.popup-body {
  .cate-list {
    .cate {
      display: flex;
      align-items: center;
      column-gap: 20px;
      .check {
        font-size: 18px;
      }
      .empty {
        width: 18px;
      }
    }
  }
}
</style>
