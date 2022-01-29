<template>
  <div>
    <h3>차단 사유</h3>
    <Ban :banList="banHistory" :post="post"> </Ban>
    <ul class="policy">
      <li v-for="pol in policy" :key="pol.code" @click="SetPolicy(pol)">
        {{ pol.text }}
      </li>
    </ul>
  </div>
</template>

<script>
/*
AD: 광고성글
PN: 음란매체
AB: 명예훼손,비방
GM: 도박
ET: 기타
*/
import api from "../../service/api";
import Ban from "../admin/Ban.vue";
export default {
  components: { Ban },
  props: ["post"],
  data() {
    return {
      banHistory: [],
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
  mounted() {
    // console.log("[POST]", this.post);

    api.admin.post.banHistory(this.post.seq).then((res) => {
      console.log(res);
      this.banHistory = res.data.ban;
    });
  },
  methods: {
    SetPolicy(policy) {
      console.log(policy);
      api.admin.post.policy(this.post.seq, policy.code).then((res) => {
        console.log(res);
        this.$emit("popupClose");
        this.post.ban = res.data.ban;
        this.post.recentBan.banTime = res.data.banTime;
      });
    },
    banText(code) {
      // code = null
      const elem = this.policy.find((elem) => elem.code === code);
      // if (elem) {
      //   return elem.text;
      // } else {
      //   return "해제";
      // }
      return elem.text;
    },
  },
};
</script>

<style lang="scss" scoped>
.ban-history {
  background-color: #bfe1ff;
  padding: 8px;
  ul {
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
ul.policy {
  list-style: none;
  padding: 0px;
  margin: 0px;
  li {
    padding: 4px;
    cursor: pointer;
    &:hover {
      background-color: #beefff;
    }
  }
}
</style>
