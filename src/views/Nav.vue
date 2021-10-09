<template>
  <div id="blog-header">
    <h3>개인 블로그</h3>
    <div class="menu">
      <router-link class="menu-item" to="/">HOME</router-link>
      <!-- <router-link class="menu-item" to="/logout" v-if="$store.state.loginUser"
        >LOGOUT</router-link
      > -->
      <a
        href="#"
        class="menu-item"
        v-if="$store.state.loginUser"
        @click="logout"
        >LOGOUT</a
      >
      <router-link class="menu-item" to="/login" v-else>LOGIN</router-link>
      <router-link class="menu-item" to="/me" v-if="user">{{
        user.email
      }}</router-link>
    </div>
  </div>
</template>

<script>
import api from "../service/api";
export default {
  // data() {
  //   return {
  //     user: null
  //   }
  // }
  computed: {
    // store 객체의 축약 필드를 맵핑해줌
    user() {
      return this.$store.state.user.loginUser;
    },
  },
  methods: {
    logout() {
      console.log(this.$store);
      api.user.logout();
      this.$store.state.loginUser = null;
    },
  },
};
</script>

<style>
#blog-header {
  margin: 0;
  padding-top: 2em;
  padding-bottom: 2em;
  text-align: center;
  /* height: 200px; */
  background-color: #cddc39;
  box-shadow: 1px 1px 8px #ccc;
}
</style>
