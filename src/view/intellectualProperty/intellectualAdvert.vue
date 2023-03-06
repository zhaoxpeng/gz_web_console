<template>
  <div class="intellect-content">
    <div class="content-find">
      <el-input
        v-model="advertisementTitle"
        placeholder="请输入广告标题"
        style="width: 300px"
      ></el-input>
      <el-date-picker
        v-model="dayTime"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        end-placeholder="结束日期"
        style="margin-left: 20px"
      >
      </el-date-picker>
      <el-button
        type="primary"
        style="width: 100px; margin-left: 60px"
        @click="findAdvertisement"
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
    <div class="content-addOrDelete">
      <el-button type="primary" style="width: 100px" @click="addAdvert"
        >新增</el-button
      >
      <el-button type="danger" style="width: 100px" @click="batchDeleteAdvert"
        >删除</el-button
      >
    </div>
    <div class="content-list">
      <el-table
        ref="multipleTable"
        :data="advertisementList"

        style="width: 98%"
        :border="true"
        
        @selection-change="handleSelectionChange"
        :header-cell-style="{ background: '#eef7fe', color: '#006eab' }"
      >
        <el-table-column type="selection" width="50" align="center">
        </el-table-column>
        <el-table-column type="index" label="序号" width="60" align="center">
        </el-table-column>
        <el-table-column prop="title" label="广告标题" align="center">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center">
        </el-table-column>
        <!-- <el-table-column prop="disabledTime" label="失效时间" align="center">
        </el-table-column> -->
        <el-table-column
          prop="pictureUrl"
          label="图片"
          align="center"
          width="200px"
        >
          <template slot-scope="scope">
            <el-image
              style="width: 60%; height: 40px"
              :src="scope.row.pictureUrl"
              :preview-src-list="[scope.row.pictureUrl]"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.status == 1">
              已上架
            </p>
            <p v-if="scope.row.status == 0">
              已下架
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status == 0"
              size="small"
              @click="
                groundingAdvertClick(scope.row.bannerId, scope.row.status)
              "
              type="primary"
              >上架</el-button
            >
            <el-button
              v-if="scope.row.status == 1"
              size="small"
              @click="
                groundingAdvertClick(scope.row.bannerId, scope.row.status)
              "
              type="warning"
              >下架</el-button
            >
            <el-button
              size="small"
              @click="updateAdvertClick(scope.row)"
              type="success"
              >编辑</el-button
            >
            <el-button
              size="small"
              @click="deleteAdvert(scope.row.bannerId)"
              type="danger"
              >删除</el-button
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
    <!-- 新增广告弹窗 -->
    <el-dialog
      title="新增广告"
      :visible.sync="addAdvertDialog"
      width="30%"
      :close-on-click-modal="false"
    >
      <div class="addAdver-input">
        广告标题
        <el-input
          v-model="addAdvertById.title"
          placeholder="请输入广告标题！"
        ></el-input>
      </div>
      <div class="block">
        <div class="block-createTime">
          开始时间
          <el-date-picker
            v-model="addAdvertById.createTime"
            type="datetime"
            placeholder="选择开始时间"
            style="width:100%"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </div>
        <div class="block-span">
          <span style="width:100%"></span>
        </div>
        <!-- <div class="block-endTime">
          结束时间
          <el-date-picker
            v-model="addAdvertById.disabledTime"
            type="datetime"
            placeholder="选择结束时间"
            style="width:100%"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </div> -->
      </div>
      <div class="addAdvert-image">
        <span>点击上传封面图片</span>
        <el-upload
          action="string"
          list-type="picture-card"
          :http-request="upload"
          :on-success="handleAvatarSuccess"
          :limit="1"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addAdvertDialog = false">取 消</el-button>
        <el-button type="primary" @click="addAdvertButton">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改广告弹窗 -->
    <el-dialog
      title="修改广告"
      :visible.sync="udateAdverDialog"
      width="30%"
      :close-on-click-modal="false"
    >
      <div class="addAdver-input">
        广告标题
        <el-input
          v-model="addAdvertById.title"
          placeholder="请输入广告标题！"
        ></el-input>
      </div>
      <div class="block">
        <div class="block-createTime">
          开始时间
          <el-date-picker
            v-model="addAdvertById.createTime"
            type="datetime"
            placeholder="选择开始时间"
            style="width:100%"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </div>
        <div class="block-span">
          <span style="width:100%"></span>
        </div>
        <!-- <div class="block-endTime">
          结束时间
          <el-date-picker
            v-model="addAdvertById.disabledTime"
            type="datetime"
            placeholder="选择结束时间"
            style="width:100%"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </div> -->
      </div>
      <div class="addAdvert-image">
        <span class="info-span">点击下方修改封面</span>
        <div style="margin-top: 20px">
          <template v-if="addAdvertById.images == ''">
            <el-upload
              action="string"
              list-type="picture-card"
              :http-request="upload"
              :on-success="handleAvatarSuccess"
              :limit="1"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </template>
          <template v-if="addAdvertById.images != ''">
            <el-image
              style="width: 148px; height: 148px"
              :src="addAdvertById.images"
              @click="deleteImage"
            >
            </el-image>
          </template>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="udateAdverDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateAdvertButton">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { baseUrl } from "../../components/utils/ajaxPath"
