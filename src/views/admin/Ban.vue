<template>
  <div class="ban-history">
    <!--

          admin: "admin@gmail.com"
        banTime: 1641817993000
        post: 27
        reason: "PN"
        seq: 23
       -->
    <div class="title">{{ post.title }}</div>
    <ul class="ban">
      <li v-if="banList.length === 0">금지 이력 없음</li>
      <li v-for="ban in banList" :key="ban.seq">
        <span class="time">{{ timeStampToDate(new Date(ban.banTime)) }}</span
        ><span class="reason">{{ banText(ban.reason) }}</span
        ><span class="admin">({{ ban.admin }})</span>
      </li>
    </ul>
  </div>
</template>

<script>
import util from "../../service/util";
export default {
  props: ["post", "banList"],
  data() {
    return {};
  },
  mounted() {
    console.log(util.formatDate(new Date()));
    console.log(this.post, this.banList);
  },
  methods: {
    showTimeStamp(timeStamp) {
      this.summary.visible = true;
      this.summary.content = this.timeStampToDate(new Date(timeStamp));
    },
    // 코.드.중.복(이거 다른데도 똑같이 쓰고 있음)
    timeStampToDate(date) {
      return util.formatDate(date);
    },
    banText(ban) {
      if (ban == null) {
        return "공개중";
      } else if (ban == "AD") {
        return "광고성글";
      } else if (ban == "PN") {
        return "음란성글";
      } else if (ban == "AB") {
        return "명예훼손,비방";
      } else if (ban == "GM") {
        return "도박";
      } else if (ban == "ET") {
        return "기타";
      }
    },
  },
};
</script>

<style lang="scss">
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
</style>
