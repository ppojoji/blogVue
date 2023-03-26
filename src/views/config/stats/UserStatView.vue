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
    <RangeSelect
      v-if="this.statType !== 'year'"
      :monthVisible="this.statType === 'day' || this.statType === 'week'"
      @range-update="updateRange"
      :range="range"
    />
    <LineChart
      :year="range.year"
      :month="range.month"
      :statData="statData"
      :statType="statType"
      :labels="['가입', '탈퇴']"
    />
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
import RangeSelect from "./RangeSelect.vue";
import LineChart from "./LineChart.vue";

export default {
  components: { RangeSelect, LineChart },
  data() {
    return {
      statType: "day",
      statData: [],
      range: {
        year: "2023",
        month: "2",
      },
    };
  },
  mounted() {
    this.loadUserStat();
  },
  methods: {
    loadUserStat() {
      api.admin.stat.user.count(this.statType, this.range).then((res) => {
        res.data.forEach((e) => {
          e.decCnt = e.delCnt;
          if (e.joinCnt !== undefined) {
            e.incCnt = e.joinCnt;
          } else if (e.postCnt !== undefined) {
            e.incCnt = e.postCnt;
          }
        });
        this.statData = res.data;
      });
    },
    updateRange(range) {
      this.range = range;
    },
  },

  watch: {
    statType() {
      this.loadUserStat();
    },
    range() {
      this.loadUserStat();
    },
  },
};
</script>

<style></style>
