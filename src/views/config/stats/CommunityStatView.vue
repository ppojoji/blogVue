<template>
  <div class="stat">
    <h3>커뮤니티 통계</h3>
    <div class="stat-type">
      <!-- <select class="custom-select" v-model="statType">
        <option value="">[전체보기]</option>
        <option value="day">일별</option>
        <option value="week">주별</option>
        <option value="month">월별</option>
        <option value="year">년도별</option>
      </select> -->
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
    <RangeSelect
      v-if="this.statType !== 'year'"
      :monthVisible="this.statType === 'day'"
      @range-update="changeDate"
      :range="range"
    />
    <LineChart
      :year="range.year"
      :month="range.month"
      :statData="statData"
      :statType="statType"
      :labels="['새글', '삭제글']"
    />
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
import RangeSelect from "./RangeSelect.vue";
import LineChart from "./LineChart.vue";

const hourMap = [];
for (let h = 0; h < 24; h++) {
  hourMap.push(`${h} ~ ${h + 1} 시`);
}

export default {
  components: { RangeSelect, LineChart },
  data() {
    return {
      statType: "day",
      statData: [],
      hours:
        "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23".split(
          ","
        ),
      hourMap,
      /* TODO 여기서 현재 연도와 월을 가져오는 함수(기능)이 필요함 */
      // array 구조 분해 할당 문법으로 받아오면 좋음
      // ref: https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
      // ref: https://velog.io/@gil0127/%EA%B5%AC%EC%A1%B0-%EB%B6%84%ED%95%B4-%ED%95%A0%EB%8B%B9-%EA%B0%9D%EC%B2%B4-%EB%B0%B0%EC%97%B4
      range: {
        year: "",
        month: "",
      },
    };
  },
  mounted() {
    // const year = "2023";
    // const month = "2";
    const current = new Date();

    this.range = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
    };
    this.loadCommunityStat();
  },
  methods: {
    loadCommunityStat() {
      api.admin.stat.community.count(this.statType, this.range).then((res) => {
        /*
        if (this.statType == "hour") {
          res.data.forEach((stat) => {
            let range = Number.parseInt(stat.range);
            stat.range = hourMap[range];
          });
        }
        */
        res.data.forEach((e) => {
          e.decCnt = e.delCnt;
          if (e.postCnt !== undefined) {
            e.incCnt = e.postCnt;
          } else if (e.joinCnt !== undefined) {
            e.incCnt = e.joinCnt;
          }
        });
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
    statSelected(e) {
      const statValue = e.target.value;
      console.log(statValue);
      this.statType = statValue;
    },
    changeDate(range) {
      console.log(range); // {type: "", year: "2022", month: "12"}
      this.range = range;
      // this.loadCommunityStat(range);
    },
  },
  watch: {
    statType() {
      this.loadCommunityStat();
    },
    range() {
      this.loadCommunityStat();
    },
  },
};
</script>

<style></style>
