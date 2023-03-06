<!-- 知识产权页面 -->

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
            <i class="el-icon-s-order"></i>
            <span slot="title">广告管理</span>
          </el-menu-item>
          <el-menu-item index="2" class="menu-span">
            <i class="el-icon-s-platform"></i>
            <span slot="title">服务管理</span>
          </el-menu-item>
          <el-menu-item index="3" class="menu-span">
            <i class="el-icon-s-comment"></i>
            <span slot="title">资讯管理</span>
          </el-menu-item>
        </el-menu>
      </div>
    </div>
    <div class="intellect-right">
      <advert v-show="advert"></advert>
      <service v-show="service"></service>
      <info v-show="info"></info>
    </div>
  </div>
</template>

<script>
import intellectual from "../../components/header/header.vue";
import advert from "../intellectualProperty/intellectualAdvert.vue";
import service from "../intellectualProperty/intellectualService.vue";
import info from "../intellectualProperty/intellectualInfo.vue";
export default {
  components: {
    intellectual,
    advert,
    service,
    info
  },
  data() {
    return {
      active: "1",
      advert: true,
      service: false,
      info: false
    };
  },
  methods: {
    leftMenu(index) {
      if (index == 1) {
        this.service = false;
        this.advert = true;
        this.info = false;
      } else if (index == 2) {
        this.advert = false;
        this.service = true;
        this.info = false;
      } else if(index == 3){
        this.advert = false;
        this.service = false;
        this.info = true;
      }
    }
  },
  created() {}
};
</script>

<style>
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
