<template>
  <div class="intellect-content">
    <div class="content-find">
      <el-input
        v-model="infoTitle"
        placeholder="请输入资讯标题"
        style="width: 300px"
      ></el-input>
      <el-select
        v-model="infoStatusValue"
        placeholder="请选择资讯状态"
        style="margin-left: 20px"
      >
        <el-option
          v-for="item in infoStatus"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button
        type="primary"
        style="width: 100px; margin-left: 60px"
        @click="findInfo"
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
      <el-button type="primary" style="width: 100px" @click="addInfoButton"
        >新增资讯</el-button
      >
    </div>
    <!-- 数据列表 -->
    <div class="content-list">
      <el-table
        ref="multipleTable"
        :data="infoList"
        tooltip-effect="dark"
        style="width: 98%"
        :border="true"
        :header-cell-style="{ background: '#eef7fe', color: '#006eab' }"
      >
        <el-table-column type="index" label="序号" width="60" align="center">
        </el-table-column>
        <el-table-column
          prop="title"
          label="资讯标题"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column prop="source" label="资讯来源" align="center">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center">
        </el-table-column>
        <el-table-column
          prop="coverUrl"
          label="图片"
          align="center"
          width="200px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <el-image
              style="width: 60%; height: 40px"
              :src="scope.row.coverUrl"
              :preview-src-list="[scope.row.coverUrl]"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.status == 1">已上架</p>
            <p v-if="scope.row.status == 2">已下架</p>
            <p v-if="scope.row.status == 3">已删除</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status == 2"
              size="small"
              @click="groundingInfoClick(scope.row.newsId, scope.row.status)"
              type="primary"
              >上架</el-button
            >
            <el-button
              v-if="scope.row.status == 1"
              size="small"
              @click="groundingInfoClick(scope.row.newsId, scope.row.status)"
              type="warning"
              >下架</el-button
            >
            <el-button
              v-if="scope.row.status == 3"
              size="small"
              @click="groundingInfoClick(scope.row.newsId, scope.row.status)"
              type="info"
              >恢复</el-button
            >
            <el-button
              size="small"
              @click="editorInfoClick(scope.row)"
              type="success"
              >编辑</el-button
            >
            <el-button
              size="small"
              @click="deleteIfon(scope.row.newsId, scope.row.status)"
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
    <!-- 新增资讯弹窗 -->
    <el-dialog
      title="新增资讯"
      :visible.sync="addInfoDialog"
      width="80%"
      :close-on-click-modal="false"
    >
      <div class="essential-info">
        <div class="info-content">
          <el-input
            v-model="addInfoTitle"
            placeholder="请输入资讯标题！"
            style="width: 100%"
          ></el-input>
          <el-input
            v-model="addInfoSource"
            placeholder="请输入资讯来源！"
            style="width: 100%; margin-top: 10px"
          ></el-input>
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入资讯摘要"
            v-model="addInfoHeadline"
            style="width: 100%; margin-top: 10px"
          >
          </el-input>
          <div class="quill-left">
            <div>
              <span>请在下方输入资讯内容：</span>
            </div>
            <div style="margin-top: 10px">
              <el-upload
                style="display: none"
                class="quill-element-upload"
                action="string"
                list-type="picture-card"
                :http-request="uploadContent"
                :on-success="handleAvatarSuccessContent"
                :limit="99"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <template>
                <quill-editor
                  v-model="addInfoContent"
                  ref="myQuillEditor"
                  :options="editorOption"
                >
                </quill-editor>
              </template>
            </div>
          </div>
        </div>
        <div class="info-file">
          <span class="info-span">点击下方上传封面</span>
          <div style="margin-top: 20px">
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
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addInfoDialog = false">取 消</el-button>
        <el-button type="primary" @click="addInfoClick">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑/详情弹窗 -->
    <el-dialog
      title="资讯详情/修改"
      :visible.sync="editorInfoDialog"
      width="80%"
      :close-on-click-modal="false"
    >
      <div class="essential-info">
        <div class="info-content">
          <el-input
            v-model="addInfoTitle"
            placeholder="请输入资讯标题！"
            style="width: 100%"
          ></el-input>
          <el-input
            v-model="addInfoSource"
            placeholder="请输入资讯来源！"
            style="width: 100%; margin-top: 10px"
          ></el-input>
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入资讯摘要"
            v-model="addInfoHeadline"
            style="width: 100%; margin-top: 10px"
          >
          </el-input>
          <el-upload
                style="display: none"
                class="quill-element-upload"
                action="string"
                list-type="picture-card"
                :http-request="uploadContent"
                :on-success="handleAvatarSuccessContent"
                :limit="99"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
          <div class="quill-left">
            <template>
              <quill-editor
                v-model="updateInfoSource"
                ref="myQuillEditor"
                :options="editorOption"
              >
              </quill-editor>
            </template>
          </div>
        </div>
        <div class="info-file">
          <span class="info-span">点击下方修改封面</span>
          <div style="margin-top: 20px">
            <template v-if="imageUrl == ''">
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
            <template v-if="imageUrl != ''">
              <el-image
                style="width: 148px; height: 148px"
                :src="imageUrl"
                @click="deleteImage"
              >
              </el-image>
            </template>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editorInfoDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateInfoClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import oss from "../../components/utils/aliOss";
