<template>
  <div class="index">
    <div class="index-header">
      <headerTitle></headerTitle>
    </div>
    <div class="index-content">
      <div class="content-top">
        <div class="top-col">
          <div class="top-icon">
            <img class="top-image" src="../assets/images/icon1.png" alt="" />
          </div>
          <div class="top-span1">
            <p>注册用户总数</p>
            <p class="top-span2">{{ 1024||adminSum }}</p>
          </div>
        </div>
        <div class="top-col">
          <div class="top-icon">
            <img class="top-image" src="../assets/images/icon2.png" alt="" />
          </div>
          <div class="top-span1">
            <p>昨日新增用户人数</p>
            <p class="top-span2">{{ 5||yesterdayAdminSum }}</p>
          </div>
        </div>
        <div class="top-col">
          <div class="top-icon">
            <img class="top-image" src="../assets/images/icon3.png" alt="" />
          </div>
          <div class="top-span1">
            <p>已采集科技服务信息总数</p>
            <p class="top-span2">{{ 62126||infoSum }}</p>
          </div>
        </div>
        <div class="top-col">
          <div class="top-icon">
            <img class="top-image" src="../assets/images/icon4.png" alt="" />
          </div>
          <div class="top-span1">
            <p>以产生订单总数</p>
            <p class="top-span2">{{ orderoSum }}</p>
          </div>
        </div>
        <div class="top-col">
          <div class="top-icon">
            <img class="top-image" src="../assets/images/icon5.png" alt="" />
          </div>
          <div class="top-span1">
            <p>未完成订单总数</p>
            <p class="top-span2">{{ onOrderoSum }}</p>
          </div>
        </div>
      </div>
      <div class="content-center">
        <div class="center-left">
          <div class="left-top">
            <div class="top-top">
              <span class="el-icon-s-custom"></span>
              <span>注册用户统计</span>
            </div>
            <hr
              style="height: 0.5px; margin-top: -3px; background: #EEEEEE; width: 99%"
            />
            <div class="top-bottom" id="chart1"></div>
          </div>
          <div class="left-bottom">
            <div class="top-top">
              <span class="el-icon-s-order"></span>
              <span>昨日新增用户统计</span>
            </div>
            <hr
              style="height: 0.5px; margin-top: -3px; background: #EEEEEE; width: 99%"
            />
            <div class="top-bottom" id="chart2"></div>
          </div>
        </div>
        <div class="center-right">
          <div class="left-top">
            <div class="top-top">
              <span class="el-icon-circle-plus"></span>
              <span>已发布资讯统计</span>
            </div>
            <hr
              style="height: 0.5px; margin-top: -3px; background: #EEEEEE; width: 99%"
            />
            <div class="top-bottom" id="chart3"></div>
          </div>
          <div class="left-bottom">
            <div class="top-top">
              <span class="el-icon-s-data"></span>
              <span>订单数量统计</span>
            </div>
            <hr
              style="height: 0.5px; margin-top: -3px; background: #EEEEEE; width: 99%"
            />
            <div class="top-bottom" id="chart4"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import headerTitle from "../components/header/header.vue";
import { baseUrl } from "../components/utils/ajaxPath"
export default {
  components: {
    headerTitle
  },
  data() {
    return {
      adminSum: "", //用户总数
      yesterdayAdminSum: "", //昨日新增总数
      infoSum: "", //已发布资讯总数
      orderoSum: "", //以产生订单总数
      onOrderoSum: "" //未完成订单总数
    };
  },
  mounted() {
    this.$chart.line1("chart1");
    this.$chart.line2("chart2");
    this.$chart.line3("chart3");
    this.$chart.line4("chart4");
  },
  methods: {
    getAdminSum() {
      $.ajax({
        url: baseUrl+"/user/v1/sum",
        data: {},
        type: "get",
        dataType: "json",
        success: data => {
          this.adminSum = data.data;
        }
      });
    },
    getYesterdayAdminSum() {
      $.ajax({
        url: baseUrl+"/user/v1/yesterday",
        data: {},
        type: "get",
        dataType: "json",
        success: data => {
          this.yesterdayAdminSum = data.data;
        }
      });
    },
    getInfoSum() {
      $.ajax({
        url: baseUrl+"/news/v1/sum",
        data: {},
        type: "get",
        dataType: "json",
        success: data => {
          this.infoSum = data.data;
        }
      });
    },
    getOrderoSum() {
      $.ajax({
        url: baseUrl+"/order/v1/sum",
        data: {},
        type: "get",
        dataType: "json",
        success: data => {
          this.orderoSum = data.data;
        }
      });
    },
    getOnOrderoSum() {
      $.ajax({
        url: baseUrl+"/order/v1/sumUndone",
        data: {},
        type: "get",
        dataType: "json",
        success: data => {
          this.onOrderoSum = data.data;
        }
      });
    }
  },
  created() {
    this.getAdminSum();
    this.getYesterdayAdminSum();
    this.getInfoSum();
    this.getOrderoSum();
    this.getOnOrderoSum();
  }
};
</script>

<style scoped>
.top-bottom {
  width: 100%;
  height: 100%;
}
.top-top {
  color: #006eab;
  padding: 10px 15px;
}
.left-top {
  width: 100%;
  height: 49%;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.left-bottom {
  margin-top: 10px;
  width: 100%;
  height: 49%;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
.center-right {
  margin-left: 0.7%;
  width: 49.5%;
  height: 99.5%;
  float: left;
}
.center-left {
  width: 49.5%;
  height: 99.5%;
  float: left;
}
.content-center {
  width: 1890px;
  height: 720px;
  margin: 10px 15px;
  overflow: hidden;
}
.top-span2 {
  font-size: 28px;
  margin-top: -5px;
  color: #006eab;
  font-weight: bold;
}
.top-span1 {
  font-size: 16px;
  margin-top: 10px;
  margin-left: 10px;
  width: 55%;
  float: left;
}
.top-icon {
  width: 20%;
  min-width: 20%;
  margin: 30px 0px 25px 70px;
  float: left;
}
.top-image {
  width: 65px;
  height: 65px;
}
.top-col {
  background: #eef7fe;
  width: 19%;
  margin-left: 16px;
  height: 100%;
  float: left;
  border-radius: 10px;
  /* overflow: hidden; */
  display: flex;
  justify-content: space-between;
}
.content-top {
  display: flex;
  justify-content: space-between;
  height: 125px;
  /* overflow: hidden; */
  margin-top: 20px;
}
</style>
