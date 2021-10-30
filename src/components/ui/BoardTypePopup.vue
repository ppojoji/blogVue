<template>
  <div class="popup-wrapper">
    <div class="dimmer" @click="closePopup"></div>
    <div class="popup-body">
      <h3>사용여부 변경</h3>
      <div>
        <label>
          <input type="radio" value="NM" name="yesno" v-model="selected" />
          일반
        </label>
        <label>
          <input type="radio" value="VB" name="yesno" v-model="selected" /> 사용
          방명록
        </label>
        <label>
          <input type="radio" value="NC" name="yesno" v-model="selected" />
          공지
        </label>
        <label>
          <input type="radio" value="PH" name="yesno" v-model="selected" /> 사용
          사진
        </label>
      </div>
      <div>
        <button class="btn btn-primary" @click="updateCate">변경</button>
        <button class="btn btn-danger" @click="closePopup">닫기</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["initValue"],
  data() {
    return {
      cateName: "",
      selected: null,
    };
  },
  mounted() {
    this.selected = this.initValue;
  },
  methods: {
    closePopup() {
      this.$emit("closePopup");
    },
    updateCate() {
      this.$emit("updateUseYn", this.selected);
      // this.closePopup();
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
