<template>
  <div>
    <div class="success" v-if="user">로그인 성공 ({{ user.email }})</div>
    <LoginForm @loginSuccess="login" v-else></LoginForm>
  </div>
</template>

<script>
import LoginForm from "@/components/LoginForm.vue";
export default {
  data() {
    return {
      user: null,
    };
  },
  methods: {
    login(user) {
      console.log("[로그인] ", user);
      this.user = user;
      // 이렇게 곧바로 assign 하면 디버그하기 힘든 단점이 있습니다.
      this.$store.state.user.loginUser = user;
    },
  },
  components: {
    LoginForm,
  },
};
</script>

<style></style>
