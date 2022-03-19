<template>
  <div
    class="tags"
    :class="{ inline: inline, sm: size === 'sm', lg: size === 'lg' }"
  >
    <span
      class="tag"
      v-for="delTag in tags"
      :key="delTag.seq"
      @click="tagSelected(delTag)"
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
  /**
   size: ['sm'|'md'|'lg'] 태그의 크기
   */
  props: ["tags", "editable", "inline", "size"], // :editable="{true}"
  methods: {
    tagClosed(tag) {
      this.$emit("tagclose", tag);
    },
    tagSelected(tag) {
      this.$emit("tagSelected", tag);
    },
  },
};
</script>

<style lang="scss" scoped>
.tags {
  display: flex;
  align-items: center;
  column-gap: 8px;
  &.sm {
    font-size: 12px;
  }
  &.lg {
    font-size: 20px;
  }
  &.inline {
    display: inline-flex;
  }
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
