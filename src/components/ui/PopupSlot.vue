<template>
  <div class="popup-wrapper">
    <div class="dimmer" @click="closePopup"></div>
    <div class="popup-body">
      <slot />
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
  },
};
</script>

<style lang="scss" scoped>
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
    max-width: 600px;
  }
}
</style>
