<template>
  <div class="login-bg">
    <div class="box">
      <div class="login-title">
        国智数字知产科技服务平台
      </div>
      <div class="login-input">
        <div class="input-left">
          <div class="form">
            <el-input
              v-model="phone"
              placeholder="请输入账号"
              class="input-user"
              prefix-icon="el-icon-user"
            ></el-input>
            <el-input
              v-model="password"
              placeholder="请输入密码"
              class="input-pswd"
              prefix-icon="el-icon-unlock"
              show-password
            ></el-input>
            <el-button type="primary" class="input-button" @click="login" style="margin-top:50px"
              ><span class="input-span"
                >登&nbsp;&nbsp;&nbsp;&nbsp;录</span
              ></el-button
            >
          </div>
        </div>
        <div class="input-right"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { baseUrl } from "../components/utils/ajaxPath"
export default {
  data() {
    return {
      phone: "",
      password: ""
    };
  },
  methods: {
    login() {
      $.ajax({
        url: baseUrl + "/user/v1/loginPC",
        data: {
          phone: this.phone,
          password: this.password
        },
        type: "post",
        dataType: "json",
        success: data => {
          if (this.password == "") {
            this.$message({
              showClose: true,
              duration: 1500,
              message: "请输入密码！",
              type: "error"
            });
          } else if (this.phone == "") {
            this.$message({
              showClose: true,
              duration: 1500,
              message: "请输入账号！",
              type: "error"
            });
          } else {
            if (data.status == "error") {
              this.$message({
                showClose: true,
                duration: 1500,
                message: "账号或密码输入错误，请重新输入！",
                type: "error"
              });
              this.phone = "";
              this.password = "";
            } else {
              // console.log(data);
              this.$message({
                showClose: true,
                duration: 1500,
                message: "登陆成功!",
                type: "success"
              });
              sessionStorage.setItem("user", JSON.stringify(data.data));
              this.$router.push("/index");
            }
          }
        }
      });
    }
  }
};
</script>

<style>
.input-span {
  font-size: 20px;
  font-weight: bold;
}
.input-button {
  width: 200px;
  height: 42px;
  border-radius: 20px;
  margin-top: 20px;
}
.form {
  width: 300px;
  height: 200px;
  padding: 120px 80px 80px 100px;
}
.input-pswd {
  width: 300px;
  height: 34px;
  margin-top: 30px;
}
.input-user {
  width: 300px;
  height: 34px;
}
.input-left {
  width: 480px;
  height: 100%;
  float: left;
  text-align: center;
}
.input-right {
  width: 300px;
  height: 100%;
  float: left;
  height: auto;
  background: url("../assets/images/login-img.png") no-repeat center;
  background-size: 300px auto;
}
.box {
  position: relative;
  top: -8vh;
}
.login-bg {
  width: 100%;
  height: 100vh;
  background: url("../assets/images/login_bgc1.png") no-repeat center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-title {
  text-align: center;
  font-size: 36px;
  color: #006eab;
  color: white;
  margin-bottom: 80px;
  letter-spacing: 5px;
}
.login-input {
  background: #fff;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  border-radius: 4px;
  width: 780px;
  height: 410px;
  overflow: hidden;
}
</style>
