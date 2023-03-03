<template>
  <div class="range">
    <select v-model="year">
      <option v-for="year in years" :key="year" :value="year">
        {{ year }}
      </option>
    </select>
    <select v-if="monthVisible" v-model="month">
      <option v-for="month in months" :key="month" :value="month">
        {{ month }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  props: ["monthVisible"],
  data() {
    return {
      years: "2023,2022,2021,2020,2019".split(","),
      months: "1,2,3,4,5,6,7,8,9,10,11,12".split(","),
      year: "2023",
      month: "2",
    };
  },
  methods: {
    sendEvent(type) {
      this.$emit("range-update", { type, year: this.year, month: this.month });
    },
  },
  watch: {
    year() {
      this.sendEvent("Y");
    },
    month() {
      this.sendEvent("M");
    },
  },
};
</script>

<style></style>
