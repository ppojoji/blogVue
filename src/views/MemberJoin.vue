<template>
  <div class="join_content">
    <h1>회원가입</h1>
    <div class="row_group">
      <div class="join_row">
        <h3 class="join_title">아이디</h3>
        <span class="ps_box">
          <input
            class="int"
            :class="{ error: error.id, success: success.id }"
            v-model="signup.id"
            type="text"
            maxlength="20"
            @blur="propertyValid('id')"
          />
        </span>
        <span class="error_next_box" v-if="!idValid">필수 정보입니다.</span>
      </div>
      <div class="join_row">
        <h3 class="join_title">비밀번호</h3>
        <span class="ps_box">
          <input
            class="int"
            v-model="signup.pwd"
            type="password"
            maxlength="16"
            @blur="passwordValid"
          />
        </span>
        <span class="error_next_box" v-if="!passwordValidFlag"
          >유효하지 않은 비밀번호 입니다.</span
        >
        <h3 class="join_title">비밀번호 재확인</h3>
        <span class="ps_box">
          <input
            class="int"
            v-model="passwordCheck"
            type="password"
            maxlength="16"
            @blur="passwordCheckValid"
          />
        </span>
        <span class="error_next_box" v-if="!passwordCheckFlag"
          >비밀번호가 동일하지 않습니다.</span
        >
        <h3 class="join_title">비밀번호 힌트</h3>
        <select class="sel" v-model="signup.pwhint" size="1">
          <option value="">선택하세요</option>
          <option v-for="pwhintList in pwhintLists" :key="pwhintList.value">
            {{ pwhintList.text }}
          </option>
        </select>
        <h3 class="join_title">답변</h3>
        <span class="ps_box">
          <input class="int" v-model="signup.pwhintans" />
        </span>
      </div>
      <div class="join_row">
        <h3 class="join_title">이메일</h3>
        <span class="ps_box">
          <input
            class="int"
            :class="{ error: error.emailId, success: success.emailId }"
            v-model="signup.emailId"
            type="text"
            maxlength="20"
            @blur="propertyValid('emailId')"
          />
        </span>
        <select
          name="emailaddr"
          v-model="signup.domain"
          @change="propertyValid('domain')"
        >
          <option value="">직접입력</option>
          <option value="daum.net">daum.net</option>
          <option value="gmail.com">gmail.com</option>
          <option value="msn.com">msn.com</option>
          <option value="naver.com">naver.com</option>
          <option value="nate.com">nate.com</option>
        </select>
        <span class="error_next_box" v-if="!idValid">필수 정보입니다.</span>
      </div>
    </div>

    <div class="btn_area">
      <button class="btn btn-primary" @click="join">회원가입</button>
      <button class="btn btn-danger">취소</button>
    </div>
  </div>
</template>

<script>
import toast from "../components/ui/toast";
import api from "../service/api";
export default {
  data() {
    return {
      signup: {
        // id: {value: null, error: false, success: false},
        id: null,
        pwd: null,
        pwhint: "",
        pwhintans: null,
        emailId: null,
        domain: "",
      },
      error: {
        id: false,
        pwd: false,
        emailId: false,
      },
      success: {
        id: false,
        pwd: false,
        emailId: false,
      },
      passwordCheck: null,
      pwhintLists: [
        {
          value: 1,
          text: "졸업한 초등학교 이름은?",
        },
        {
          value: 2,
          text: "아버지 성함은?",
        },
        {
          value: 3,
          text: "어머니 성함은?",
        },
        {
          value: 4,
          text: "어릴 적 내 별명은?",
        },
        {
          value: 5,
          text: "좋아하는 색깔은?",
        },
      ],
      passwordValidFlag: true,
      passwordCheckFlag: true,
    };
  },
  computed: {
    idValid() {
      return /^[a-z0-9]+$/.test(this.signup.id);
    },
    email() {
      return this.signup.emailId + "@" + this.signup.domain;
    },
  },
  methods: {
    // 비밀번호 유효성 체크
    passwordValid() {
      if (/^(?=.*[a-z])(?=.*[0-9]).{6,12}$/.test(this.signup.pwd)) {
        this.passwordValidFlag = true;
      } else {
        this.passwordValidFlag = false;
      }
    },
    // 비밀번호 동일 여부 체크
    passwordCheckValid() {
      if (this.signup.pwd === this.passwordCheck) {
        this.passwordCheckFlag = true;
      } else {
        this.passwordCheckFlag = false;
      }
    },
    join() {
      this.signup.email = this.email;
      if (!this.signup.pwhint) {
        toast.error("힌트를 선택해 주세요", 3000);
        return;
      }
      if (!this.signup.pwhintans) {
        toast.error("답변을 입력해 주세요", 3000);
        return;
      }
      api.user.join(this.signup).then((res) => {
        console.log("[회원가입]", res);
      });
    },
    propertyValid(prop) {
      // "email"
      // "id"
      // .checkProp("id", this.signup.id)

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
          // if (prop === "id") {
          // } else if (prop === "email") {
          //   this.error.emailId = true;
          //   this.success.emailId = false;
          // }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.error {
  background-color: rgba(255, 184, 198, 0.439);
}
.success {
  background-color: rgba(208, 255, 173, 0.499);
}
</style>
