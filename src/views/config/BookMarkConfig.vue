<template>
  <div>
    <h3>북마크 편집 화면</h3>

    <table class="table">
      <tr>
        <th>제목</th>
        <th>삭제</th>
      </tr>
      <tr v-for="bookmark in bookmarks" :key="bookmark.seq">
        <td>
          {{ bookmark.title }}
        </td>
        <td v-if="bookmark.bookmarked">
          <button class="btn btn-danger" @click="removeBookMark(bookmark)">
            삭제
          </button>
        </td>
        <td v-else>
          <button class="btn btn-primary" @click="addBookMark(bookmark)">
            등록
          </button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import api from "../../service/api";
export default {
  data() {
    return {
      bookmarks: null,
    };
  },
  mounted() {
    api.bookMark.loadBookMark().then((res) => {
      console.log(res);
      this.bookmarks = res.data;
    });
  },
  methods: {
    removeBookMark(bookmark) {
      api.bookMark.removeBookMark(bookmark.seq).then((res) => {
        console.log(res);
        bookmark.bookmarked = false;
      });
    },
    addBookMark(bookmark) {
      api.bookMark.bookMark(bookmark.seq).then((res) => {
        console.log(res);
        bookmark.bookmarked = true;
      });
    },
  },
};
</script>

<style></style>
