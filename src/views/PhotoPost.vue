<template>
  <div class="photo-wrapper container-fluid">
    <div class="row">
      <div
        class="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-2"
        v-for="post in postList"
        :key="post.seq"
      >
        <PhotoView :post="post" />
      </div>
    </div>
    <slot name="footer" />
  </div>
</template>

<script>
import PhotoView from "../components/PhotoView.vue";
export default {
  components: {
    PhotoView,
  },
  props: ["postList"],
};
</script>

<style></style>
