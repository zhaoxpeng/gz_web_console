<template>
  <div class="intellect-content">
    <div class="top-menu">
      <el-menu
        :default-active="topActive"
        class="el-menu-demo"
        mode="horizontal"
        @select="serviceMenu"
      >
        <el-menu-item index="0">专利服务</el-menu-item>
        <el-menu-item index="1">商标服务</el-menu-item>
        <el-menu-item index="2">版权服务</el-menu-item>
        <el-menu-item index="3">法律服务</el-menu-item>
        <el-menu-item index="4">资质认定</el-menu-item>
        <el-menu-item index="5">评估分析</el-menu-item>
      </el-menu>
    </div>
    <div class="content-find">
      <el-input
        v-model="serviceName"
        placeholder="名称筛选"
        style="width: 300px"
      ></el-input>
      <template>
        <el-select
          v-model="statusType"
          clearable
          placeholder="请选择"
          style="width: 200px; margin-left: 10px"
        >
          <el-option
            v-for="item in serviceType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </template>
      <el-button
        type="primary"
        style="width: 100px; margin-left: 60px"
        @click="findService"
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
      <el-button type="primary" style="width: 100px" @click="addService"
        >新增服务</el-button
      >
    </div>
    <div class="content-list">
      <el-table
        ref="multipleTable"
        :data="serviceList"
        tooltip-effect="dark"
        style="width: 98%"
        :border="true"
        :header-cell-style="{ background: '#eef7fe', color: '#006eab' }"
      >
        <el-table-column type="index" label="序号" width="60" align="center">
        </el-table-column>
        <el-table-column
          prop="goodsName"
          label="服务名称"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column prop="price" label="价格" align="center">
        </el-table-column>
        <el-table-column prop="summary" label="摘要" align="center">
        </el-table-column>
        <template v-if="topActive == '0'">
          <el-table-column prop="stype" label="二级分类" align="center">
          </el-table-column>
        </template>
        <el-table-column
          prop="picture"
          label="图片"
          align="center"
          width="200px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <el-image
              style="width: 60%; height: 40px"
              :src="scope.row.listicon"
              :preview-src-list="[scope.row.listicon]"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.status == 1">
              已上架
            </p>
            <p v-if="scope.row.status == 2">
              已下架
            </p>
            <p v-if="scope.row.status == 3">
              已删除
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status == 2"
              size="small"
              @click="
                groundingServiceClick(scope.row.goodsId, scope.row.status)
              "
              type="primary"
              >上架</el-button
            >
            <el-button
              v-if="scope.row.status == 1"
              size="small"
              @click="
                groundingServiceClick(scope.row.goodsId, scope.row.status)
              "
              type="warning"
              >下架</el-button
            >
            <el-button
              v-if="scope.row.status == 3"
              size="small"
              @click="
                groundingServiceClick(scope.row.goodsId, scope.row.status)
              "
              type="info"
              >恢复</el-button
            >
            <el-button
              size="small"
              @click="updateService(scope.row)"
              type="primary"
              >详情</el-button
            >
            <el-button
              size="small"
              @click="deleteService(scope.row.goodsId, scope.row.status)"
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
    <!-- 新增服务弹窗 -->
    <el-dialog
      title="新增服务"
      :visible.sync="addServiceDialog"
      width="90%"
      :close-on-click-modal="false"
    >
      <div class="add-servicesDialog">
        <!-- 新增服务基本信息 -->
        <div class="addService-left">
          <div style="margin-top:10px">
            <el-input
              v-model="addGoodsName"
              placeholder="请输入服务名称"
              style="width:49%"
            >
            <span slot="prepend">服务名称：</span>
            </el-input>
            <el-input
              v-model="addGoodsPrice"
              placeholder="请输入服务预估价格"
              style="width:49%"
            >
            <span slot="prepend">服务预估价格：</span>
            </el-input>
          </div>
          <div class="service-type">
            <el-input
              v-show="topActive == 0"
              type="text"
              placeholder="请输入服务小类"
              v-model="addServicesType"
            >
            <span slot="prepend">服务小类：</span>
            </el-input>
          </div>
          <div class="left-quill">
            服务摘要：
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入服务摘要"
              v-model="addServiceSummary"
            >

            </el-input>
          </div>
          <div style="margin-top: 10px;">
            <span>点击上传列表图片</span>
            <el-upload
              action="string"
              list-type="picture-card"
              :http-request="uploadList"
              :on-success="handleAvatarSuccessList"
              :limit="1"
              ref='uploadfiles1'
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
          <div style="margin-top:10px">
            <span>点击上传顶部图片</span>
            <el-upload
              action="string"
              list-type="picture-card"
              :http-request="upload"
              :on-success="handleAvatarSuccess"
              :limit="1"
              ref='uploadfiles2'
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
          <div style="margin-top:10px">
            <span>点击上传详情图片</span>
            <el-upload
              action="string"
              list-type="picture-card"
              :http-request="uploadIcon"
              :on-success="handleAvatarSuccessIcon"
              :limit="99"
              ref='uploadfiles3'
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </div>
        <!-- 新增服务规格 -->
        <div class="addService-right">
          <!-- 一级服务规格 -->
          <div>
            <el-input
              v-model="serviceTitleName"
              placeholder="请填写服务类型！"
              style="width:250px"
            ></el-input>
            <el-button
              type="success"
              icon="el-icon-circle-plus-outline"
              style="margin-left: 20px"
              size="medium"
              @click="newAddServiceClick"
              >新增类型</el-button
            >
          </div>
          <!-- 新增服务 -->
          <div>
            <el-tree
              :data="serviceDataTree"
              node-key="id"
              default-expand-all
              :expand-on-click-node="false"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <template v-if="data.tagName != ''">
                  <span class="label">类型：{{ data.tagName }}</span>
                </template>
                <!-- <div class="text"> -->
                <template v-if="data.kindName != ''">
                  <span class="spaces">规格：{{ data.kindName }}</span>
                </template>
                <template v-if="data.kindPrice != ''">
                  <span class="price">价格：{{ data.kindPrice }}</span>
                </template>
                <!-- </div> -->
                <span>
                  <template v-if="data.type == 1">
                    <el-button
                      type="text"
                      size="mini"
                      @click="() => appendSpaces(node, data)"
                    >
                      新增规格
                    </el-button>
                  </template>
                  <template v-if="data.type == 2">
                    <el-button
                      type="text"
                      size="mini"
                      @click="() => appendType(node, data)"
                    >
                      新增类型
                    </el-button>
                  </template>
                  <el-button
                    type="text"
                    size="mini"
                    @click="() => remove(node, data)"
                  >
                    删除
                  </el-button>
                </span>
              </span>
            </el-tree>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addServiceDialog = false">取 消</el-button>
        <el-button type="primary" @click="addServiceSpecClick">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增规格弹窗 -->
    <el-dialog
      title="新增规格"
      :visible.sync="inputSpace"
      width="20%"
      :close-on-click-modal="false"
    >
      <el-input
        v-model="serviceSpaces"
        placeholder="请输入服务规格"
        style="margin-top:10px"
      >
      <span slot="prepend">服务规格：</span>
      </el-input>
      <div style="margin-top: 10px">是否输入价格：</div>
      <el-select
        v-model="servicePriceValue"
        placeholder="请选择是否输入价格"
        style="margin-top: 10px; width: 100%"
      >      
        <el-option
          v-for="item in servicePriceType"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <template v-if="servicePriceValue == 1">
        <el-input
          v-model="servicePrice"
          placeholder="请输入服务价格"
          style="margin-top:10px"
        >
        <span slot="prepend">服务价格：</span>
        </el-input>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="inputSpace = false">取 消</el-button>
        <el-button type="primary" @click="addSpacesOk(1)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增类型弹窗 -->
    <el-dialog
      title="新增类型"
      :visible.sync="inputType"
      width="20%"
      :close-on-click-modal="false"
    >
      <el-input
        v-model="serviceTitleName"
        placeholder="请输入服务类型"
        style="margin-top:10px"
      >
      <span slot="prepend">服务类型:</span></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="inputType = false">取 消</el-button>
        <el-button type="primary" @click="addSpacesOk(2)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改服务弹窗 -->
    <el-dialog
      title="编辑服务"
      :visible.sync="updateServiceDialog"
      width="90%"
      :close-on-click-modal="false"
    >
      <div class="add-servicesDialog">
        <!-- 新增服务基本信息 -->
        <div class="addService-left">
          <div style="margin-top:10px">
            <el-input
              v-model="update.updateServiceName"
              placeholder="请输入服务名称"
              style="width:49%"
            >
            <span slot="prepend">服务名称：</span>
            </el-input>
            <el-input
              v-model="update.updateServicePrice"
              placeholder="请输入服务预估价格"
              style="width:49%"
            >
            <span slot="prepend">服务预估价格：</span></el-input>
          </div>
          
          <div class="service-type">
            <el-input
              v-show="topActive == 0"
              type="text"
              placeholder="请输入服务小类"
              v-model="update.updateStype"
            >
             <span slot="prepend">服务小类：</span>
            </el-input>
          </div>
          <div class="left-quill">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入服务摘要"
              v-model="update.updateServiceSummary"
            >
            </el-input>
          </div>
          <div style="margin-top: 10px;">
            <span>点击上传列表图片</span>
            <br />
            <!-- <template v-if="update.updateServiceListImage == ''"> -->
            <el-upload
              action="string"
              list-type="picture-card"
              :http-request="uploadList"
              :on-success="handleAvatarSuccessList"
              :limit="1"
              :file-list="update.updateServiceListImage"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <!-- </template> -->
            <!-- <template v-if="update.updateServiceListImage != ''"> -->
            <!-- <el-image
                style="width: 148px; height: 148px"
                :src="update.updateServiceListImage"
              >
              </el-image> -->
            <!-- </template> -->
          </div>
          <div style="margin-top:10px">
            <span>点击上传顶部图片</span>
            <el-upload
              action="string"
              list-type="picture-card"
              :http-request="upload"
              :on-success="handleAvatarSuccess"
              :file-list="update.updateServiceTopImage"
              :limit="1"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
          <div style="margin-top:10px">
            <span>点击上传详情图片</span>
            <el-upload
              action="string"
              list-type="picture-card"
              :http-request="uploadIcon"
              :on-success="handleAvatarSuccessIcon"
              :limit="99"
              :file-list="update.updateServiceContentImages"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </div>
        <!-- 新增服务规格 -->
        <div class="addService-right">
          <!-- 一级服务规格 -->
          <div>
            <el-input
              v-model="serviceTitleName"
              placeholder="请填写服务类型！"
              style="width:250px"
            ></el-input>
            <el-button
              type="success"
              icon="el-icon-circle-plus-outline"
              style="margin-left: 20px"
              size="medium"
              @click="newAddServiceClick"
              >新增类型</el-button
            >
          </div>
          <!-- 新增服务 -->
          <div>
            <el-tree
              :data="update.updateServiceTree"
              node-key="id"
              default-expand-all
              :expand-on-click-node="false"
            >
              <span class="custom-tree-node" slot-scope="{ data }">
                <template v-if="data.tagName != ''">
                  <span class="label">类型：{{ data.tagName }}</span>
                </template>
                <div class="text">
                  <template v-if="data.kindName != ''">
                    <span class="spaces">规格：{{ data.kindName }}</span>
                  </template>
                  <template v-if="data.kindPrice != ''">
                    <span class="price">价格：{{ data.kindPrice }}</span>
                  </template>
                </div>
                <span>
                  <!-- <template v-if="data.type == 1">
                    <el-button
                      type="text"
                      size="mini"
                      @click="() => appendSpaces(node, data)"
                    >
                      新增规格
                    </el-button>
                  </template>
                  <template v-if="data.type == 2">
                    <el-button
                      type="text"
                      size="mini"
                      @click="() => appendType(node, data)"
                    >
                      新增类型
                    </el-button>
                  </template>
                  <el-button
                    type="text"
                    size="mini"
                    @click="() => remove(node, data)"
                  >
                    删除
                  </el-button> -->
                </span>
              </span>
            </el-tree>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateServiceDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateServiceDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
