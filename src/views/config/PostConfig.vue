<template>
  <div>
    <h3>내글 편집 화면</h3>
    <Search />
    <table class="table">
      <tr>
        <th>제목</th>
        <th>상태</th>
        <th>삭제</th>
        <th>이동</th>
      </tr>
      <tr>
        <td></td>
        <td>
          <div class="">
            <div class="nav-item">
              <a class="" href="#open" id="openTab">공개</a>
            </div>
            <div class="nav-item">
              <a class="" href="#private" id="privTab">비공개</a>
            </div>
          </div>
        </td>
        <td>
          <button class="btn btn-danger">삭제</button>
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
