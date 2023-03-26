<template>
  <div class="chart-box">
    <div class="linechart" ref="boxEl">
      <canvas ref="chartEl" height="300"></canvas>
    </div>
    <div></div>
  </div>
</template>
<script>
/**
 * statData - [{incCnt, decCnt}, {incCnt, decCnt}, ...]
 */
// import * as chart from "vue-chartjs";
import Chart from "chart.js/auto";
export default {
  props: ["year", "month", "statData", "statType", "labels"],
  data() {
    return {
      chart: null,
      sampleData: {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
          {
            label: this.labels[0],
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            data: [0, 10, 5, 2, 20, 30, 45],
          },
          {
            label: this.labels[1],
            backgroundColor: "#3366aa",
            borderColor: "#0000ff",
            data: [2, 26, 0, 0, 3, 8, 0],
          },
        ],
      },
      widthObserver: null,
    };
  },
  mounted() {
    this.chart = new Chart(this.$refs.chartEl, {
      type: "line",
      data: this.sampleData,
      options: {
        responsive: false,
        maintainAspectRatio: false,
        scales: {
          y: {
            max: () => 10,
          },
        },
      },
    });
    this.widthObserver = new ResizeObserver(() => {
      console.log("너비 변경됨", this.$refs.boxEl.offsetWidth);
      this.chart.resize(this.$refs.boxEl.offsetWidth, 300);
      // this.chart.canvas.parentNode.style.width =
      //   this.$refs.boxEl.offsetWidth + "px";
    });

    this.widthObserver.observe(this.$refs.boxEl);
  },
  beforeDestroy() {
    this.widthObserver.disconnect();
  },
  methods: {
    renderDailyChart() {
      let last = new Date(this.year, this.month, 0);
      const endDate = last.getDate();
      console.log(endDate);

      this.sampleData.labels = [];
      for (let i = 1; i <= endDate; i++) {
        this.sampleData.labels.push(i);
      }

      // 2. 가입 데이터 갱신
      const joinData = [];
      for (let j = 1; j <= endDate; j++) {
        joinData.push(0);
      }

      this.statData.forEach((st) => {
        // YYYY-MM-DD
        const date = Number.parseInt(st.range.substring(8)); // "DD"
        joinData[date - 1] = st.incCnt; // incCnt
      });

      this.sampleData.datasets[0].data = joinData;

      // 3. 탈퇴 데이터 갱신
      const delData = [];
      for (let j = 1; j <= endDate; j++) {
        delData.push(0);
      }
      this.statData.forEach((st) => {
        // YYYY-MM-DD
        const date = Number.parseInt(st.range.substring(8)); // "DD"
        delData[date - 1] = st.decCnt; // decrease
      });

      this.sampleData.datasets[1].data = delData;
    },
    renderWeeklyChart() {
      this.sampleData.labels = [];
      for (let i = 1; i <= 53; i++) {
        this.sampleData.labels.push(i);
      }

      // 2. 가입 데이터 갱신
      const joinData = [];
      for (let j = 1; j <= 53; j++) {
        joinData.push(0);
      }

      this.statData.forEach((st) => {
        // YYYY-MM-DD
        const month = Number.parseInt(st.range.substring(5)); // "MM"
        joinData[month - 1] = st.incCnt;
      });

      this.sampleData.datasets[0].data = joinData;

      // 3. 탈퇴 데이터 갱신
      const delData = [];
      for (let j = 1; j <= 53; j++) {
        delData.push(0);
      }
      this.statData.forEach((st) => {
        // YYYY-MM-DD
        const month = Number.parseInt(st.range.substring(5)); // "DD"
        delData[month - 1] = st.decCnt;
      });

      this.sampleData.datasets[1].data = delData;
    },

    renderMonthlyChart() {
      // [1, ...., 12],
      this.sampleData.labels = [];
      for (let i = 1; i <= 12; i++) {
        this.sampleData.labels.push(i);
      }

      // 2. 가입 데이터 갱신
      const joinData = [];
      for (let j = 1; j <= 12; j++) {
        joinData.push(0);
      }

      this.statData.forEach((st) => {
        // YYYY-MM-DD
        const month = Number.parseInt(st.range.substring(5)); // "MM"
        joinData[month - 1] = st.incCnt;
      });

      this.sampleData.datasets[0].data = joinData;

      // 3. 탈퇴 데이터 갱신
      const delData = [];
      for (let j = 1; j <= 12; j++) {
        delData.push(0);
      }
      this.statData.forEach((st) => {
        // YYYY-MM-DD
        const month = Number.parseInt(st.range.substring(5)); // "DD"
        delData[month - 1] = st.decCnt;
      });

      this.sampleData.datasets[1].data = delData;
    },
    renderHourChart() {
      this.sampleData.labels = [];
      for (let i = 0; i < 24; i++) {
        this.sampleData.labels.push(i);
      }

      // 2. 가입 데이터 갱신
      const joinData = [];
      for (let j = 0; j < 24; j++) {
        joinData.push(0);
      }
      this.statData.forEach((st) => {
        // YYYY-MM-DD
        const hour = Number.parseInt(st.range); // "MM"
        joinData[hour] = st.incCnt;
      });
      this.sampleData.datasets[0].data = joinData;

      // 3. 탈퇴 데이터 갱신
      const delData = [];
      for (let j = 0; j < 24; j++) {
        delData.push(0);
      }
      this.statData.forEach((st) => {
        // YYYY-MM-DD
        const hour = Number.parseInt(st.range); // "DD"
        delData[hour] = st.decCnt;
      });

      this.sampleData.datasets[1].data = delData;
    },
    renderChart() {
      console.log("(1):", this.statType);
      // 1. label 날짜 수만큼 만들기
      if (this.statType === "day") {
        this.renderDailyChart();
      } else if (this.statType === "month") {
        this.renderMonthlyChart();
      } else if (this.statType === "week") {
        this.renderWeeklyChart();
      } else if (this.statType === "hour") {
        this.renderHourChart();
      }

      this.chart.update();
    },
  },
  watch: {
    statData() {
      // console.log(this.statData);
      console.log("(0)");
      this.renderChart();
    },
  },
};
</script>
<style lang="scss" scoped>
.linechart {
  overflow: hidden;
  width: 100%;
  height: 300px;
  position: relative;
  canvas {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>
