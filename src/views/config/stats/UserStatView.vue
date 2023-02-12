<template>
  <div class="stat">
    <h3>회원 통계</h3>
    <div class="stat-type">
      <label
        ><input
          type="radio"
          name="stat"
          v-model="statType"
          value="day"
        />일별</label
      >
      <label
        ><input
          type="radio"
          name="stat"
          v-model="statType"
          value="week"
        />주별</label
      >
      <label
        ><input
          type="radio"
          name="stat"
          v-model="statType"
          value="month"
        />월별</label
      >
    </div>
    <div class="stat-view">
      <table class="table">
        <tr>
          <th>날짜</th>
          <th>가입</th>
          <th>탈퇴</th>
        </tr>
        <tr v-for="row in statData" :key="row.range">
          <td>{{ row.range }}</td>
          <td>{{ row.joinCnt }}</td>
          <td>{{ row.delCnt }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import api from "../../../service/api";

export default {
  data() {
    return {
      statType: "day",
      statData: [],
    };
  },
  mounted() {
    this.loadUserStat();
  },
  methods: {
    loadUserStat() {
      api.admin.stat.user.count(this.statType).then((res) => {
        this.statData = res.data;
      });
    },
  },
  watch: {
    statType() {
      this.loadUserStat();
    },
  },
};
</script>

<style></style>
