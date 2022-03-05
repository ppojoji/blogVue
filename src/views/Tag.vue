<template>
  <div class="tag-wrapper">
    <h3>테그별 글 모음</h3>
    <p>{{ totalPosts }}</p>
    <div class="tag-cloud">
      <div
        class="tag"
        :class="tag.size"
        v-for="tag in tags"
        :key="tag.seq"
        @click="tagList(tag)"
      >
        {{ tag.tagName }}({{ tag.posts.length }})
      </div>
    </div>
    <div class="posts">
      <h3 v-if="activeTag">{{ activeTag.tagName }}</h3>
      <div
        class="post"
        v-for="post in posts"
        :key="post.seq"
        @click="popupPosts(post)"
      >
        {{ post.title }}
      </div>
      <div v-if="posts && posts.length === 0">관련 글이 없습니다.</div>
    </div>
    <PopupSlot v-if="activePost" @closePopup="closePopup()">
      <p>{{ activePost.contents }}</p>
    </PopupSlot>
    <!--
    <div class="valid tags">
      <div v-for="tag in validTags" :key="tag.seq">
        <h3>{{ tag.tagName }}</h3>
        <div v-for="post in tag.posts" :key="post.seq">
          {{ post.title }}
        </div>
      </div>
    </div>
    <div class="empty tags">
      <span v-for="empTag in emptyTags" :key="empTag.seq">{{
        empTag.tagName
      }}</span>
    </div>
    -->
  </div>
</template>

<script>
import api from "../service/api";
import PopupSlot from "../components/ui/PopupSlot.vue";
export default {
  components: { PopupSlot },
  data() {
    return {
      tags: null,
      validTags: null,
      emptyTags: null,
      totalPosts: 0,
      posts: null,
      activePost: null,
      activeTag: null,
    };
  },
  mounted() {
    api.tag.posts().then((res) => {
      console.log(res);
      this.tags = res.data;
      // A. 전체 글 갯수(분모값)를 구함
      let total = 0;
      for (let i = 0; i < this.tags.length; i++) {
        // reduce라는걸 이용할 수도 있음.
        total += this.tags[i].posts.length;
      }
      this.totalPosts = total; // 전체 글 갯수

      // 태그에 달린 글의 갯수의 내림차순
      this.tags.sort((ta, tb) => {
        /*
        1) 음수 ta(왼쪽)가 tb(오른쪽) 보다 먼저 나와야 함
        2) 0 ta와 tb 중에 뭐가 앞에 와도 상관없음 [..., tb, ..., ta, ]
        3) 양수 tb(오른쪽)가 ta(왼쪽) 보다 먼저 나와야 함
        */
        return -1 * (ta.posts.length - tb.posts.length); // 4, 2 = -2
      });

      // B. 상위 10%는 large로 사이즈를 정해줌
      const limit = Math.ceil(this.tags.length * 0.1);
      for (let i = 0; i < limit; i++) {
        this.tags[i].size = "large";
      }
      // C. 나머지는 small로 해줌
      for (let i = limit; i < this.tags.length; i++) {
        this.tags[i].size = "small";
      }

      // 1. 1개라도 있는 태그 필더링
      this.validTags = this.tags.filter((tag) => {
        return tag.posts.length > 0;
      });
      // 2. 0개인 태그 필터링
      this.emptyTags = this.tags.filter((tag) => {
        return tag.posts.length === 0;
      });
    });
  },
  methods: {
    TagOrder() {},
    tagList(tag) {
      api.post.findByTag(tag.seq).then((res) => {
        console.log(res);
        this.posts = res.data;
        this.activeTag = tag;
      });
    },
    popupPosts(post) {
      this.activePost = post;
    },
    closePopup() {
      this.activePost = null;
    },
  },
};
</script>

<style lang="scss">
.tag-wrapper {
  padding: 16px;
  .tag-cloud {
    display: flex;
    column-gap: 8px;
    flex-wrap: wrap;
    align-items: baseline;
    border-radius: 8px;
    padding: 8px;
    box-shadow: 0px 0px 4px 0px rgba(67, 71, 85, 0.27),
      0px 4px 16px 0px rgba(90, 125, 188, 0.05);
    .tag {
      font-size: 1rem; // 16px; 18px; 20px;
      &.small {
        font-size: 1rem;
      }
      &.medium {
        font-size: 1.2rem;
      }
      &.large {
        font-size: 1.5rem;
        font-weight: bold;
      }
    }
  }
}
</style>
