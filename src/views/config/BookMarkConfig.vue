<template>
  <div>
    <h3>북마크 편집 화면</h3>
    <PopupSlot v-if="popupVisible" @closePopup="popupClose()">
      <PostDetail :postSeq="postSeq" :hideControl="true" />
    </PopupSlot>
    <table class="table">
      <tr>
        <th>제목</th>
        <th>삭제</th>
        <th>북마크일</th>
      </tr>
      <tr v-for="bookmark in bookmarks" :key="bookmark.seq">
        <td @click="MyPost(bookmark.seq)">
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
        <td>{{ Diff(bookmark.bookMarkTime, currentTime) }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import api from "../../service/api";
import util from "../../service/util";
import PopupSlot from "../../components/ui/PopupSlot.vue";
import PostDetail from "../PostDetail.vue";

export default {
  components: { PopupSlot, PostDetail },
  data() {
    return {
      bookmarks: null,
      currentTime: new Date().getTime(),
      popupVisible: false,
      postSeq: null,
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
    Diff(time, current) {
      return util.timeDiff(time, current);
    },
    MyPost(postSeq) {
      this.postSeq = postSeq;
      this.popupVisible = true;
    },
    popupClose() {
      this.popupVisible = false;
    },
  },
};
</script>

<style></style>
