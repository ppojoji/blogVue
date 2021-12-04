<template>
  <div>
    <h4>관리자 페이지</h4>
    <table class="table">
      <tbody>
        <tr>
          <th>제목</th>
          <th>날짜</th>
          <th>삭제</th>
        </tr>
        <tr v-for="delY in delPosts" :key="delY.seq">
          <td>({{ delY.seq }}){{ delY.title }}</td>
          <td>{{ delY.creationDate }}</td>
          <td>
            <button class="btn btn-danger" @click="DelPost(delY)">삭제</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/export
import { admin } from "../../service/api";
export default {
  data() {
    return {
      delPosts: null,
    };
  },
  mounted() {
    admin.post.delY().then((res) => {
      console.log(res);
      this.delPosts = res.data.posts;
    });
  },
  methods: {
    DelPost(post) {
      admin.post.delete(post.seq).then((res) => {
        console.log(res);
        let idx = this.delPosts.findIndex((del) => del.seq === post.seq);
        this.delPosts.splice(idx, 1);
      });
    },
  },
};
</script>

<style></style>
