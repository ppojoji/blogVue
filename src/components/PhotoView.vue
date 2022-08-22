<template>
  <div class="photo">
    <div>
      <img :src="getImage()" />
    </div>
    <div class="desc">
      <span>{{ timeStampToDate(new Date(post.creationDate)) }}</span>
      <h4 @click="viewPost(post.seq)">{{ post.title }}</h4>
    </div>
  </div>
</template>

<script>
import util from "../service/util";
// https://picsum.photos/400/400
export default {
  props: ["post"],
  data() {
    return {
      //host: process.env.VUE_APP_BACKEND_HOST,
    };
  },
  methods: {
    timeStampToDate(date) {
      return util.formatDate(date);
    },
    viewPost(postSeq) {
      // 프로그래밍 방식으로 페이지 이동
      // ref: https://router.vuejs.org/kr/guide/essentials/dynamic-matching.html
      this.$router.push({
        path: "/article/" + postSeq,
      });
    },
    getImage() {
      const host = process.env.VUE_APP_BACKEND_HOST;
      console.log("[사진사진]", `${host}`);

      if (this.post.upFiles.length > 0) {
        //return `${process.env.VUE_APP_BACKEND_HOST}/upfile/${this.post.upFiles[0].genName}`;
        return `${host}/upfile/${this.post.upFiles[0].genName}`;
      } else {
        // IMPORTANT - JS에서 ASSET 경로 접근할때
        return require(`../assets/empty.jpg`);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.photo {
  border: 1px solid #dcd4d4;
  padding: 8px;
  img {
    width: 100%;
    height: auto;
  }
  .desc {
    span {
    }
    h4 {
    }
  }
}
</style>
