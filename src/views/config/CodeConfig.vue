<template>
  <div>
    <h3>코드 관리 화면</h3>
    <Search />
    <button class="btn btn-primary">코드 추가</button>
    <table class="table">
      <tr>
        <th>번호</th>
        <th>상위코드</th>
        <th>코드</th>
        <th>코드명</th>
        <th>사용여부</th>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </table>
  </div>
</template>

<script>
import Search from "../../components/Search.vue";
export default {
  components: {
    Search,
  },
  data() {
    return {};
  },
};
</script>

<style></style>
