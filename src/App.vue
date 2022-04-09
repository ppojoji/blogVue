<template>
  <div id="app">
    <Nav></Nav>
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/login">login</router-link>
    </div> -->
    <router-view />
    <Toast />
    <Splash v-if="!$store.state.user.appReady" />
  </div>
</template>
<script>
import Nav from "./views/Nav.vue";
import Toast from "./components/ui/toast/ToastUI.vue";
import Splash from "./components/Splash.vue";

export default {
  components: {
    Nav,
    Toast,
    Splash,
  },
};
</script>
<style lang="scss">
html,
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
