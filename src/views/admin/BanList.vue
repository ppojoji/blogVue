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
      <td>{{ getContent(ban) }}</td>
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
        return ban.CONTENTS;
      } else {
        return ban.CONTENT;
      }
    },
    banClicked(ban) {
      this.$emit("banclick", ban);
    },
  },
};
</script>

<style></style>
