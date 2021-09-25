<template>
  <div>
    <div>메인 화면</div>
    <div class="cate-list container-fluid">
      <div class="row">
        <div
          class="col-12 col-sm-6 col-md-4 col-lg-3"
          v-for="overview in overviews"
          :key="overview.cate.seq"
        >
          <div class="cate-box">
            <h4 class="title">{{ overview.cate.name }}</h4>
            <template v-if="overview.posts.length > 0">
              <div
                class="post-list"
                v-for="post in overview.posts"
                :key="post.seq"
              >
                <div class="post">
                  <router-link :to="'/article/' + post.seq"
                    ><span class="title">{{ post.title }}</span></router-link
                  >
                </div>
              </div>
            </template>
            <div v-else>글이 없습니다.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../service/api";
export default {
  data() {
    return {
      overviews: [],
      /*
      overviews: [
        {
          cate: { seq: 1, name: "vue" },
          posts: [
            { seq: 30, title: "갱신 시간이 업데이트 되지 않음" },
            { seq: 31, title: "ddasfd" },
            { seq: 32, title: "gdd" },
          ],
        },
        {
          cate: { seq: 2, name: "java" },
          posts: [
            { seq: 35, title: "나와라" },
            { seq: 36, title: "하하하 " },
            { seq: 37, title: "자바 강좌" },
          ],
        },
        {
          cate: { seq: 3, name: "svelte" },
          posts: [
            { seq: 45, title: "svelte 나와라" },
            { seq: 56, title: "svelte" },
            { seq: 77, title: "svelte 다" },
          ],
        },
      ],*/
    };
  },
  mounted() {
    api.post.overviews().then((res) => {
      console.log(res);
      if (res.data.success) {
        this.overviews = res.data.overviews;
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.cate-box {
  border: 1px solid #cccccc;
  /* margin: 4px; */
  border-radius: 5px;
  padding: 8px;
}
</style>
