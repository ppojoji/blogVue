<template>
  <div class="toast-wrapper">
    <transition-group name="toast">
      <div
        class="message"
        :class="message.type"
        v-for="message in $store.state.toast.messages"
        v-bind:key="message.seq"
      >
        <span class="text">{{ message.text }}</span>
        <span
          class="close-icon material-icons-outlined"
          @click="deleteMessage(message)"
        >
          close
        </span>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  computed: {},
  mounted() {
    const messages = this.$store.state.toast.messages;
    console.log("[토스트 메세지] ", messages);
  },
  methods: {
    deleteMessage(msg) {
      //   console.log("지워야함", msg);
      this.$store.commit("deleteMessage", msg);
    },
  },
};
</script>

<style lang="scss">
.toast-enter {
  transform: translateX(-100%);
}
.toast-enter-active {
  transition: all 0.15s ease;
}
.toast-leave-active {
  transition: all 0.15s cubic-bezier(1, 0.5, 0.8, 1);
}
.toast-leave-to {
  transform: translateX(-100%);
}

.toast-wrapper {
  position: fixed;
  bottom: 0;
  padding: 16px;

  .message {
    margin-top: 8px;
    padding: 8px;
    border-radius: 8px;
    display: flex;
    align-items: center;

    &.success {
      background-color: #b6f7c4;
    }
    &.error {
      background-color: #ffb7b6;
    }
    &.info {
      background-color: #b2e6f5;
    }
    &.warning {
      background-color: #fbe7c6;
    }

    .text {
      flex: 1 1 auto;
    }
    .close-icon {
      cursor: pointer;
    }
  }
}
</style>
