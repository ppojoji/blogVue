<template>
  <div class="alert-wrapper alert" :class="alertClass()">
    <h4 class="alert-heading">{{ headText }}</h4>
    <a href="#" @click.prevent="btnClose"
      ><span class="material-icons-outlined"> close </span></a
    >
    <p>
      {{ alertMessage }}
    </p>
  </div>
</template>
<script>
/**
 * @prop mode - [success | warning | danger] 문자열 중 하나, 기본값은 'success'
 * @prop headText - 헤더 텍스트(required)
 */
export default {
  props: ["mode", "headText", "alertMessage"],
  data() {
    return {};
  },
  methods: {
    btnClose() {
      this.$emit("btnClose");
    },
    alertClass() {
      const mode = this.mode || "success";
      return `alert-${mode}`;
    },
  },
};
</script>
<style lang="scss" scoped>
.alert-wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 1px 1px 30px #0000004d;
  & > a {
    position: absolute;
    right: 0;
    top: 0;
    transform: translate(100%, -100%);
  }
}
</style>
