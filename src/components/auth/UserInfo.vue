<!-- H5用户登录 -->
<template>
  <div>
    <ae-base-dialog
      v-if="showLogin"
      v-model="showLogin"
      :title="$t('p.login')"
      @close="closeLoginDialog"
    >
      <ae-form ref="loginForm" :formConfig="formConfig"></ae-form>
      <ae-button-list
        :buttonList="loginButton"
        :clickAction="[getOldPassword, register, doLogin]"
      ></ae-button-list>
    </ae-base-dialog>

    <ae-base-dialog
      v-model="showRegister"
      :title="$t('p.register')"
      @close="closeLoginDialog"
    >
      <ae-form ref="registerForm" :formConfig="registerFormConfig"></ae-form>
      <ae-button-list
        :buttonList="registerButton"
        :clickAction="[doRegister, cancelRegistr]"
      ></ae-button-list>
    </ae-base-dialog>

    <ae-base-dialog
      :title="$t('p.userInfo')"
      v-model="showUserInfo"
      v-if="showUserInfo"
      @close="closeLoginDialog"
    >
      <ae-form
        ref="userInfoForm"
        v-model="user"
        :edit="editAble"
        :formConfig="userInfoFormConfig"
      ></ae-form>
      <ae-button-list
        :buttonList="userInfoButton"
        :clickAction="[changeUserPwdShow, logout]"
      >
      </ae-button-list>
    </ae-base-dialog>

    <ae-base-dialog
      :title="$t('p.changePwd')"
      v-model="showChangePwd"
      v-if="showChangePwd"
      @close="closeLoginDialog"
    >
      <ae-form
        v-if="showChangePwd"
        ref="changePwdForm"
        :formConfig="changePwdFormConfig"
      ></ae-form>
      <ae-button-list
        :buttonList="changePwdButton"
        :clickAction="[changePwd, cancelChangePwd]"
      >
      </ae-button-list>
    </ae-base-dialog>
  </div>
</template>

<script>
import { setUser, setToken } from "@/utils/authUtil";
import { Login, Register, ChangePwd } from "@/api";
export default {
  name:"userInfoPage",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showLogin: false,
      showUserInfo: false,
      showRegister: false,
      formConfig: [
        {
          type: "input",
          key: "user_name",
          des: this.$t("p.nameOrMail")
        },
        {
          type: "input",
          key: "password",
          des: this.$t("p.password"),
         style: "password",
        },
      ],
      registerFormConfig: [
        {
          type: "input",
          key: "email",
          des: this.$t("p.email"),
          require: true,
        },
        {
          type: "input",
          key: "user_name",
          des: this.$t("p.userName"),
          require: true,
        },
        {
          type: "input",
          key: "password",
          des: this.$t("p.password"),
         style: "password",
          require: true,
        },
        {
          type: "input",
          key: "re_password",
          des: this.$t("p.rePassword"),
         style: "password",
          require: true,
        },
      ],
      userInfoFormConfig: [
        {
          type: "input",
          key: "user_name",
          des: this.$t("p.userName"),
          edit: false,
        },
      ],
      changePwdFormConfig: [
        {
          type: "input",
          key: "old_password",
          des: this.$t("p.oldPwd"),
          style: "password",
          require: true,
        },
        {
          type: "input",
          key: "new_password",
          des: this.$t("p.newPwd"),
         style: "password",
          require: true,
        },
        {
          type: "input",
          key: "sure_password",
          des: this.$t("p.rePassword"),
         style: "password",
          require: true,
        },
      ],
      user: {},
      showChangePwd: false,
      editAble: false,
      loginButton: [this.$t("p.findPwd"), this.$t("p.register"), this.$t("p.login")],
      userInfoButton: [this.$t("p.changePwd"), this.$t("p.logout")],
      changePwdButton: [this.$t("c.change"), this.$t("c.cancel")],
      registerButton: [this.$t("p.register"), this.$t("c.cancel")],
    };
  },
  methods: {
    closeLoginDialog() {
      this.$emit("input", false);
      this.showLogin = false;
    },
    changeUserInfo() {
      this.editAble = true;
    },
    changeUserPwdShow() {
      this.showChangePwd = true;
    },
    cancelChangePwd() {
      this.showChangePwd = false;
    },

    changePwd() {
      let args = this.$refs.changePwdForm.getFormData();
      if (args.new_password != args.sure_password) {
        this.$appHelper.infoMsg(this.$t("p.againPwdErr"));
        return;
      }
      ChangePwd(args, true, false).then((resp) => {
          if (resp.res_code == 0) {
            this.$appHelper.infoMsg(this.$t("c.changeSuccess"));
          } else {
            this.$appHelper.infoMsg(resp.res_mes);
          }
          this.showChangePwd = false;
        })
    },

    logout() {
      this.$store.dispatch("logout");
      this.user.user_name = "";
      this.user.password = "";
      this.showUserInfo = false;
      this.editAble = false;
      this.showChangePwd = false;
      this.$emit("input", false);
    },

    doLogin() {
      this.user = this.$refs.loginForm.formData;
      console.log(this.user);
      // 验证
      if (this.user.user_name == null || this.user.user_name === "") {
        this.$appHelper.infoMsg(this.$t("p.nameIsNull"));
        return;
      }
      Login(this.user).then((resp) => {
        let loginUser = {};
        loginUser.user_name = resp.res_val.user_name;
        loginUser.password = resp.res_val.password;
        loginUser.user_id = resp.res_val.user_id;
        setUser(loginUser);
        let token = resp.res_val.token;
        console.log(token);
        setToken(token);
        this.showLogin = false;
        this.showChangePwd = false;
        this.$emit("input", false);
        this.$appHelper.infoMsg(this.$t("p.loginOk"));
      });
    },
    doRegister() {
      let args = this.$refs.registerForm.getFormData();
      if (args.password != args.re_password) {
        this.$appHelper.infoMsg(this.$t("p.againPwdErr"));
        return;
      }
      Register(args).then((resp) => {
        if (resp.res_code == 0) {
          this.$appHelper.successMsg(this.$t("p.emailSend"));
          this.close();
        } else {
          this.$appHelper.errorMsg(resp.res_mes);
        }
      });
    },
    cancelRegistr() {
      this.showRegister = false;
    },
    getOldPassword() {},
    register() {
      this.showRegister = true;
    },
  },
  watch: {
    value(v) {
      if (v) {
        console.log(
          "查看用户信息,",
          this.$store.getters.token,
          this.$store.getters.user
        );
        if (this.$store.getters.token) {
          this.user = this.$store.getters.user;
          this.showUserInfo = true;
          this.editAble = false;
          this.showChangePwd = false;
        } else {
          this.showLogin = true;
        }
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
