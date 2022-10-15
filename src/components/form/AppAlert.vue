<template>
  <PopupSlot>
    <div class="message">{{ message }}</div>
    <div class="footer">
      <button @click="ok()">OK</button>
      <button @click="no()">NO</button>
    </div>
  </PopupSlot>
</template>

<script>
import PopupSlot from "../ui/PopupSlot.vue";
export default {
  components: { PopupSlot },
  props: ["message"],
  //this.$emit
  data() {
    return {};
  },
  methods: {
    ok() {
      this.$emit("confirm", true);
    },
    no() {
      this.$emit("confirm", false);
    },
  },
};
</script>

<style></style>
