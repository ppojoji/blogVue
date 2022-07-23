<template>
  <table class="table">
    <tr>
      <th>번호</th>
      <th>신고시간</th>
      <th>신고분류</th>
      <th>내용</th>
      <th>신고자</th>
    </tr>
    <tr v-for="ban in banList" :key="ban.seq" @click="banClicked(ban)">
      <td>{{ ban.seq }}</td>
      <td>{{ timeStampToDate(new Date(ban.repotertime)) }}</td>
      <td class="ban-type">
        <span> {{ banText(ban.bancode) }}</span>
      </td>
      <td v-if="hasContent(ban)">{{ getContent(ban) }}</td>
      <td v-else><span class="empty">내용없음</span></td>
      <td>{{ ban.ID }}</td>
    </tr>
  </table>
</template>

<script>
import util from "../../service/util";
export default {
  props: ["banList"],
  methods: {
    banText(banCode) {
      console.log("[### post]", banCode);
      if (banCode == "AD") {
        return "광고성글";
      } else if (banCode == "PN") {
        return "음란성글";
      } else if (banCode == "AB") {
        return "명예훼손,비방";
      } else if (banCode == "GM") {
        return "도박";
      } else if (banCode == "ET") {
        return "기타";
      }
    },
    timeStampToDate(date) {
      return util.formatDate(date);
    },
    getContent(ban) {
      if (this.banType === "P") {
        return ban.contents;
      } else {
        return ban.content;
      }
    },
    hasContent(ban) {
      let content = this.getContent(ban);
      if (content.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    banClicked(ban) {
      this.$emit("banclick", ban);
    },
  },
};
</script>

<style lang="scss" scoped>
.table {
  .empty {
    color: #bbb;
  }
}
</style>
>
