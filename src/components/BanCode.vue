<template>
  <div class="ban-list">
    <ul class="policy">
      <li v-for="pol in policy" :key="pol.code" @click="policyClicked(pol)">
        {{ pol.text }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      policy: [
        { code: "AD", text: "광고성 글" },
        { code: "PN", text: "음란매체" },
        { code: "AB", text: "명예훼손,비방" },
        { code: "GM", text: "도박" },
        { code: "ET", text: "기타" },
        { code: null, text: "해제됨" },
      ],
    };
  },
  methods: {
    policyClicked(pol) {
      this.$emit("bancode", pol);
    },
  },
};
</script>

<style lang="scss" scoped>
.ban-list {
  .policy {
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      display: flex;
      column-gap: 16px;
      span.reason {
        flex: 1 1 auto;
      }
    }
  }
}
</style>
