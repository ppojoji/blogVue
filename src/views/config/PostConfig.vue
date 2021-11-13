<template>
  <div>
    <h3>내글 편집 화면</h3>
    <Search />
    <RadioPopup
      v-if="editPost"
      :initValue="initValue"
      @closePopup="editPost = null"
      :models="targetModel"
      @updateUseYn="updateUseYn"
    />
    <table class="table">
      <tr>
        <th>제목</th>
        <th>상태</th>
        <th>삭제</th>
        <th>이동</th>
      </tr>
      <tr v-for="post in lists" :key="post.seq">
        <td>
          {{ post.title }}
        </td>
        <td>
          <a class="" @click="EditPost(post)">
            <span v-if="post.open" class="open material-icons-outlined">
              remove_red_eye
            </span>

            <span v-else class="hidden material-icons-outlined">
              visibility_off
            </span>
          </a>
        </td>
        <td>
          <button class="btn btn-danger" @click="deletePost(post)">삭제</button>
        </td>
        <td>
          <select @change="replaceCate(post, $event)">
            <option value="0">없음</option>
            <option
              v-for="cate in cates"
              :key="cate.seq"
              :value="cate.seq"
              :selected="post.category && post.category.seq === cate.seq"
            >
              {{ cate.name }}
            </option>
          </select>
        </td>
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
      targetProp: null,
      targetModel: null,
      cates: null,
    };
  },
  mounted() {
    api.post.allForAdmin().then((res) => {
      console.log(res);
      this.lists = res.data.posts;
    });
    this.cateList();
  },
  methods: {
    EditPost(post) {
      this.editPost = post;
      this.initValue = post.open ? "Y" : "N";
      this.targetModel = [
        { text: "공개글", value: "Y" },
        { text: "비공개글", value: "N" },
      ];
    },
    updateUseYn(selected) {
      console.log("선택된 값", selected);
      api.post.updateProp(this.editPost.seq, "open", selected).then((res) => {
        console.log("[res]", res);
        this.editPost.open = selected === "Y";
        this.editPost = selected;
        this.editPost = null;
      });
    },
    deletePost(post) {
      api.post.remove(post.seq).then(() => {
        //console.log(s);
        const idx = this.lists.findIndex((d) => d.seq === post.seq);
        this.lists.splice(idx, 1);
      });
    },
    cateList() {
      api.cate.all().then((res) => {
        console.log(res);
        this.cates = res.data.cates;
      });
    },
    replaceCate(post, e) {
      const cateSeq = e.target.value;
      api.post.updateProp(post.seq, "category", cateSeq);
    },
  },
};
</script>

<style lang="scss" scoped>
span.hidden {
  color: #ea5f30;
}
span.open {
  color: #2cbc1e;
}
</style>
