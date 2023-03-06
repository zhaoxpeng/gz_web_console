// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router/router";
import { BASE_LYF } from "./components/utils/ajaxPath";
import { BASE_WJ } from "./components/utils/ajaxPath";
import BaiduMap from "vue-baidu-map";
import $ from "jquery";
import VueQuillEditor from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import myCharts from "./components/utils/echarts";

Vue.use(VueQuillEditor);
Vue.use(myCharts);
Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.use(BaiduMap, {
  ak: "n4tOrbGEyGKF3avOoIIFARFLuUjD226k"
});

global.BASE_LYF = BASE_LYF;
global.BASE_WJ = BASE_WJ;
/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});
