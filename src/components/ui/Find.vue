<template>
  <div>
    <form id="loginForm">
      <div class="form-group">
        <label for="email">이메일 찾기</label>
        <input type="text" class="form-control" v-model="hint.email" />
      </div>
      <select class="sel" size="1" v-model="hint.pwhint">
        <option value="">선택하세요</option>
        <option v-for="pwhintList in pwhintLists" :key="pwhintList.value">
          {{ pwhintList.text }}
        </option>
      </select>
      <div class="form-group">
        <label for="hint">힌트</label>
        <input type="text" class="form-control" v-model="hint.pwhintans" />
      </div>
    </form>
    <button @click="(e) => sendHint(e)">비번찾기</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pwhintLists: [
        {
          value: 1,
          text: "졸업한 초등학교 이름은?",
        },
        {
          value: 2,
          text: "아버지 성함은?",
        },
        {
          value: 3,
          text: "어머니 성함은?",
        },
        {
          value: 4,
          text: "어릴 적 내 별명은?",
        },
        {
          value: 5,
          text: "좋아하는 색깔은?",
        },
      ],
      hint: {
        email: null,
        pwhint: "",
        pwhintans: null,
      },
    };
  },
  methods: {
    sendHint() {
      this.$emit("hint", {
        email: this.hint.email,
        pwhint: this.hint.pwhint,
        pwAns: this.hint.pwhintans,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
