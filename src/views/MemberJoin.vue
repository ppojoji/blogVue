<template>
  <div class="join_content">
    <div class="row_group">
      <h1>회원가입</h1>
      <div class="join_row">
        <h3 class="join_title">아이디</h3>
        <span class="ps_box">
          <input
            class="int form-control"
            :class="{ error: error.id, success: success.id }"
            v-model="signup.id"
            type="text"
            maxlength="20"
            @blur="validateId()"
          />
        </span>
        <div class="error-box" v-if="idError.cnt > 0">
          <div v-if="idError.size" class="error-msg">
            4글자 이상이어야 합니다.
          </div>
          <div v-if="idError.dup" class="error-msg">중복된 아이디입니다.</div>
        </div>
      </div>
      <div class="join_row">
        <h3 class="join_title">비밀번호</h3>
        <span class="ps_box">
          <input
            class="int form-control"
            v-model="signup.pwd"
            type="password"
            maxlength="16"
            @input="resetPassword"
            @blur="passwordValid"
          />
        </span>
        <div class="error-box" v-if="passwordError.cnt > 0">
          <div v-if="passwordError.num" class="error-msg">
            숫자가 필요합니다.
          </div>
          <div v-if="passwordError.char" class="error-msg">
            영문자가 필요합니다.
          </div>
          <div v-if="passwordError.size" class="error-msg">
            6글자 이상 필요합니다.
          </div>
        </div>
      </div>
      <div class="join_row">
        <h3 class="join_title">비밀번호 재확인</h3>
        <span class="ps_box">
          <input
            class="int form-control"
            v-model="passwordCheck"
            type="password"
            maxlength="16"
            @blur="passwordCheckValid"
          />
        </span>
        <span class="error_next_box form-control" v-if="!passwordCheckFlag"
          >비밀번호가 동일하지 않습니다.</span
        >
      </div>
      <div class="join_row">
        <h3 class="join_title">비밀번호 힌트</h3>
        <select class="sel form-control" v-model="signup.pwhint" size="1">
          <option value="">선택하세요</option>
          <option v-for="pwhintList in pwhintLists" :key="pwhintList.value">
            {{ pwhintList.text }}
          </option>
        </select>
      </div>
      <div class="join_row">
        <h3 class="join_title">답변</h3>
        <span class="ps_box">
          <input class="int form-control" v-model="signup.pwhintans" />
        </span>
      </div>
      <div class="join_row">
        <h3 class="join_title">이메일</h3>
        <span class="ps_box">
          <input
            class="int form-control"
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
          <option value="@daum.net">daum.net</option>
          <option value="@gmail.com">gmail.com</option>
          <option value="@msn.com">msn.com</option>
          <option value="@naver.com">naver.com</option>
          <option value="@nate.com">nate.com</option>
        </select>
        <span class="error_next_box" v-if="!idValid">필수 정보입니다.</span>
      </div>

      <div class="join_row">
        <h3 class="join_title">프로필 사진</h3>
        <input
          type="file"
          name="files"
          id="file"
          @change="attacheFile"
          accept=".txt, .gif, .jpg, .png"
        />
      </div>
      <div class="join_row">
        <div class="btn_area">
          <!-- <button
            class="btn btn-primary"
            @click="join"
            :disabled="!passwordValidFlag || !passwordCheckFlag"
          > -->
          <button
            class="btn btn-primary"
            @click="join"
            :disabled="error.id || error.pwd || error.emailId"
          >
            회원가입
          </button>
          <button class="btn btn-danger">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import toast from "../components/ui/toast";
