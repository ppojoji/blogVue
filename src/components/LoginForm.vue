<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 naver-login-bar">
        <a href="#" id="login-link"
          ><img
            src="https://static.nid.naver.com/oauth/big_g.PNG?version=js-2.0.0"
            height="60"
        /></a>
      </div>
      <div class="col-12">
        <div id="error" class="alert alert-danger mt-3" v-if="error">
          여기에 오류 메세지 나옴
        </div>
        <form id="loginForm">
          <div class="form-group">
            <label for="id">아이디</label>
            <input
              type="text"
              class="form-control"
              id="id"
              v-model="id"
              @input="error = false"
            />
          </div>
          <div class="form-group">
            <label for="pwd">비밀번호</label>
            <input
              type="password"
              class="form-control"
              id="pwd"
              v-model="pwd"
              @input="error = false"
            />
          </div>
          <div class="form-group">
            <label>
              <input type="checkbox" id="useCookie" /> 로그인 유지
            </label>
          </div>
          <button type="button" class="btn btn-primary" @click="login">
            로그인
          </button>
          <a href="#" class="btn btn-primary btn-find-pass">비번 찾기</a>
        </form>
      </div>
      <!-- <div class="col-8">75%</div>
			<div class="col-3">25%</div>
			<div class="col-3">25%</div> -->
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      error: false,
      id: "",
      pwd: "",
    };
  },
  methods: {
    login() {
      let id = this.id;
      let pwd = this.pwd;

      const params = new URLSearchParams();
      params.append("id", id);
      params.append("pwd", pwd);
      params.append("useCookie", "false");
      axios
        .post("http://localhost:8888/blog/api/login", params, {
          withCredentials: true,
        })
        .then((res) => {
          //    let id = res.data.user.id;
          //    let pwd = res.data.user.pwd;
          //    let useCookie = res.data.user.useCookie;
          console.log(res);
          if (res.data.success === true) {
            console.log(res.data.user);
            this.$emit("loginSuccess", res.data.user);
          } else {
            this.error = true;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style></style>
