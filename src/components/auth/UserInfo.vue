<!-- H5用户登录 -->
<template>
  <div>
    <ae-base-dialog
      v-if="showLogin"
      v-model="showLogin"
      :title="$t('plogin')"
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
      :title="$t('pregister')"
      @close="closeLoginDialog"
    >
      <ae-form ref="registerForm" :formConfig="registerFormConfig"></ae-form>
      <ae-button-list
        :buttonList="registerButton"
        :clickAction="[doRegister, cancelRegistr]"
      ></ae-button-list>
    </ae-base-dialog>

    <ae-base-dialog
      :title="$t('puserInfo')"
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
      :title="$t('pchangePwd')"
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
          des: this.$t("pnameOrMail")
        },
        {
          type: "input",
          key: "password",
          des: this.$t("ppassword"),
         style: "password",
        },
      ],
      registerFormConfig: [
        {
          type: "input",
          key: "email",
          des: this.$t("pemail"),
          require: true,
        },
        {
          type: "input",
          key: "user_name",
          des: this.$t("puserName"),
          require: true,
        },
        {
          type: "input",
          key: "password",
          des: this.$t("ppassword"),
         style: "password",
          require: true,
        },
        {
          type: "input",
          key: "re_password",
          des: this.$t("prePassword"),
         style: "password",
          require: true,
        },
      ],
      userInfoFormConfig: [
        {
          type: "input",
          key: "user_name",
          des: this.$t("puserName"),
          edit: false,
        },
      ],
      changePwdFormConfig: [
        {
          type: "input",
          key: "old_password",
          des: this.$t("poldPwd"),
          style: "password",
          require: true,
        },
        {
          type: "input",
          key: "new_password",
          des: this.$t("pnewPwd"),
         style: "password",
          require: true,
        },
        {
          type: "input",
          key: "sure_password",
          des: this.$t("prePassword"),
         style: "password",
          require: true,
        },
      ],
      user: {},
      showChangePwd: false,
      editAble: false,
      loginButton: [this.$t("pfindPwd"), this.$t("pregister"), this.$t("plogin")],
      userInfoButton: [this.$t("pchangePwd"), this.$t("plogout")],
      changePwdButton: [this.$t("c.change"), this.$t("c.cancel")],
      registerButton: [this.$t("pregister"), this.$t("c.cancel")],
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
        this.$appHelper.infoMsg(this.$t("pagainPwdErr"));
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
        this.$appHelper.infoMsg(this.$t("pnameIsNull"));
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
        this.$appHelper.infoMsg(this.$t("ploginOk"));
      });
    },
    doRegister() {
      let args = this.$refs.registerForm.getFormData();
      if (args.password != args.re_password) {
        this.$appHelper.infoMsg(this.$t("pagainPwdErr"));
        return;
      }
      Register(args).then((resp) => {
        if (resp.res_code == 0) {
          this.$appHelper.successMsg(this.$t("pemailSend"));
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
