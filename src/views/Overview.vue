<template>
  <div>
    <div class="cate-list container-fluid">
      <div class="row notice">
        <div class="col-box col-12">
          <div class="cate-box" v-if="notice">
            <h4 class="title">
              <router-link :to="`/posts/${notice.cate.name}`"
                >공지 사항
              </router-link>
            </h4>
            <template v-if="notice.posts.length > 0">
              <div
                class="post-list"
                v-for="post in notice.posts"
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
      <div class="row">
        <div class="col-12"><h3>최근 글들</h3></div>
        <div
          class="col-box col-12 col-sm-6 col-md-4 col-lg-3"
          v-for="overview in overviews"
          :key="overview.cate.seq"
        >
          <div class="cate-box">
            <h4 class="title">
              <router-link :to="`/posts/${overview.cate.name}`"
                >{{ overview.cate.name }}
              </router-link>
            </h4>
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
    <div class="floating-nav">
      <button @click="write">
        <span class="material-icons-outlined">add</span>
      </button>
    </div>
  </div>
</template>

<script>
import api from "../service/api";
export default {
  data() {
    return {
      notice: null,
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
        const idx = res.data.overviews.findIndex((overview) => {
          return overview.cate.type === "NC";
        });
        if (idx >= 0) {
          this.notice = res.data.overviews[idx];
          res.data.overviews.splice(idx, 1);
        }

        this.overviews = res.data.overviews;
      }
    });
  },
  methods: {
    write() {
      this.$router.push({ path: "/write", query: { cate: "" } });
    },
  },
};
</script>

<style lang="scss" scoped>
.col-box {
  margin-bottom: 15px;
  .cate-box {
    border: 1px solid #cccccc;
    height: 100%;
    border-radius: 5px;
    padding: 8px;
  }
}
.floating-nav {
  position: fixed;
  right: 16px;
  bottom: 16px;
  > button {
    outline: none;
    background-color: #f756bd;
    display: flex;
    padding: 8px;
    border-radius: 40px;
    border: none;
    color: white;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px,
      rgba(0, 0, 0, 0.22) 0px 10px 10px;
    &:active {
      background-color: #9c2370;
      transform: translate(2px, 2px);
    }
  }
}
</style>
