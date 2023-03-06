<!-- 项目申报页面 -->

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
            <i class="el-icon-document-copy"></i>
            <span slot="title">题库管理</span>
          </el-menu-item>
          <el-menu-item index="2" class="menu-span">
            <i class="el-icon-document-add"></i>
            <span slot="title">申报企业</span>
          </el-menu-item>
        </el-menu>
      </div>
    </div>
    <div class="intellect-right">
      <div class="intellect-content">
        <question v-show="question"></question>
        <enterprise v-show="enterprise"></enterprise>
      </div>
    </div>
  </div>
</template>

<script>
import intellectual from "../../components/header/header.vue";
import question from "../projectDeclaration/projectDeclarationQuestion.vue";
import enterprise from "../projectDeclaration/enterpriseDeclaration.vue";
export default {
  components: {
    intellectual,
    question,
    enterprise
  },
  data() {
    return {
      active: "1",
      question: true,
      enterprise: false
    };
  },
  methods: {
    leftMenu(index) {
      if (index == 1) {
        this.question = true;
        this.enterprise = false;
      } else {
        this.question = false;
        this.enterprise = true;
      }
    }
  }
};
</script>

<style>
.intellect-menu {
  width: 96%;
  background: #fff;
  height: 100%;
}
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
