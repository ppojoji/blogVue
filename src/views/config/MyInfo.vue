<template>
  <div class="my-info">
    <div class="update-row">
      <h3 class="update_title">프로필</h3>
      <div class="profile">
        <img
          :src="`${profileHost}/u/profile/${user.userpic}`"
          v-if="user.userpic"
        />
        <img src="../../assets/no-profile.png" v-else />
        <span class="material-icons-outlined edit" @click="ShowProfile()">
          edit
        </span>
      </div>

      <div class="ps_box" v-if="showVisible">
        <div class="custom-file">
          <input
            type="file"
            class="custom-file-input"
            id="profile"
            @change="profileChanged"
            accept="image/gif, image/jpeg, image/png"
          />
          <label class="custom-file-label" for="profile">Choose file</label>
        </div>
        <input
          type="button"
          class="form-control btn btn-primary btn-profile"
          value="업로드"
          @click="UpdateProfile"
        />
      </div>
    </div>
    <div class="update-row">
      <h4>{{ user.id }}</h4>
    </div>
    <div class="update-row">
      <h3>회원탈퇴</h3>
      <p>이메일 입력 후 탈퇴 버튼을 누르면 계정을 삭제합니다.</p>
      <div class="ps_box">
        <input
          type="text"
          class="form-control"
          placeholder="이메일 입력"
          v-model="email"
        />
        <input
          type="button"
          class="form-control btn btn-danger btn-profile"
          value="회원탈퇴"
          @click="deleteUser"
        />
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../service/api";
export default {
  computed: {
    // store 객체의 축약 필드를 맵핑해줌
    profileHost() {
      return process.env.VUE_APP_BACKEND_HOST;
    },
    user() {
      return this.$store.state.user.loginUser;
    },
  },
  data() {
    return {
      showVisible: false,
      profile: null,
      email: null,
    };
  },
  methods: {
    profileChanged(e) {
      this.profile = e.target.files[0];
    },
    ShowProfile() {
      this.showVisible = true;
    },
    UpdateProfile() {
      api.user.updateProfile(this.profile).then((res) => {
        console.log(res);
        this.$store.commit("updatePorfile", res.data.userpic);
      });
    },
    deleteUser() {
      api.user.deleteUser(this.email).then((res) => {
        console.log(res);
        this.$store.state.user.loginUser = null;
        this.$router.push({
          path: "/",
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.my-info {
  .profile {
    width: 128px;
    margin: 0 auto;
    position: relative;
    .edit {
      display: flex;
      position: absolute;
      right: 0px;
      bottom: 0px;
      border-radius: 50px;
      box-shadow: 2px 2px 8px #0000005d;
      padding: 4px;
      background-color: white;
      cursor: pointer;
    }
    img {
      width: 100%;
      height: auto;
      border-radius: 64px;
    }
  }
  .ps_box {
    max-width: 320px;
    margin: 0 auto;
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    row-gap: 8px;
  }
}
</style>
