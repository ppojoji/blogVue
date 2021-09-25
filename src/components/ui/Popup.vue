<template>
  <div class="popup-wrapper">
    <div class="dimmer" @click="closePopup"></div>
    <div class="popup-body">
      <h3>카테고리 추가</h3>
      <div>
        <input type="text" class="form-control" v-model="cateName" />
        <button class="btn btn-primary" @click="addCate">추가</button>
        <button class="btn btn-danger" @click="closePopup">닫기</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateName: "",
    };
  },
  methods: {
    closePopup() {
      this.$emit("closePopup");
    },
    addCate() {
      this.$emit("addCate", this.cateName);
      this.closePopup();
    },
  },
};
</script>

<style lang="scss" scoiped>
.popup-wrapper {
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  .dimmer {
    background-color: #0000004d;
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .popup-body {
    background-color: aliceblue;
    position: absolute;
    z-index: 10;
    top: 50%;
    left: 50%;
    width: 90%;
    transform: translate(-50%, -50%);
    padding: 16px;
  }
}
</style>
