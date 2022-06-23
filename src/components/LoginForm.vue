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
              v-on:keyup.enter="login"
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
          <a href="#" class="btn btn-primary btn-find-pass" @click="ShowOpenPwd"
            >비번 찾기</a
          >
        </form>
        <PopupSlot v-if="PwdPopVisable" @closePopup="closePopup()">
          <div class="error" v-if="hintErr">{{ hintErr }}</div>

          <div class="hint-data" v-if="hintData">
            <ul>
              <li>id : {{ hintData.id }}</li>
              <li>password: {{ hintData.pwd }}</li>
            </ul>
          </div>
          <Find @hint="hint" v-else></Find>

          <button @click="closePopup()">닫기</button>
        </PopupSlot>
      </div>
      <!-- <div class="col-8">75%</div>
			<div class="col-3">25%</div>
			<div class="col-3">25%</div> -->
    </div>
  </div>
</template>

<script>
import axios from "axios";
import toast from "./ui/toast";
import PopupSlot from "../components/ui/PopupSlot.vue";
import Find from "../components/ui/Find.vue";
import api from "../service/api";

export default {
  components: { PopupSlot, Find },
  data() {
    return {
      error: false,
      id: "",
      pwd: "",
      PwdPopVisable: false,
      hintErr: null,
      hintData: null,
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
        .post(process.env.VUE_APP_BACKEND_HOST + "/api/login", params, {
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
            toast.success("안녕하세요", 3000);
          } else {
            // this.$store.commit("addMessage", {
            //   text: "로그인 실패",
            //   type: "error",
            //   duration: 3000,
            // });
            toast.error("로그인 실패", -1);
            this.error = true;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    ShowOpenPwd() {
      this.PwdPopVisable = true;
    },
    closePopup() {
      this.PwdPopVisable = null;
    },
    hint(evt) {
      console.log("[HINT]", evt);
      api.user
        .hint(evt)
        .then((res) => {
          console.log(res);
          this.hintData = { id: res.data.id, pwd: res.data.pwd };
        })
        .catch((e) => {
          console.log(e);
          this.hintErr = e.response.data.cause;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.error {
  color: red;
  margin-bottom: 8px;
}
</style>
