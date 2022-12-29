<template>
  <div>
    <input type="button" class="btn-profile" />
    <div class="update_row">
      <h3 class="update_title">아이디</h3>
      <span class="ps_box">
        <input class="int form-control" type="text" />
      </span>
    </div>
    <div class="update_row">
      <h3 class="update_title">비밀번호</h3>
      <span class="ps_box">
        <input class="int form-control" type="text" />
      </span>
    </div>
    <div class="update_row">
      <h3 class="update_title">이메일</h3>
      <span class="ps_box">
        <input class="int form-control" type="text" />
      </span>
      <div class="error-box" v-if="passwordError.cnt > 0">
        <div v-if="passwordError.num" class="error-msg">숫자가 필요합니다.</div>
        <div v-if="passwordError.char" class="error-msg">
          영문자가 필요합니다.
        </div>
        <div v-if="passwordError.size" class="error-msg">
          6글자 이상 필요합니다.
        </div>
      </div>
    </div>
    <div class="update_row">
      <h3 class="update_title">비밀번호 재확인</h3>
      <span class="ps_box">
        <input class="int form-control" type="password" />
      </span>
      <span class="error_next_box form-control" v-if="!passwordCheckFlag"
        >비밀번호가 동일하지 않습니다.</span
      >
    </div>
    <div class="update_row">
      <h3 class="update_title">이메일</h3>
      <span class="ps_box">
        <input class="int form-control" type="text" />
      </span>
      <select name="emailaddr" @change="propertyValid('domain')">
        <option value="">직접입력</option>
        <option value="@daum.net">daum.net</option>
        <option value="@gmail.com">gmail.com</option>
        <option value="@msn.com">msn.com</option>
        <option value="@naver.com">naver.com</option>
        <option value="@nate.com">nate.com</option>
      </select>
      <span class="error_next_box" v-if="!idValid">필수 정보입니다.</span>
    </div>
  </div>
</template>

<script>
//import toast from "../components/ui/toast";
import api from "../service/api";
export default {
  data() {
    return {};
  },
  computed: {},
  methods: {
    propertyValid(prop) {
      const req = {
        prop,
        value: null,
      };
      if (prop === "emailId" || prop === "domain") {
        req.prop = "email";
        req.value = this.email;
      } else {
        req.value = this.signup[prop];
      }
      api.user
        .checkProp(req.prop, req.value)
        .then((res) => {
          console.log(res);
          this.error[prop] = false;
          this.success[prop] = true;
        })
        .catch((e) => {
          console.log(e);
          this.error[prop] = true;
          this.success[prop] = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