import oss from "../../components/utils/aliOss";
import { baseUrl } from "../../components/utils/ajaxPath"

export default {
  components: {
    quillEditor
  },
  data() {
    return {
      //修改服务弹窗
      updateServiceDialog: false,
      //修改服务参数
      update: {
        updateServiceId: "", //服务id
        updateServiceName: "", //服务名称
        updateServicePrice: "", //服务金额
        updateServiceSummary: "", //服务摘要
        updateServiceListImage: [], //服务列表图片
        updateServiceTopImage: [], //服务顶部图片
        updateServiceContentImage: [], //服务详情图片字符串
        updateServiceContentImages: [], //服务详情图片列表
        updateKindStr: "", //服务树数据字符串
        updateServiceTree: [{}], //服务树数据集合
        updateType: "", //服务类别
        updateStype: "" //服务小类
      },
      content: "请输入服务内容！",
      editorOption: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], // toggled buttons
            ["blockquote", "code-block"]
          ]
        }
      },
      servicePriceType: [
        { label: "是", value: 1 },
        { label: "否", value: 2 }
      ],
      servicePriceValue: "",
      serviceData: null,
      serviceDataTreeId: 0,
      serviceSpaces: "",
      servicePrice: "",
      inputSpace: false,
      inputType: false,
      serviceTitleName: "",
      serviceDataTree: [],
      addGoodsName: "",
      addGoodsPrice: "",
      addServiceContent: "",
      addServiceSummary: "",
      addServicesType: "",
      addServiceTypeValue: "",
      addServiceType: [
        {
          label: "专利服务",
          value: "0"
        },
        {
          label: "商标服务",
          value: "1"
        },
        {
          label: "版权服务",
          value: "2"
        },
        {
          label: "法律服务",
          value: "3"
        },
        {
          label: "资质认定",
          value: "4"
        },
        {
          label: "评估分析",
          value: "5"
        }
      ],
      addServiceDialog: false,
      serviceId: "",
      statusType: "",
      statusTypeFound: "",
      statusTypeDelete: "",
      serviceType: [
        {
          value: "1",
          label: "已上架"
        },
        {
          value: "2",
          label: "已下架"
        },
        {
          value: "3",
          label: "已删除"
        }
      ],
      serviceName: "",
      topActive: "0",
      serviceList: [],
      page: 1,
      size: 10,
      total: 0,
      currentPage: 1,
      contentImagesList: [], //内容图片
      contentImagesString: "",
      listImage: "", //列表图片
      covreImage: "" //详情图片
    };
  },
  methods: {
    //编辑服务弹窗
    updateService(row) {
      this.update = {}
      // console.log(row);
      this.update.updateServiceId = row.goodsId;
      this.update.updateServiceName = row.goodsName;
      this.update.updateServicePrice = row.price;
      this.update.updateServiceSummary = row.summary;
      this.update.updateServiceListImage = []
      this.update.updateServiceTopImage=[]
      this.update.updateServiceListImage.push({ url: row.listicon });
      this.update.updateServiceTopImage.push({ url: row.picture });
      this.update.updateServiceContentImage = row.content.split(",");
      this.update.updateServiceContentImages=[]
      for (let i in this.update.updateServiceContentImage) {
        this.update.updateServiceContentImages.push({
          url: this.update.updateServiceContentImage[i]
        });
      }
      this.update.updateServiceTree = JSON.parse(row.kindStr);
      // console.log(this.update.updateServiceTree);
      this.update.updateStype = row.stype;
      this.updateServiceDialog = true;
    },
    //转换字符串
    getString(arr) {
      for (var i = 0; i < arr.length; i++) {
        this.contentImagesString += arr[i].file;
        if (i != arr.length - 1) {
          this.contentImagesString += ",";
        }
      }
    },
    // 内容图片 多张
    uploadIcon(optionImg) {
      oss.ossUploadFile(optionImg, "goodsImg");
    },
    handleAvatarSuccessIcon(res, file) {
      this.contentImagesList.push({ file: res.filePath + res.name });
    },
    //详情图片 一张
    upload(optionImg) {
      oss.ossUploadFile(optionImg, "goodsImg");
    },
    handleAvatarSuccess(res, file) {
      this.covreImage = res.filePath + res.name;
    },
    //列表图片 一张
    uploadList(optionImg) {
      oss.ossUploadFile(optionImg, "goodsImg");
    },
    handleAvatarSuccessList(res, file) {
      this.listImage = res.filePath + res.name;
    },
    //添加规格
    addSpacesOk(flag) {
      this.serviceData;
      var type = 1;
      if (this.serviceData.type == 1) {
        type = 2;
      } else {
        type = 1;
      }
      this.serviceTitleName;
      this.serviceSpaces;
      this.servicePrice;
      const newChild = {
        id: this.serviceDataTreeId++,
        tagName: this.serviceTitleName,
        kindName: this.serviceSpaces,
        kindPrice: this.servicePrice,
        type: type,
        children: []
      };
      if (!this.serviceData.children) {
        this.$set(this.serviceData, "children", []);
      }
      if(flag === 1 && this.serviceSpaces){
        this.serviceData.children.push(newChild);
        this.inputSpace = false;
      }else if(flag === 1 && !this.serviceSpaces){
        this.$message({
            type: "error",
            message: "表单未填写完整"
          });
      }
      if(flag === 2 && this.serviceTitleName){
        this.serviceData.children.push(newChild);
        this.inputType = false;
      }else if(flag === 2 && !this.serviceTitleName){
        this.$message({
            type: "error",
            message: "表单未填写完整"
          });
      }
      
    },
    //新增一级服务标题
    newAddServiceClick() {
      if (this.serviceTitleName == "") {
        this.$message({
          type: "error",
          message: "请输入服务标题!"
        });
      } else {
        this.serviceDataTree.push({
          id: this.serviceDataTreeId++,
          tagName: this.serviceTitleName,
          kindName: "",
          type: 1,
          kindPrice: "",
          children: []
        });
        this.serviceTitleName = "";
      }
    },
    appendSpaces(node, data) {
      this.serviceTitleName = data.tagName;
      this.serviceSpaces = "";
      this.servicePrice = "";
      this.serviceData = data;
      this.inputSpace = true;
    },
    appendType(node, data) {
      this.serviceTitleName = "";
      this.serviceSpaces = "";
      this.servicePrice = "";
      this.serviceData = data;
      this.inputType = true;
    },
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },
    // 确定添加服务
    addServiceSpecClick() {
      this.getString(this.contentImagesList);
      JSON.stringify(this.serviceDataTree);
      let data = {
        goodsName: this.addGoodsName,
        price: this.addGoodsPrice,
        content: this.contentImagesString,
        picture: this.covreImage,
        listicon: this.listImage,
        summary: this.addServiceSummary,
        kindStr: JSON.stringify(this.serviceDataTree),
        type: this.topActive,
        sType: this.addServicesType,
        kindList: JSON.stringify(this.serviceDataTree[0].children)
      };
      let that = this
      $.ajax({
        url: baseUrl+"/goods/v1/add",
        data: data,
        type: "post",
        dataType: "json",
        success: data => {
          if (data.status == "success") {
            this.$message({
              showClose: true,
              duration: 1500,
              message: "添加成功!",
              type: "success"
            });
            this.addServiceDialog = false;
            this.getServiceList();
          }
          this.addGoodsName = null
          this.addGoodsPrice = null
          this.contentImagesString = null
          this.covreImage = null
          this.listImage = null
          this.addServiceSummary = null
          this.serviceDataTree = null
          this.topActive = null
          this.addServicesType=null
        }
      });
    },
    // 上下架服务
    groundingServiceClick(id, type) {
      if (type == 1) {
        this.statusTypeFound = 2;
      } else if (type == 2) {
        this.statusTypeFound = 1;
      } else {
        this.statusTypeFound = 2;
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
            url: baseUrl+"/goods/v1/status",
            data: {
              goodsId: id,
              status: this.statusTypeFound
            },
            type: "post",
            dataType: "json",
            success: data => {
              if (data.status == "success") {
                this.getServiceList();
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
    // 切换top
    serviceMenu(type) {
      this.statusType = "";
      this.serviceName = "";
      this.topActive = type;
      this.getServiceList();
    },
    // 删除广告
    deleteService(id, type) {
      this.$confirm("是否删除该条服务信息？", "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "彻底删除",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          $.ajax({
            url: baseUrl+"/goods/v1/status",
            data: {
              goodsId: id,
              status: 3
            },
            type: "post",
            dataType: "json",
            success: data => {
              if (data.status == "success") {
                this.getServiceList();
              }
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "success",
            message: "操作成功！"
          });
          $.ajax({
            url: baseUrl+"/goods/v1/delete",
            data: {
              goodsId: id
            },
            type: "post",
            dataType: "json",
            success: data => {
              if (data.status == "success") {
                this.getServiceList();
              }
            }
          });
        });
    },
    addService() {
      this.addServiceDialog = true;
      this.$refs.uploadfiles1.clearFiles();
      this.$refs.uploadfiles2.clearFiles();
      this.$refs.uploadfiles3.clearFiles();
    },
    handleSizeChange(val) {
      this.size = val;
      this.getServiceList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getServiceList();
    },
    // 清空筛选条件
    findResetting() {
      this.statusType = "";
      this.serviceName = "";
      this.getServiceList();
    },
    // 确定筛选
    findService() {
      this.getServiceList();
    },
    // 获取数据
    getServiceList() {
      $.ajax({
        url: baseUrl+"/goods/v1/list",
        data: {
          page: this.page,
          size: this.size,
          type: 1,
          goodsName: this.serviceName,
          goodsType: this.topActive,
          status: this.statusType,
          examine: ""
        },
        type: "post",
        dataType: "json",
        success: data => {
          data;
          this.serviceList = data.data;
          this.total = data.total;
        }
      });
    }
  },
  created() {
    this.getServiceList();
  }
};
</script>

