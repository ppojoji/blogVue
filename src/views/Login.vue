<template>
  <div>
    <div class="success" v-if="user">로그인 성공 ({{ user.email }})</div>
    <LoginForm @loginSuccess="login" v-else></LoginForm>
  </div>
</template>

<script>
import LoginForm from "@/components/LoginForm.vue";
export default {
  methods: {
    login(user) {
      // this.user = user;
      // 이렇게 곧바로 assign 하면 디버그하기 힘든 단점이 있습니다.
      this.$store.state.user.loginUser = user;
      //
      console.log("[로그인] ", user, this.$route);
      const nextUrl = this.$route.query.redirect || "/";
      this.$router.replace({ path: nextUrl });

      /*
      if (this.$route.query.redirect) {
        this.$router.push({ path: this.$route.query.redirect });
      } else {
        this.$router.push({ path: "/" });
      }
      */
    },
  },
  computed: {
    user() {
      return this.$store.state.user.loginUser;
    },
  },
  watch: {
    user(cur, prev) {
      console.log("[바꼈다]", cur, prev);
      const nextUrl = this.$route.query.redirect || "/";
      this.$router.push({ path: nextUrl });
    },
  },
  components: {
    LoginForm,
  },
};
</script>

<style></style>
