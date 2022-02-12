<template>
  <div class="tags">
    <span class="tag" v-for="delTag in tags" :key="delTag.seq"
      >{{ delTag.tagName }}
      <span
        v-if="editable"
        class="close material-icons-outlined"
        @click="tagClosed(delTag)"
        >close</span
      >
    </span>
  </div>
</template>

<script>
export default {
  props: ["tags", "editable"], // :editable="{true}"
  methods: {
    tagClosed(tag) {
      this.$emit("tagclose", tag);
    },
  },
};
</script>

<style lang="scss">
.tags {
  display: flex;
  align-items: center;
  column-gap: 8px;
  .tag {
    background-color: aliceblue;
    padding: 4px 6px;
    border-radius: 10px;
    border: 1px solid #3fa5f1;
    display: inline-block;
  }
  .close {
    color: #df4512;
  }
}
</style>
