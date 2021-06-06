<!-- 微信用户登录 -->
<template>
  <div>
    <ae-base-dialog
        v-model="showRegister"
        :title="$t('player.register')"
        @close="closeDialog"
    >
      <ae-form ref="registerForm" v-model="register" :formConfig="registerFormConfig"></ae-form>
      <ae-button-list
          :buttonList="registerButton"
          :clickAction="[doRegister, cancelRegister]"
      ></ae-button-list>
    </ae-base-dialog>

    <ae-base-dialog
        :title="$t('player.userInfo')"
        v-model="showUserInfo"
        v-if="showUserInfo"
        @close="closeDialog"
    >
      <ae-form
          ref="userInfoForm"
          v-model="user"
          :edit="editAble"
          :formConfig="userInfoFormConfig"
      ></ae-form>
      <ae-button-list
          :buttonList="userInfoButton"
          :clickAction="[logout]"
      >
      </ae-button-list>
    </ae-base-dialog>
  </div>
</template>

<script>
  import { setUser, setToken } from "@/utils/authUtil";
  import { Login, Register } from "@/api";
  export default {
    name:"userInfoPage",
    props: {
      value: {
        type: Boolean,
        default: false,
      },
      register:{
        type:Object,
        default: null,
      }
    },
    data() {
      return {
        showUserInfo: false,
        showRegister: false,
        registerFormConfig: [
          {
            type: "input",
            key: "phone",
            des: this.$t("player.phone"),
            require: true,
            edit : false,
          },
          {
            type: "input",
            key: "user_name",
            des: this.$t("player.userName"),
            require: true,
          },
        ],
        userInfoFormConfig: [
          {
            type: "input",
            key: "user_name",
            des: this.$t("player.userName"),
            edit: false,
          },
        ],
        user: {},
        editAble: false,
        userInfoButton: [this.$t("player.logout")],
        registerButton: [this.$t("player.register"), this.$t("common.cancel")],
      };
    },
    methods: {
      closeDialog() {
        this.$emit("input", false);
        this.showRegister = false;
        this.showUserInfo = false;
      },

      logout() {
        this.$store.dispatch("logout");
        this.user.user_name = "";
        this.user.password = "";
        this.$appHelper.infoMsg(this.$t("player.logoutOk"));
        this.closeDialog();
      },

      doRegister() {
        let args = this.$refs.registerForm.getFormData();
        Register(args).then(({res_val}) => {
          let loginUser = {};
          loginUser.user_name = res_val.user_name;
          loginUser.password = res_val.password;
          loginUser.user_id = res_val.user_id;
          setUser(loginUser);
          let token = res_val.token;
          setToken(token);
          this.closeDialog();
          this.$appHelper.infoMsg(this.$t("player.loginOk"));
        });
      },
      cancelRegister() {
        this.closeDialog();
      },
      onDialogCreate(){
        console.log(
            "微信用户登录,",
            this.$store.getters.token,
            this.$store.getters.user
        );
        if (this.$store.getters.token && this.$store.getters.user) {
          this.user = this.$store.getters.user;
          this.showUserInfo = true;
          this.editAble = false;
        } else {
          this.showRegister = true;
        }
      }
    },
    watch: {
      value(v) {
        if (v) {
          this.onDialogCreate();
        }
      },
    },
    created() {
      this.$appHelper.bindPage2Global(this, "userInfoVue");
    },
  };
</script>

<style lang="scss" scope>
</style>
