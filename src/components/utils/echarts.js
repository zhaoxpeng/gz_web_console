/**
 * 各种画echarts图表的方法都封装在这里
 * 注意：这里echarts没有采用按需引入的方式，只是为了方便学习
 */

import * as echarts from "echarts";
const install = function(Vue) {
  Object.defineProperties(Vue.prototype, {
    $chart: {
      get() {
        return {
          //画一条简单的线
          // 注册用户统计
          line1: function(id) {
            this.chart = echarts.init(document.getElementById(id));
            this.chart.clear();
            $.ajax({
              url: "http://192.168.10.101:18099/dev/user/v1/sumHour",
              data: {},
              type: "get",
              dataType: "json",
              success: data => {
                var data = data.data;
                var time = [];
                var value = [];
                for (var i = 0; i < data.length; i++) {
                  time.push(data[i].hour);
                  value.push(data[i].num);
                }
                const optionData = {
                  title: {
                    // text: "未来一周气温变化",
                    subtext: "单位：人"
                  },
                  grid: {
                    left: "1%",
                    right: "1%",
                    containLabel: true
                  },
                  tooltip: {
                    trigger: "axis"
                  },
                  xAxis: {
                    type: "category",
                    // boundaryGap: false,
                    data: time,
                    axisLabel: {
                      formatter: function(value, index) {
                        return value + "：00";
                      }
                    },
                    axisPointer: {
                      type: "none"
                    }
                  },
                  yAxis: {
                    type: "value",
                    interval: 1
                  },
                  series: [
                    {
                      name: "注册人数：",
                      data: value,
                      type: "line",
                      smooth: true,
                      color: "green",
                      areaStyle: {
                        color: "rgba(	152,251,152, 0.4)"
                      }
                    }
                  ]
                };
                this.chart.setOption(optionData);
              }
            });
          },
          // 昨日新增用户统计
          line2: function(id) {
            this.chart = echarts.init(document.getElementById(id));
            this.chart.clear();
            $.ajax({
              url: "http://192.168.10.101:18099/dev/user/v1/hour",
              data: {},
              type: "get",
              dataType: "json",
              success: data => {
                var data = data.data;
                var time = [];
                var value = [];
                for (var i = 0; i < data.length; i++) {
                  time.push(data[i].hour);
                  value.push(data[i].num);
                }
                const optionData = {
                  title: {
                    // text: "未来一周气温变化",
                    subtext: "单位：人"
                  },
                  grid: {
                    left: "1%",
                    right: "1%",
                    containLabel: true
                  },
                  tooltip: {
                    trigger: "axis"
                  },
                  xAxis: {
                    type: "category",
                    // boundaryGap: false,
                    data: time,
                    axisLabel: {
                      formatter: function(value, index) {
                        return value + "：00";
                      }
                    }
                  },
                  yAxis: {
                    type: "value",
                    interval: 1
                  },
                  series: [
                    {
                      name: "注册人数：",
                      data: value,
                      type: "line",
                      color: "#FFA500"
                    }
                  ]
                };
                this.chart.setOption(optionData);
              }
            });
          },
          // 已发布资讯统计
          line3: function(id) {
            this.chart = echarts.init(document.getElementById(id));
            this.chart.clear();
            var time = [];
            var releaseValue = [];
            var collectionValue = [];
            $.ajax({
              url: "http://192.168.10.101:18099/dev/news/v1/weekSum",
              data: {},
              type: "get",
              dataType: "json",
              success: data => {
                var collectionData = data.data;
                for (var i = 0; i < collectionData.length; i++) {
                  time.push(collectionData[i].date);
                  collectionValue.push(collectionData[i].num);
                }
                $.ajax({
                  url: "http://192.168.10.101:18099/dev/news/v1/collectWeek",
                  data: {},
                  type: "get",
                  dataType: "json",
                  success: data => {
                    var releaseData = data.data;
                    for (var i = 0; i < releaseData.length; i++) {
                      releaseValue.push(releaseData[i].num);
                    }
                    const optionData = {
                      tooltip: {
                        trigger: "axis",
                        axisPointer: {
                          type: "cross",
                          crossStyle: {
                            color: "#999"
                          }
                        }
                      },
                      grid: {
                        left: "1%",
                        right: "1%",
                        containLabel: true
                      },
                      legend: {
                        data: ["资讯数量", "收藏数量"]
                      },
                      xAxis: [
                        {
                          type: "category",
                          data: time,
                          axisPointer: {
                            type: "shadow"
                          }
                        }
                      ],
                      yAxis: [
                        {
                          type: "value",
                          name: "单位：条",
                          interval: 1,
                          axisLabel: {
                            formatter: "{value} 条"
                          }
                        }
                      ],
                      series: [
                        {
                          name: "资讯数量",
                          type: "bar",
                          barWidth: 25,
                          data: collectionValue,
                          itemStyle: {
                            emphasis: {
                              barBorderRadius: 30
                            },
                            normal: {
                              color: "#4169E1",
                              barBorderRadius: [20, 20, 20, 20]
                            }
                          }
                        },
                        {
                          name: "收藏数量",
                          type: "bar",
                          barWidth: 25,
                          data: releaseValue,
                          itemStyle: {
                            emphasis: {
                              barBorderRadius: 30
                            },
                            normal: {
                              color: "#00FF00",
                              barBorderRadius: [20, 20, 20, 20]
                            }
                          }
                        }
                      ]
                    };
                    this.chart.setOption(optionData);
                  }
                });
              }
            });
          },
          // 订单数量统计
          line4: function(id) {
            this.chart = echarts.init(document.getElementById(id));
            this.chart.clear();
            // $.ajax({
            //   url: "http://192.168.10.101:18099/dev/user/v1/list",
            //   data: data,
            //   type: "post",
            //   dataType: "json",
            //   success: data => {
            //   (data);
            //   }
            // });
            const optionData = {
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  type: "cross",
                  crossStyle: {
                    color: "#999"
                  }
                }
              },
              grid: {
                left: "1%",
                right: "1%",
                containLabel: true
              },
              legend: {
                data: ["未完成订单", "已完成订单"]
              },
              xAxis: [
                {
                  type: "category",
                  data: [
                    "周一",
                    "周二",
                    "周三",
                    "周四",
                    "周五",
                    "周六",
                    "周日"
                  ],
                  axisPointer: {
                    type: "shadow"
                  }
                }
              ],
              yAxis: [
                {
                  type: "value",
                  name: "单位：条",
                  interval: 1,
                  axisLabel: {
                    formatter: "{value} 条"
                  }
                }
              ],
              series: [
                {
                  name: "未完成订单",
                  type: "bar",
                  barWidth: 20,
                  data: ["2", "4", "6", "8", "5", "3", "1"],
                  itemStyle: {
                    emphasis: {
                      barBorderRadius: 30
                    },
                    normal: {
                      color: "#D4F2E7",
                      barBorderRadius: [20, 20, 20, 20]
                    }
                  }
                },
                {
                  name: "已完成订单",
                  type: "bar",
                  barWidth: 20,
                  data: ["2", "4", "6", "8", "5", "3", "1"],
                  itemStyle: {
                    emphasis: {
                      barBorderRadius: 30
                    },
                    normal: {
                      color: "	#FA8072",
                      barBorderRadius: [20, 20, 20, 20]
                    }
                  }
                }
              ]
            };
            this.chart.setOption(optionData);
          }
        };
      }
    }
  });
};

export default {
  install
};
