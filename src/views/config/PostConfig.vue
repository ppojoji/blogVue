<template>
  <div>
    <h3>내글 편집 화면</h3>
    <Search />
    <RadioPopup
      v-if="editPost"
      :initValue="initValue"
      @closePopup="editPost = null"
      :models="targetModel"
    />
    <table class="table">
      <tr>
        <th>제목</th>
        <th>상태</th>
        <th>삭제</th>
        <th>이동</th>
      </tr>
      <tr v-for="list in lists" :key="list.seq">
        <td>
          {{ list.title }}
        </td>
        <td>
          <a class="" href="#open" id="openTab" @click="EditPost(list)">{{
            list.open
          }}</a>
          <!-- <div class="">
            <div class="nav-item">
              <a class="" href="#open" id="openTab">공개</a>
            </div>
            <div class="nav-item">
              <a class="" href="#private" id="privTab">비공개</a>
            </div>
          </div> -->
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
import api from "../../service/api";
import RadioPopup from "../../components/ui/RadioPopup.vue";

export default {
  components: {
    Search,
    RadioPopup,
  },
  data() {
    return {
      lists: null,
      editPost: null,
      initValue: null,
      targetModel: null,
    };
  },
  mounted() {
    api.post.allForAdmin().then((res) => {
      console.log(res);
      this.lists = res.data.posts;
    });
  },
  methods: {
    EditPost(list) {
      this.editPost = list;
      this.initValue = list.open ? "Y" : "N";
      this.targetModel = [
        { text: "공개글", value: "Y" },
        { text: "비공개글", value: "N" },
      ];
    },
  },
};
</script>

<style></style>
