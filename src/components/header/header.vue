<template>
  <div class="header-content">
    <div class="header-title">
      国智数字知产科技服务平台
    </div>
    <div class="header-center">
      <el-menu
        :default-active="this.$route.path"
        class="el-menu-demo"
        mode="horizontal"
        active-text-color="#006eab"
        style="border-radius: 10px 10px 0 0;"
        :router="true"
      >
        <el-menu-item index="/index" style="font-size: 20px; margin-left: 20px"
          >首页</el-menu-item
        >
        <el-menu-item
          index="/intellectualProperty"
          style="font-size: 20px; margin-left: 20px"
          >知识产权</el-menu-item
        >
        <el-menu-item
          index="/projectDeclaration"
          style="font-size: 20px; margin-left: 20px"
          >项目申报</el-menu-item
        >
        <el-menu-item
          index="/otherManager"
          style="font-size: 20px; margin-left: 20px"
          >其他</el-menu-item
        >
      </el-menu>
    </div>
    <div class="header-right">
      <div class="userMan">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <img src="../../assets/images/user_head.png" class="user-avatar" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="updatePassword"
              >修改密码</el-dropdown-item
            >
            <el-dropdown-item @click.native="quitLogin"
              >退出登录</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <span style="color:#ffffff">{{ nikeName }}</span>
      </div>
      <div class="user-menu">
        <i class="el-icon-caret-bottom">{{ nikeName }}</i>
      </div>
    </div>
    <!-- 修改密码弹窗 -->
    <el-dialog
      title="修改密码"
      :visible.sync="updatePasswordDialog"
      width="20.7%"
      center
      :close-on-click-modal="false"
    >
      <el-input
        placeholder="请输入新密码！"
        v-model="password1"
        show-password
        class="updateInput"
      ></el-input>
      <el-input
        placeholder="请再次输入新密码！"
        v-model="password2"
        show-password
        class="updateInput"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updatePasswordDialog = false">取 消</el-button>
        <el-button type="primary" @click="updatePasswordOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { baseUrl } from "../utils/ajaxPath"

export default {
  data() {
    return {
      updatePasswordDialog: false,
      password1: "",
      password2: "",
      nikeName: ""
    };
  },
  methods: {
    quitLogin() {
      this.$confirm("是否退出国智数字知产科技服务平台？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "退出成功!"
          });
          this.$router.push("/");
          sessionStorage.clear();
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "取消退出！"
          });
        });
    },
    updatePasswordOk() {
      var user = JSON.parse(sessionStorage.getItem("user"));
      (user);
      if (this.password1 != this.password2) {
        this.$message({
          showClose: true,
          duration: 1500,
          message: "您两次输入的密码不一致，请重新输入!",
          type: "error"
        });
      } else {
        $.ajax({
          url: baseUrl + "/user/v1/rePwd",
          data: {
            userId: user.userId,
            pwd: this.password1
          },
          type: "post",
          dataType: "json",
          success: data => {
            (data);
            if (data.status == "success") {
              this.$message({
                showClose: true,
                duration: 1500,
                message: "修改成功!",
                type: "success"
              });
              this.updatePasswordDialog = false;
            } else {
              this.$message({
                showClose: true,
                duration: 1500,
                message: "修改失败，请联系管理员!",
                type: "error"
              });
            }
          }
        });
      }
    },
    updatePassword() {
      this.updatePasswordDialog = true;
      ("222");
    }
  },
  created() {
    var user = JSON.parse(sessionStorage.getItem("user"));
    this.nikeName = user.nickName;
  }
};
</script>

<style>
.updateInput {
  margin-top: 20px;
}
.userMan {
  float: left;
  height: 80px;
  display: inline;
}
.user-menu {
  float: right;
  line-height: 80px;
}
.el-icon-caret-bottom {
  color: #fff;
}
.user-avatar {
  margin-top: 20px;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  margin-right: 5px;
}
.header-right {
  height: 100%;
  width: 6%;
  float: right;
  margin-right: 1%;
  overflow: hidden;
}
.header-center {
  float: left;
  width: 29%;
  margin-top: 19px;
}
.header-title {
  line-height: 80px;
  font-size: 26px;
  font-weight: bold;
  color: white;
  width: 22%;
  float: left;
}
.header-content {
  height: 80px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  background: url("../../assets/images/head_bgc.png") no-repeat center;
  background-size: cover;
  padding: 0 10px;
  justify-content: space-between;
  overflow: hidden;
}
</style>
