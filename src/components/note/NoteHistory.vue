<template>
  <div class="history">
    <div class="box other">
      <div class="chat other">뭐하냐?</div>
    </div>
    <div class="box me">
      <div class="chat me">자다 일어남</div>
    </div>
    <div class="box other">
      <div class="chat other">나와라</div>
    </div>
    <div class="box me">
      <div class="chat me">싫어</div>
    </div>
    <div class="box other">
      <div class="chat other">꺼져</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["note"],
  data() {
    return { histories: [{}, {}] };
  },
  mounted() {
    console.log("[노트 카톡 화면처럼]", this.note);
  },
};
</script>

<style lang="scss" scoped>
.history {
  background-color: rgb(121, 172, 255);
  .box {
    display: flex;
    padding: 8px;
    &.other {
      justify-content: flex-start;
    }
    &.me {
      justify-content: flex-end;
    }
    .chat {
      width: 35%;
      margin-bottom: 16px;
      border-radius: 8px;
      padding: 4px 6px;
      &.other {
        background-color: white;
      }
      &.me {
        background-color: yellow;
      }
    }
  }
}
</style>
