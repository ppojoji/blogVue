<template>
  <div class="stat">
    <h3>커뮤니티 통계</h3>
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
      <label
        ><input
          type="radio"
          name="stat"
          v-model="statType"
          value="year"
        />년도별</label
      >
      <label
        ><input
          type="radio"
          name="stat"
          v-model="statType"
          value="hour"
        />시간별</label
      >
    </div>
    <div class="stat-view">
      <table class="table">
        <tr>
          <th>날짜</th>
          <th>글작성</th>
          <th>글삭제</th>
        </tr>
        <template v-if="statType !== 'hour'">
          <tr v-for="row in statData" :key="row.range">
            <td>{{ row.range }}</td>
            <td>{{ row.postCnt }}</td>
            <td>{{ row.delCnt }}</td>
          </tr>
        </template>
        <template v-else>
          <tr v-for="hour in hours" :key="hour">
            <td>{{ hourMap[hour] }}</td>
            <td>{{ countHourPost(hour) }}</td>
            <td>{{ 0 }}</td>
          </tr>
        </template>
      </table>
    </div>
  </div>
</template>

<script>
import api from "../../../service/api";

const hourMap = [];
for (let h = 0; h < 24; h++) {
  hourMap.push(`${h} ~ ${h + 1} 시`);
}

export default {
  data() {
    return {
      statType: "day",
      statData: [],
      hours:
        "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23".split(
          ","
        ),
      hourMap,
    };
  },
  mounted() {
    this.loadCommunityStat();
  },
  methods: {
    loadCommunityStat() {
      api.admin.stat.community.count(this.statType).then((res) => {
        /*
        if (this.statType == "hour") {
          res.data.forEach((stat) => {
            let range = Number.parseInt(stat.range);
            stat.range = hourMap[range];
          });
        }
        */
        this.statData = res.data;
      });
    },
    countHourPost(hour) {
      const stat = this.statData.find((stat) => {
        return stat.range === hour;
      });

      if (stat) {
        return stat.postCnt;
      } else {
        return 0;
      }
    },
  },
  watch: {
    statType() {
      this.loadCommunityStat();
    },
  },
};
</script>

<style></style>