import { quillEditor } from "vue-quill-editor";
import { baseUrl } from "../../components/utils/ajaxPath";
const toolbarOptions = [
  [
    "image",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    { header: 1 },
    { header: 2 },
    { list: "ordered" },
    { list: "bullet" },
    { script: "sub" },
    { script: "super" },
    { indent: "-1" },
    { indent: "+1" },
    { direction: "rtl" },
    { size: ["small", false, "large", "huge"] },
    { header: [1, 2, 3, 4, 5, 6, false] },
    { font: [] },
    { color: [] },
    { background: [] },
    { align: [] },
  ],
];
export default {
  components: {
    quillEditor,
  },
  data() {
    return {
      editorOption: {
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              image: function (value) {
                if (value) {
                  document.querySelector(".quill-element-upload input")
                    ? document
                        .querySelector(".quill-element-upload input")
                        .click()
                    : document.querySelector(".quill-element-upload2 input");
                  console.log("bbb");
                } else {
                  this.quill.format("image", false);
                  console.log("aaa");
                }
              },
            },
          },
        },
      },
      newId: "",
      imageUrl: "", //添加资讯封面url
      addInfoTitle: "", //添加资讯标题
      addInfoSource: "", //添加资讯来源
      addInfoHeadline: "", //添加资讯摘要
      addInfoContent: "", //添加资讯内容
      updateInfoSource: "",
      addInfoDialog: false, //新增资讯弹窗
      editorInfoDialog: false, //编辑/详情弹窗
      infoExamine: "", //资讯审核
      infoSource: "", //资讯来源
      infoTitle: "", // 搜索资讯标题
      infoStatusValue: "",
      infoStatusFound: "",
      infoList: [], //资讯列表
      infoStatus: [
        //搜索资讯状态
        {
          value: "1",
          label: "已上架",
        },
        {
          value: "2",
          label: "已下架",
        },
        {
          value: "3",
          label: "已删除",
        },
      ],
      // 列表数据
      page: 1,
      size: 10,
      total: 0,
      currentPage: 1,
      imagesContent: "",
    };
  },
  methods: {
    //富文本编辑器图片上传
    uploadContent(optionImg) {
      oss.ossUploadFile(optionImg, "goodsImg");
    },
    //富文本编辑器图片上传
    handleAvatarSuccessContent(res, file) {
      res;
      const loading = this.$loading({
        lock: true,
        text: "上传中···",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      this.imagesContent = res.filePath + res.name;
      let quill = this.$refs["myQuillEditor"].quill;
      let length = quill.getSelection().index;
      quill.insertEmbed(length, "image", res.filePath + res.name);
      quill.setSelection(length + 1);
      // 关闭上传动画
      loading.close();
    },
    deleteImage() {
      this.imageUrl = "";
    },
    upload(optionImg) {
      ("2222");
      // ("???", optionImg);
      oss.ossUploadFile(optionImg, "goodsImg");
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = res.filePath + res.name;
    },
    //确定修改资讯
    updateInfoClick() {
      if (
        // this.addInfoContent == "" ||
        // this.addInfoSource == "" ||
        // this.addInfoContent == ""
        false
      ) {
        this.$message({
          type: "error",
          message: "请输入资讯相关内容!",
        });
      } else {
        $.ajax({
          url: baseUrl + "/news/v1/update",
          data: {
            newsId: this.newId,
            title: this.addInfoTitle,
            content: this.updateInfoSource,
            source: this.addInfoSource,
            headline: this.addInfoHeadline,
            coverUrl: this.imageUrl,
          },
          type: "post",
          dataType: "json",
          success: (data) => {
            if (data.status == "success") {
              this.$message({
                type: "success",
                message: "修改成功！",
              });
              this.editorInfoDialog = false;
              this.getInfoList();
            }
          },
        });
      }
    },
    //编辑/详情打开弹窗
    editorInfoClick(row) {
      row;
      this.newId = row.newsId;
      this.editorInfoDialog = true;
      this.addInfoTitle = row.title;
      this.updateInfoSource = row.content;
      this.addInfoSource = row.source;
      this.imageUrl = row.coverUrl;
      this.addInfoHeadline = row.headline;
    },
    //确定添加新资讯
    addInfoClick() {
      if (
        this.addInfoContent == "" ||
        this.addInfoSource == "" ||
        this.addInfoContent == ""
      ) {
        this.$message({
          type: "error",
          message: "请输入新增资讯相关内容!",
        });
      } else {
        $.ajax({
          url: baseUrl + "/news/v1/add",
          data: {
            title: this.addInfoTitle,
            content: this.addInfoContent,
            source: this.addInfoSource,
            coverUrl: this.imageUrl,
            vLogUrl: "",
            headline: this.addInfoHeadline,
          },
          type: "post",
          dataType: "json",
          success: (data) => {
            if (data.status == "success") {
              this.$message({
                type: "success",
                message: "操作成功！",
              });
              this.addInfoDialog = false;
              this.getInfoList();
            }
          },
        });
      }
    },
    //新增咨询
    addInfoButton() {
      this.newId = "";
      this.addInfoTitle = "";
      this.addInfoContent = "";
      this.addInfoSource = "";
      this.imageUrl = "";
      this.addInfoHeadline = "";
      this.addInfoDialog = true;
    },
    //删除资讯
    deleteIfon(id, type) {
      this.$confirm("是否删除该条服务信息？", "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "彻底删除",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          $.ajax({
            url: baseUrl + "/news/v1/delete",
            data: {
              ids: id,
              status: 3,
            },
            type: "post",
            dataType: "json",
            success: (data) => {
              if (data.status == "success") {
                this.getInfoList();
              }
            },
          });
        })
        .catch(() => {
          this.$message({
            type: "success",
            message: "操作成功！",
          });
          $.ajax({
            url: baseUrl + "/news/v1/delete",
            data: {
              ids: id,
            },
            type: "post",
            dataType: "json",
            success: (data) => {
              if (data.status == "success") {
                this.getInfoList();
              }
            },
          });
        });
    },
    //上下架资讯
    groundingInfoClick(id, type) {
      if (type == 1) {
        this.infoStatusFound = 2;
      } else if (type == 2) {
        this.infoStatusFound = 1;
      } else {
        this.infoStatusFound = 2;
      }
      this.$confirm("是否对该广告进行操作？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          $.ajax({
            url: baseUrl + "/news/v1/status",
            data: {
              newsId: id,
              status: this.infoStatusFound,
            },
            type: "post",
            dataType: "json",
            success: (data) => {
              if (data.status == "success") {
                this.getInfoList();
              }
            },
          });
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "取消操作！",
          });
        });
    },
    //分页方法
    handleSizeChange(val) {
      this.size = val;
      this.getInfoList();
    },
    //分页方法
    handleCurrentChange(val) {
      this.page = val;
      this.getInfoList();
    },
    // 清空筛选条件
    findResetting() {
      this.infoTitle = "";
      this.infoStatusValue = "";
      this.getInfoList();
    },
    // 确定筛选
    findInfo() {
      this.getInfoList();
    },
    // 获取数据
    getInfoList() {
      $.ajax({
        url: baseUrl + "/news/v1/getNews",
        data: {
          page: this.page,
          size: this.size,
          type: 1,
          examine: this.infoExamine,
          source: this.infoSource,
          title: this.infoTitle,
          status: this.infoStatusValue,
        },
        type: "post",
        dataType: "json",
        success: (data) => {
          this.infoList = data.data;
          this.total = data.total;
        },
      });
    },
  },
  created() {
    this.getInfoList();
  },
};
</script>

<style>
.quill-editor {
  height: 200px !important;
  margin-bottom: 70px !important;
}
.imageUrl {
  width: 148px;
  height: 148px;
}
.quill-left {
  width: 100%;
  margin-top: 15px;
}
.addInfoContent {
  width: 100%;
}
.info-span {
  font-size: 18px;
}
.info-file {
  float: left;
  width: 25%;
}
.info-content {
  float: left;
  width: 75%;
}
.essential-info {
  width: 100%;
  text-align: center;
  overflow: hidden;
}
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
