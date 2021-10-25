<template>
  <div>
    <h3>권한 관리 화면</h3>
    <Search />
    <button class="btn btn-primary">저장</button>
    <button class="btn btn-danger">삭제</button>
    <table class="table">
      <tr>
        <th><input type="checkbox" id="" value="" /></th>
        <th>사용자 ID</th>
        <th>사용자명</th>
        <th>권한</th>
        <th>사용여부</th>
      </tr>
      <tr>
        <td>
          <input type="checkbox" id="" value="" />
        </td>
        <td></td>
        <td></td>
        <td>
          <select name="" id="">
            <option value="">모든 사용자</option>
            <option value="">사용자</option>
            <option value="">관리자</option>
          </select>
        </td>
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