import oss from "../../components/utils/aliOss";
export default {
  data() {
    return {
      //添加广告参数
      addAdvertById: {
        bannerId: "",
        title: "",
        watch: 0,
        images: "",
        pictureUrl: "",
        createTime: "",
        // disabledTime: ""
      },
      active: "1",
      dayTime: "", //筛选时间
      // 筛选条件
      advertisementTitle: "",
      // 列表数据
      advertisementList: [],
      page: 1,
      size: 10,
      startTime: "",
      endTime: "",
      title: "",
      advert: true,
      total: 0,
      currentPage: 1,
      addAdvertDialog: false, //添加广告弹窗
      udateAdverDialog: false,
      bannerId: "", // 批量删除获取id
      bannerType: 0 //banner上下架状态
    };
  },
  methods: {
    deleteImage() {
      this.addAdvertById.images = "";
    },
    upload(optionImg) {
      // ("???", optionImg);
      oss.ossUploadFile(optionImg, "goodsImg");
    },
    handleAvatarSuccess(res, file) {
      // console.log(res.filePath);
      this.addAdvertById.pictureUrl = res.filePath + res.name;
    },
    updateAdvertButton() {
      $.ajax({
        url: baseUrl+"/banner/v1/update",
        data: this.addAdvertById,
        type: "post",
        dataType: "json",
        success: data => {
          if (data.status == "success") {
            this.$message({
              showClose: true,
              duration: 1500,
              message: "修改成功!",
              type: "success"
            });
            this.getAdvertisementList();
            this.udateAdverDialog = false;
          }
        }
      });
    },
    //修改banner
    updateAdvertClick(data) {
      (data);
      this.addAdvertById.images = data.pictureUrl;
      this.addAdvertById.bannerId = data.bannerId;
      this.udateAdverDialog = true;
      this.addAdvertById.title = data.title;
      this.addAdvertById.createTime = data.createTime;
      // this.addAdvertById.disabledTime = data.disabledTime;
    },
    //上下架banner
    groundingAdvertClick(id, type) {
      if (type == 0) {
        this.bannerType = 1;
      } else {
        this.bannerType = 0;
      }
      this.$confirm("是否对该广告进行操作？", "提示", {
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
            url: baseUrl+"/banner/v1/status",
            data: {
              bannerId: id,
              status: this.bannerType
            },
            type: "post",
            dataType: "json",
            success: data => {
              if (data.status == "success") {
                this.getAdvertisementList();
              }
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
    //批量删除
    batchDeleteAdvert() {
      if (this.bannerId == "") {
        this.$message({
          showClose: true,
          duration: 1500,
          message: "请选择要删除的广告!",
          type: "error"
        });
      } else {
        this.$confirm("是否删除？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            $.ajax({
              url: baseUrl+"/banner/v1/delete",
              data: {
                ids: this.bannerId
              },
              type: "post",
              dataType: "json",
              success: data => {
                if (data.status == "success") {
                  this.getAdvertisementList();
                }
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "error",
              message: "取消删除！"
            });
          });
      }
    },
    // 删除广告
    deleteAdvert(id) {
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          $.ajax({
            url: baseUrl+"/banner/v1/delete",
            data: {
              ids: id
            },
            type: "post",
            dataType: "json",
            success: data => {
              if (data.status == "success") {
                this.getAdvertisementList();
              }
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "取消删除！"
          });
        });
    },
    // 添加广告
    addAdvertButton() {
      $.ajax({
        url: baseUrl+"/banner/v1/add",
        data: this.addAdvertById,
        type: "post",
        dataType: "json",
        success: data => {
          (data);
          if (data.status == "success") {
            this.$message({
              showClose: true,
              duration: 1500,
              message: "添加成功!",
              type: "success"
            });
            this.addAdvertDialog = false;
            this.getAdvertisementList();
          } else {
            this.$message({
              showClose: true,
              duration: 1500,
              message: "添加失败，请联系管理员!",
              type: "error"
            });
          }
        }
      });
    },
    imageUpload(response, file, fileList) {},
    handleRemove(file, fileList) {},
    handlePreview(file) {},
    addAdvert() {
      this.addAdvertDialog = true;
    },
    handleSizeChange(val) {
      this.size = val;
      this.getAdvertisementList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getAdvertisementList();
    },
    //批量删除获取id
    handleSelectionChange(row) {
      this.bannerId = "";
      for (var i = 0; i < row.length; i++) {
        this.bannerId += row[i].bannerId + ",";
      }
      // this.bannerId = bannerIds;
    },
    // 清空筛选条件
    findResetting() {
      this.dayTime = "";
      this.advertisementTitle = "";
      this.getAdvertisementList();
    },
    // 确定筛选
    findAdvertisement() {
      this.getAdvertisementList();
    },
    // 获取数据
    getAdvertisementList() {
      $.ajax({
        url: baseUrl+"/banner/v1/bannerList",
        data: {
          page: this.page,
          size: this.size,
          watch: 0,
          startTime: this.dayTime[0],
          endTime: this.dayTime[1],
          title: this.advertisementTitle
        },
        type: "post",
        dataType: "json",
        success: data => {
          this.advertisementList = data.data;
          // console.log(this.advertisementList);
          this.total = data.total;
        }
      });
    }
  },
  created() {
    this.getAdvertisementList();
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
  /* overflow: hidden; */
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
  overflow: auto;
  height: 98%;
  background: #fff;
  margin-top: 0.5%;
}
</style>
