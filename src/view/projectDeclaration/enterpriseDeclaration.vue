<template>
  <div class="intellect-content">
    <div class="content-find">
      <el-input
        v-model="enterpriseName"
        placeholder="请输入企业名称"
        style="width: 200px"
      ></el-input>
      <el-input
        v-model="score"
        placeholder="请输入企业得分"
        style="width: 200px; margin-left: 10px"
      ></el-input>
      <el-input
        v-model="linkName"
        placeholder="请输入联系人姓名"
        style="width: 200px; margin-left: 10px"
      ></el-input>
      <el-input
        v-model="linkPhone"
        placeholder="请输入联系方式"
        style="width: 200px; margin-left: 10px"
      ></el-input>
      <el-select
        v-model="enterpriseValue"
        placeholder="请选择"
        style="width: 200px; margin-left: 10px"
      >
        <el-option
          v-for="item in enterpriseType"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button
        type="primary"
        style="width: 100px; margin-left: 20px"
        @click="findEnterprise"
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
        :data="enterpriseList"
        style="width: 98%"
        :border="true"
        :header-cell-style="{ background: '#eef7fe', color: '#006eab' }"
      >
        <el-table-column type="index" label="序号" width="60" align="center">
        </el-table-column>
        <el-table-column prop="enterpriseName" label="企业名称" align="center">
        </el-table-column>
        <el-table-column prop="linkName" label="联系人姓名" align="center">
        </el-table-column>
        <el-table-column prop="linkPhone" label="联系方式" align="center">
        </el-table-column>
        <el-table-column prop="score" label="企业得分" align="center">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center">
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.status == 1">
              已处理
            </p>
            <p v-if="scope.row.status == 0" style="color: red">
              未处理
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="申报类型" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.type == 0">
              科技厅
            </p>
            <p v-if="scope.row.type == 1">
              工信厅
            </p>
            <p v-if="scope.row.type == 2">
              发改委
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status == 0"
              size="small"
              type="warning"
              @click="handleEnterprise(scope.row.examId, scope.row.status)"
              >处理</el-button
            >
            <el-button
              v-if="scope.row.status == 1"
              size="small"
              type="info"
              @click="handleEnterprise(scope.row.examId, scope.row.status)"
              >取消处理</el-button
            >
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
      enterpriseList: [],
      score: "",
      linkName: "",
      linkPhone: "",
      enterpriseName: "",
      enterpriseValue: "",
      handleType: "",
      enterpriseType: [
        {
          label: "未处理",
          value: "0"
        },
        {
          label: "已处理",
          value: "1"
        }
      ],
      page: 1,
      size: 10,
      currentPage: 1,
      total: 0
    };
  },
  methods: {
    handleEnterprise(id, type) {
      if (type == 0) {
        this.handleType = 1;
      } else if (type == 1) {
        this.handleType = 0;
      }
      this.$confirm("是否进行操作？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          $.ajax({
            url: baseUrl+"/exam/v1/status",
            data: {
              examId: id,
              status: this.handleType
            },
            type: "post",
            dataType: "json",
            success: data => {
              this.getEnterpriseList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "取消操作！"
          });
        });
    },
    findEnterprise() {
      this.getEnterpriseList();
    },
    findResetting() {
      this.page = 1;
      this.size = 10;
      this.enterpriseName = "";
      this.score = "";
      this.linkName = "";
      this.linkPhone = "";
      this.status = "";
      this.getEnterpriseList();
    },
    handleSizeChange(val) {
      this.size = val;
      this.getEnterpriseList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getEnterpriseList();
    },
    //获取数据
    getEnterpriseList() {
      var data = {
        page: this.page,
        size: this.size,
        enterpriseName: this.enterpriseName,
        score: this.score,
        linkName: this.linkName,
        linkPhone: this.linkPhone,
        status: this.enterpriseValue
      };
      $.ajax({
        url: baseUrl+"/exam/v1/list",
        data: data,
        type: "post",
        dataType: "json",
        success: data => {
          this.enterpriseList = data.data;
        }
      });
    }
  },
  created() {
    this.getEnterpriseList();
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