import api from "../service/api";
export default {
  data() {
    return {
      upfiles: [],
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
      passwordError: {
        cnt: 0,
        size: false,
        num: false,
        char: false,
      },
      idError: {
        cnt: 0,
        size: false,
        dup: false,
      },
      passwordCheckFlag: true,
    };
  },
  computed: {
    idValid() {
      return /^[a-z0-9]+$/.test(this.signup.id);
    },
    email() {
      return this.signup.emailId + this.signup.domain;
    },
  },
  methods: {
    attacheFile(e) {
      console.log(e.target.files);
      const file = e.target.files[0];

      const reader = new FileReader(); // (1)
      reader.addEventListener("load", () => {
        // (3)
        const src = reader.result;
        file.src = src;
        this.upfiles.push(file);

        // (4) 편집 상태에서는 첨부된 파일을 서버로 보내서 업로드해버림!
        if (this.editMode) {
          api.post.uploadFile(this.post.seq, file).then(() => {});
        }
      });
      reader.readAsDataURL(file); // (2)

      e.target.value = ""; // input file 초기화 하는 꼼수
      // this.totalSize += e.target.files[0].size;
    },
    validateId() {
      this.idError.cnt = 0;
      this.idError.size = false;
      this.idError.dup = false;

      if (this.signup.id.length < 4) {
        this.idError.cnt = 1;
        this.idError.size = true;
        this.syncState(); //
        this.error.id = true;
        this.success.id = false;
        return;
      }

      api.user
        .checkProp("id", this.signup.id)
        .then((res) => {
          console.log(res);
          // if(this.idError.cnt > 0){}
          this.syncState();
          this.error["id"] = false;
          this.success["id"] = true;
        })
        .catch((e) => {
          console.log(e);
          this.idError.dup = true;
          this.idError.cnt++;
          this.syncState();

          this.error.id = true;
          this.success.id = false;
          // if (prop === "id") {
          // } else if (prop === "email") {
          //   this.error.emailId = true;
          //   this.success.emailId = false;
          // }
        });
    },
    // 비밀번호 유효성 체크
    passwordValid() {
      // 영문자 있는지 정규표현식
      // 숫자가 있는지 정규표현식
      // 전체 길이 확인하는 코드
      this.resetPassword();
      console.log("[PWD]", this.signup.pwd);
      if (!/[0-9]/.test(this.signup.pwd)) {
        this.passwordError.num = true;
        this.passwordError.cnt++;
      }
      if (!/[a-zA-Z]/.test(this.signup.pwd)) {
        this.passwordError.char = true;
        this.passwordError.cnt++;
      }
      if (this.signup.pwd.length < 6) {
        this.passwordError.size = true;
        this.passwordError.cnt++;
      }
      if (this.passwordError.cnt > 0) {
        this.error.pwd = true;
      } else {
        this.error.pwd = false;
      }
    },

    resetPassword() {
      console.log("!!");
      this.passwordError.cnt = 0;
      this.passwordError.num = false;
      this.passwordError.char = false;
      this.passwordError.size = false;
    },
    // 비밀번호 동일 여부 체크
    passwordCheckValid() {
      if (this.signup.pwd === this.passwordCheck) {
        this.passwordCheckFlag = true;
      } else {
        this.passwordCheckFlag = false;
      }
      this.error.pwd = !this.passwordCheckFlag;
      // this.passwordCnt();
    },
    syncState() {
      // idError, passWordError
      // this.error.id = true | false
      // this.error.pwd = true | false
      //
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
        toast.success("가입완료 되었습니다.", 3000);
        this.$router.push({
          path: "/login",
        });
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
.join_content {
  .row_group {
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .join_row {
      width: 100%;
      margin-bottom: 16px;
      h3 {
        font-family: "Nanum Gothic", sans-serif;
        font-size: 1.25rem;
        font-weight: 400;
        margin-bottom: 4px;
      }
      .error-box {
        background-color: #ffe5cf;
        padding: 8px;
        font-size: 0.8rem;
        .error-msg {
          color: red;
        }
      }
    }
  }
  @media screen and (min-width: 580px) {
    .row_group {
      width: 480px;
      margin: auto;
    }
  }
}
</style>
