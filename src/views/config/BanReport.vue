<template>
  <div>
    <h3>내글 편집 화면</h3>

    <table class="table">
      <tr>
        <th>번호</th>
        <th>신고시간</th>
        <th>신고분류</th>
        <th>원글/답글</th>
        <th>내용</th>
        <th>신고자</th>
      </tr>
      <tr>
        <td>23939</td>
        <td>2022-05-11 12:21:08</td>
        <td>
          <span>도박</span>
        </td>
        <td>원글</td>
        <td>죽어라!</td>
        <td>tttt</td>
      </tr>
      <tr>
        <td>23939</td>
        <td>2022-05-11 12:21:08</td>
        <td>
          <span>도박</span>
        </td>
        <td>원글</td>
        <td>죽어라!</td>
        <td>tttt</td>
      </tr>
      <tr>
        <td>23939</td>
        <td>2022-05-11 12:21:08</td>
        <td>
          <span>도박</span>
        </td>
        <td>원글</td>
        <td>죽어라!</td>
        <td>tttt</td>
      </tr>
    </table>
  </div>
</template>

<script>
import api from "../../service/api";
// import RadioPopup from "../../components/ui/RadioPopup.vue";
// import CateListPopup from "../../components/ui/CateListPopup.vue";
// import toast from "../../components/ui/toast";

export default {
  components: {
    // RadioPopup,
    // CateListPopup,
  },
  data() {
    return {};
  },
  mounted() {
    this.banRepoter();
  },
  methods: {
    banRepoter() {
      api.admin.ban.loadBanList().then((res) => {
        console.log(res);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
span.hidden {
  color: #ea5f30;
}
span.open {
  color: #2cbc1e;
}
</style>