<style scoped>
.quill-right {
  float: left;
  width: 49%;
  margin-left: 5px;
}
.quill-left {
  margin-top: 0px;
  float: left;
  width: 49%;
}
.left-quill {
  margin-top: 10px;
  overflow: hidden;
  width: 98.5%;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  /* padding-right: 8px; */
}
.custom-tree-node .label {
  color: rgb(89, 123, 233);
}
.custom-tree-node .text {
  width: 42%;
  display: flex;
  justify-content: space-between;
}
.custom-tree-node .spaces {
  color: rgb(119, 236, 145);
}
.custom-tree-node .price {
  color: rgb(233, 114, 124);
}
.service-type {
  overflow: hidden;
  text-align: center;
  padding-top: 10px;
  width: 98.5%;
}
.addService-right {
  width: 50%;
  height: 100%;
  /* float: left; */
  margin-left: 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.addService-left {
  width: 50%;
  /* float: left; */
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  text-align: left;
}
.add-servicesDialog {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  justify-content: space-between;
}
.add-service-childen {
  width: 200px;
  height: 100px;
  border: 1px solid red;
}
.add-spces {
  margin-top: 10px;
  margin-left: 60px;
}
.service-spces-title {
  margin-top: 10px;
  margin-left: 40px;
}
.add-service {
  margin-top: 10px;
  margin-left: 20px;
}
.service-input {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
  width: 300px;
}
.top-menu {
  margin-left: 2%;
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
