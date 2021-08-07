<template>
  <div>
    <h3>글쓰기 화면입니다.</h3>
    <EditForm :mode="false" :post="post" />
  </div>
</template>

<script>
import EditForm from "../components/EditForm.vue";
export default {
  components: { EditForm },
  data() {
    return {
      post: {
        seq: null,
        title: "",
        contents: "",
      },
    };
  },
};
</script>

<style></style>
