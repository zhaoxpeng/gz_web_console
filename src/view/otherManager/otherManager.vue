<!-- 其他页面 -->

<template>
  <div class="intellect">
    <div>
      <intellectual></intellectual>
    </div>
    <div class="intellect-left">
      <div class="intellect-menu">
        <el-menu
          :default-active="active"
          class="el-menu-vertical-demo"
          @select="leftMenu"
        >
          <el-menu-item index="1" class="menu-span">
            <i class="el-icon-user"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
          <el-menu-item index="2" class="menu-span">
            <i class="el-icon-tickets"></i>
            <span slot="title">订单管理</span>
          </el-menu-item>
        </el-menu>
      </div>
    </div>
    <div class="intellect-right">
      <div class="intellect-content">
        <admin v-show="admin"></admin>
        <ordero v-show="ordero"></ordero>
      </div>
    </div>
  </div>
</template>

<script>
import intellectual from "../../components/header/header.vue";
import admin from "../otherManager/adminManager.vue";
import ordero from "../otherManager/orderoManager.vue";
export default {
  components: {
    intellectual,
    admin,
    ordero
  },
  data() {
    return {
      active: "1",
      admin: true,
      ordero: false
    };
  },
  methods: {
    leftMenu(index) {
      if (index == 1) {
        this.admin = true;
        this.ordero = false;
      } else if (index == 2) {
        this.admin = false;
        this.ordero = true;
      }
    }
  }
};
</script>

<style>
.intellect-content {
  width: 100%;
  height: 98%;
  background: #fff;
  margin-top: 0.5%;
}
.intellect-menu {
  width: 96%;
  background: #fff;
  height: 100%;
}
.intellect-right {
  height: calc(100vh - 80px);
  overflow: hidden;
  overflow-y: auto;
  background: #eef7fe;
  float: left;
  width: 87%;
}
.intellect-left {
  width: 13%;
  height: calc(100vh - 80px);
  overflow: hidden;
  overflow-y: auto;
  background: #eef7fe;
  float: left;
}
.intellect {
  overflow: hidden;
}
</style>
