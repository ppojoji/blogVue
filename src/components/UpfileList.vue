<template>
  <div>
    <div class="upfile-info" v-if="files.length > 0">
      <span class="cnt">{{ files.length }}개</span>
      <span class="total-size">{{ totalSize }} bytes</span>
    </div>
    <div class="upfile-list" v-if="files.length > 0">
      <div class="file" v-for="upfile in files" :key="upfile[nameProp]">
        <span class="fname">{{ upfile[nameProp] }}</span>
        <span class="fsize">{{ upfile[sizeProp] }} BYTES</span>
        <button class="btn-close" @click="fileDelete(upfile)" v-if="editMode">
          X
        </button>
      </div>
    </div>
    <div class="upfile-list" v-else>{{ emptyMessage }}</div>
  </div>
</template>

<script>
/**
 * 첨부파일 뷰어
 *
 * @prop files
 * @prop nameProp
 * @prop sizeProp
 * @editMode
 * @emptyMessage
 * @event fileDelete - 삭제할 파일 element
 */
export default {
  props: ["files", "nameProp", "sizeProp", "editMode", "emptyMessage"],
  data() {
    return {};
  },
  methods: {
    fileDelete(file) {
      this.$emit("fileDelete", file);
    },
  },
  computed: {
    totalSize() {
      let size = 0;
      this.files.forEach((file) => {
        size += file[this.sizeProp];
      });
      return size;
    },
  },
};
</script>

<style lang="scss" scoped>
.upfile-info {
  padding: 6px 0;
  background-color: aliceblue;
  border-bottom: 1px solid #69a6d5;
  .cnt {
    margin: 12px;
  }
}
.upfile-list {
  background-color: aliceblue;
  .file {
    padding: 6px;
    .fname {
      margin-right: 20px;
    }
    .fsize {
      margin-right: 20px;
    }
    .btn-close {
      border: none;
      background: #ff6161;
      color: white;
      border-radius: 100px;
      font-size: 12px;
      padding: 4px 10px;
      &:hover {
        box-shadow: 1px 1px 4px #cccccc8d;
      }
      &:active {
        background: #812c2c;
      }
    }
    // .btn-close:hover {
    //   box-shadow: 1px 1px 4px #cccccc8d;
    // }
    // .btn-close:active {
    //   background: #812c2c;
    // }
  }
}
</style>
