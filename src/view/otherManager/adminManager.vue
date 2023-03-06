<template>
  <div class="intellect-content">
    <div class="content-find">
      <el-input
        v-model="username"
        placeholder="请输入用户名称"
        style="width: 200px"
      ></el-input>
      <el-input
        v-model="phone"
        placeholder="请输入用户电话"
        style="width: 200px; margin-left: 10px"
      ></el-input>
      <el-button
        type="primary"
        style="width: 100px; margin-left: 20px"
        @click="findAdmin"
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
        :data="adminList"
        style="width: 98%"
        :border="true"
        :header-cell-style="{ background: '#eef7fe', color: '#006eab' }"
      >
        <el-table-column type="index" label="序号" width="60" height="20px" align="center">
        </el-table-column>
        <el-table-column prop="nickName" label="用户昵称" align="center">
        </el-table-column>
        <el-table-column prop="phone" label="用户电话" align="center">
        </el-table-column>
        <el-table-column prop="gender" label="性别" align="center">
        </el-table-column>
        <el-table-column prop="enterpriseName" label="企业名称" align="center">
        </el-table-column>
        <el-table-column prop="enterprisePhone" label="企业电话" align="center">
        </el-table-column>
        <el-table-column prop="state" label="状态" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.state == 1" style="color:red">
              冻结
            </p>
            <p v-if="scope.row.state == 0">
              正常
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.state == 0"
              size="small"
              type="warning"
              @click="handleAdmin(scope.row.userId, scope.row.state)"
              >冻结</el-button
            >
            <el-button
              v-if="scope.row.state == 1"
              size="small"
              type="success"
              @click="handleAdmin(scope.row.userId, scope.row.state)"
              >恢复</el-button
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
import { baseUrl } from "../../components/utils/ajaxPath"

export default {
  data() {
    return {
      handleType: "",
      adminList: [],
      phone: "",
      username: "",
      page: 1,
      size: 10,
      currentPage: 1,
      total: 0
    };
  },
  methods: {
    handleAdmin(id, type) {
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
            url: baseUrl+"/user/v1/state",
            data: {
              userId: id,
              state: this.handleType
            },
            type: "post",
            dataType: "json",
            success: data => {
              this.getAdminList();
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
    findAdmin() {
      this.getAdminList();
    },
    findResetting() {
      this.page = 1;
      this.size = 10;
      this.phone = "";
      this.username = "";
      this.getAdminList();
    },
    handleSizeChange(val) {
      this.size = val;
      this.getAdminList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getAdminList();
    },
    //获取数据
    getAdminList() {
      var data = {
        page: this.page,
        size: this.size,
        username: this.username,
        phone: this.phone,
      };
      $.ajax({
        url: baseUrl+"/user/v1/list",
        data: data,
        type: "post",
        dataType: "json",
        success: data => {
          this.adminList = data.data;
          this.total = data.total;
        }
      });
    }
  },
  created() {
    this.getAdminList();
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
