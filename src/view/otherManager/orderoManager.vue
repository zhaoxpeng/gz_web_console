<template>
  <div class="intellect-content">
    <div class="content-find">
      <el-select v-model="orderoTypeValue" placeholder="请选择订单状态">
        <el-option
          v-for="item in orderoType"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="orderoPayValue"
        placeholder="请选择订单支付状态"
        style="margin-left: 10px"
      >
        <el-option
          v-for="item in orderoPay"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-date-picker
        v-model="createTime"
        type="datetime"
        placeholder="选择订单创建时间"
        style="margin-left: 10px"
      >
      </el-date-picker>
      <el-button
        type="primary"
        style="width: 100px; margin-left: 20px"
        @click="findOrdero"
        >搜索</el-button
      >
      <el-button
        type="primary"
        plain
        style="width: 100px"
        @click="findResetting"
        >重置</el-button
      >
    </div>
    <div class="content-list">
      <el-table
        :data="orderoList"
        style="width: 98%"
        :border="true"

        :header-cell-style="{ background: '#eef7fe', color: '#006eab' }"
      >
        <el-table-column type="index" label="序号" width="60" align="center">
        </el-table-column>
        <el-table-column prop="orderNo" label="订单编号" align="center">
        </el-table-column>
        <el-table-column prop="orderPrice" label="订单价格" align="center">
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center">
        </el-table-column>
        <el-table-column prop="orderStatus" label="订单状态" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.orderStatus == 1">
              已完成
            </p>
            <p v-if="scope.row.orderStatus == 0">
              未完成
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="payStatus" label="支付状态" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.payStatus == 1">
              已支付
            </p>
            <p v-if="scope.row.payStatus == 0">
              未支付
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="content-page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { baseUrl } from '../../components/utils/ajaxPath';
export default {
  data() {
    return {
      orderoPayValue: "",
      orderoPay: [
        { label: "未支付", value: 0 },
        { label: "已支付", value: 1 }
      ],
      orderoTypeValue: "",
      orderoType: [
        { label: "未完成", value: 0 },
        { label: "已完成", value: 1 }
      ],
      handleType: "",
      orderoList: [],
      createTime: "",
      page: 1,
      size: 10,
      currentPage: 1,
      total: 0
    };
  },
  methods: {
    findOrdero() {
      this.getOrderoList();
    },
    findResetting() {
      this.page = 1;
      this.size = 10;
      this.orderoPayValue = "";
      this.orderoTypeValue = "";
      this.createTime = "";
      this.getOrderoList();
    },
    handleSizeChange(val) {
      this.size = val;
      this.getOrderoList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getOrderoList();
    },
    //获取数据
    getOrderoList() {
      var data = {
        page: this.page,
        size: this.size,
        oStatus: this.orderoTypeValue,
        payStatus: this.orderoPayValue,
        createTime: this.createTime
      };
      $.ajax({
        url: baseUrl+"/order/v1/list1",
        data: data,
        type: "post",
        dataType: "json",
        success: data => {
          (data);
          this.orderoList = data.data;
          this.total = data.total;
        }
      });
    }
  },
  created() {
    this.getOrderoList();
  }
};
</script>

<style>
.addAdvert-image {
  margin-top: 10px;
}
.block-endTime {
  float: right;
  width: 49%;
}
.block-span {
  float: left;
  width: 2%;
}
.block-createTime {
  float: left;
  width: 49%;
}
.addAdver-input {
  width: 100%;
}
.block {
  margin-top: 10px;
  overflow: hidden;
  width: 100%;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.content-page {
  margin-left: 2%;
  padding-top: 20px;
}
.content-list {
  margin-left: 2%;
  padding-top: 20px;
}
.content-addOrDelete {
  margin-left: 2%;
  padding-top: 20px;
}
.content-find {
  margin-left: 2%;
  padding-top: 20px;
}
.menu-span {
  font-size: 16px;
}
.intellect-content {
  width: 100%;
  height: 98%;
  background: #fff;
  margin-top: 0.5%;
}
</style>
