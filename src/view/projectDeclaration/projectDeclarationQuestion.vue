<template>
  <div class="intellect-content">
    <div class="top-menu">
      <el-menu
        :default-active="questionType"
        class="el-menu-demo"
        mode="horizontal"
        @select="serviceMenu"
      >
        <el-menu-item index="0">科信厅</el-menu-item>
        <el-menu-item index="1">工信厅</el-menu-item>
        <el-menu-item index="2">发改委</el-menu-item>
      </el-menu>
    </div>
    <div class="content-addOrDelete">
      <el-button type="primary" style="width: 100px" @click="addQuestionButton"
        >新增</el-button
      >
      <el-button type="success" style="width: 130px" @click="addAmountButton"
        >设置阈值</el-button
      >
    </div>
    <div class="content-list">
      <el-table
        :data="qusetionList"
        style="width: 100%"
        :border="true"
        align="center"
        :header-cell-style="{ background: '#eef7fe', color: '#006eab' }"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-table
              :data="scope.row.answers"
              style="width: 90%; margin-left:5%"
              :border="true"
              align="center"
              :header-cell-style="{ background: '#eef7fe', color: '#006eab' }"
            >
              <el-table-column
                prop="answerContent"
                label="题目标题"
                align="center"
              >
              </el-table-column>
              <el-table-column prop="score" label="题目得分" align="center">
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="创建时间"
                align="center"
              >
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="题目标题" prop="titleContent">
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="success"
              @click="updateQuestionButton(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="deleteQuestionButton(scope.row.titleId)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="content-page" :show-overflow-tooltip="true">
      <span
        >总题数：<span style="color: red">{{ questionSum }}</span></span
      >
    </div>
    <!-- 新增题目弹窗 -->
    <el-dialog
      title="新增题目"
      :visible.sync="addQuestionDialog"
      width="50%"
      :close-on-click-modal="false"
    >
      <div>
        <el-input
          v-model="questionName"
          placeholder="请输入题目标题"
          style="width: 35%"
        ></el-input>
        <el-input
          v-model="questionSort"
          placeholder="请输入题目顺序"
          style="width: 17.5%; margin-left:10px"
        ></el-input>
        <el-select
          v-model="questionValue"
          placeholder="请选择题目所属类别"
          style="width:17.5%; margin-left:10px"
        >
          <el-option
            v-for="item in questionTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button
          type="warning"
          icon="el-icon-plus"
          @click="addOption"
          style="margin-left: 10px; border-radius: 20px;"
          size="small"
          >新增选项</el-button
        >
        <template v-if="options != 0">
          <el-button
            type="danger"
            icon="el-icon-minus"
            @click="deleteOption"
            style="border-radius: 20px;"
            size="small"
            >删除选项</el-button
          >
        </template>
      </div>
      <!-- 添加选项 -->
      <template v-for="(item, index) in optionDiv">
        <div style="margin-top:10px" :key="index">
          <input
            class="option-input"
            :value="item.answerId"
            :id="'id' + index"
            style="display: none;"
          />
          <input
            class="option-input"
            placeholder="请输入选项"
            :id="'option' + index"
          />
          <input
            class="option-input"
            placeholder="请输入分数"
            :id="'score' + index"
            style="margin-left: 10px; width: 36.5%"
          />
        </div>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addQuestionDialog = false">取 消</el-button>
        <el-button type="primary" @click="addQuestionClick">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改题目弹窗 -->
    <el-dialog
      title="新增题目"
      :visible.sync="updateQuestionDialog"
      width="50%"
      :close-on-click-modal="false"
    >
      <div>
        <el-input
          v-model="questionName"
          placeholder="请输入题目标题"
          style="width: 35%"
        ></el-input>
        <el-input
          v-model="questionSort"
          placeholder="请输入题目顺序"
          style="width: 17.5%; margin-left:10px"
        ></el-input>
        <el-select
          v-model="questionValue"
          placeholder="请选择题目所属类别"
          style="width:17.5%; margin-left:10px"
        >
          <el-option
            v-for="item in questionTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button
          type="warning"
          icon="el-icon-plus"
          @click="addOption"
          style="margin-left: 10px; border-radius: 20px;"
          size="small"
          >新增选项</el-button
        >
      </div>
      <!-- 修改选项 -->
      <template v-for="(item, index) in optionDiv">
        <div style="margin-top:10px" :key="index">
          <input
            v-model="item.answerContent"
            class="option-input"
            :id="'option' + index"
          />
          <input
            class="option-input"
            v-model="item.score"
            :id="'score' + index"
            style="margin-left: 10px; width: 36.5%"
          />
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            @click="deleteOptionById(index)"
            size="small"
            style="margin-left: 10px"
          ></el-button>
        </div>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateQuestionDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateQuestionClick">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 阈值列表弹窗 -->
    <el-dialog
      title="新增贷款额度"
      :visible.sync="addAmountDialog"
      width="50%"
      :close-on-click-modal="false"
    >
      <div>
        <el-button type="success" @click="addLoanButton">新增阈值</el-button>
      </div>
      <div style="margin-top: 10px">
        <el-table
          :data="amountList"
          style="width: 100%"
          :border="true"
          :header-cell-style="{ background: '#eef7fe', color: '#006eab' }"
        >
          <el-table-column prop="minScore" label="最小阈值(分)" align="center">
          </el-table-column>
          <el-table-column prop="maxScore" label="最大阈值(分)" align="center">
          </el-table-column>
          <el-table-column prop="typeName" label="阈值类型" align="center">
          </el-table-column>
          <el-table-column prop="amount" label="阈值额度" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                @click="editorLoanButton(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                size="small"
                @click="deleteEditor(scope.row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addAmountDialog = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 阈值新增弹窗 -->
    <el-dialog title="新增阈值" :visible.sync="addLoanDialog" width="30%" :close-on-click-modal="false">
      <div>
        <el-input placeholder="最低阈值" v-model="amountMin" style="width: 30%">
          <template slot="append">分</template>
        </el-input>
        -
        <el-input placeholder="最高阈值" v-model="amountMax" style="width: 30%">
          <template slot="append">分</template>
        </el-input>
        -
        <el-input placeholder="阈值额度" v-model="amountSum" style="width: 30%">
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addLoanDialog = false">取 消</el-button>
        <el-button type="primary" @click="addAmountClick">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑阈值额度 -->
    <el-dialog title="修改阈值" :visible.sync="editorLoanDialog" width="30%">
      <div>
        <el-input
          placeholder="请输入最低阈值"
          v-model="editorLoanMin"
          style="width: 30%"
        >
          <template slot="append">分</template>
        </el-input>
        -
        <el-input
          placeholder="请输入最高阈值"
          v-model="editorLoanMax"
          style="width: 30%"
        >
          <template slot="append">分</template>
        </el-input>
        -
        <el-input
          placeholder="请输入阈值额度"
          v-model="editorLoan"
          style="width: 30%"
        >
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editorLoanDialog = false">取 消</el-button>
        <el-button type="primary" @click="editorLoanClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { baseUrl } from '../../components/utils/ajaxPath';
export default {
  data() {
    return {
      editorLoanMin: "",
      editorLoanMax: "",
      editorLoan: "",
      editorLoanId: "",
      editorLoanDialog: false,
      addLoanDialog: false,
      amountMin: "",
      amountMax: "",
      amountSum: "",
      addAmountDialog: false,
      questionId: "",
      updateQuestionDialog: false,
      optionOrScore: [], //题目选项及分数
      options: 0, //题目选项div
      optionDiv: [], //题目选项生成div
      questionName: "", //题目标题
      questionSort: "", //题目顺序
      questionValue: "", //题目类别
      questionTypes: [
        //题目类别下拉选
        { label: "科信厅", value: 0 },
        { label: "工信厅", value: 1 },
        { label: "发改委", value: 2 }
      ],
      addQuestionDialog: false,
      questionType: "0",
      questionSum: "",
      questionIdSum: 0,
      questionTitle: "", //筛选题目标题
      questionTime: "", //筛选时间
      qusetionList: [], //列表数据
      amountList: [],
      loanMin: 0,
      loanMax: 0
    };
  },
  methods: {
    //新增阈值
    addLoanButton() {
      this.amountMin = "";
      this.amountMax = "";
      this.amountSum = "";
      this.addLoanDialog = true;
    },
    //修改阈值
    editorLoanClick() {
      var data = {
        amountId: this.editorLoanId,
        type: this.questionType,
        minScore: this.editorLoanMin,
        maxScore: this.editorLoanMax,
        amount: this.editorLoan
      };
      $.ajax({
        url: baseUrl+"/type-amount/v1/update",
        data: data,
        type: "post",
        dataType: "json",
        success: data => {
          if (data.status == "success") {
            this.$message({
              type: "success",
              message: "修改成功!"
            });
            this.editorLoanDialog = false;
            this.getAmount();
          }
        }
      });
    },
    //编辑阈值额度
    editorLoanButton(row) {
      this.editorLoanMin = row.minScore;
      this.editorLoanMax = row.maxScore;
      this.editorLoan = row.amount;
      this.editorLoanId = row.id;
      this.editorLoanDialog = true;
    },
    //删除阈值额度
    deleteEditor(id) {
      $.ajax({
        url: baseUrl+"/type-amount/v1/delete",
        data: { ids: id },
        type: "post",
        dataType: "json",
        success: data => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.getAmount();
        }
      });
    },
    //新增贷款额度
    addAmountClick() {
      var typeName = "";
      if (this.questionType == 0) {
        typeName = "科技厅";
      } else if (this.questionType == 1) {
        typeName = "工信厅";
      } else {
        typeName = "发改委";
      }
      var data = {
        type: this.questionType,
        typeName: typeName,
        minScore: this.amountMin,
        maxScore: this.amountMax,
        amount: this.amountSum
      };
      $.ajax({
        url: baseUrl+"/type-amount/v1/add",
        data: data,
        type: "post",
        dataType: "json",
        success: data => {
          if (data.status == "success") {
            this.$message({
              type: "success",
              message: "新增成功!"
            });
            this.getAmount();
            this.addLoanDialog = false;
          } else {
            this.$message({
              type: "success",
              message: "新增失败，请联系管理员!"
            });
          }
        }
      });
    },
    //阈值列表弹窗
    addAmountButton() {
      this.addAmountDialog = true;
    },
    deleteOptionById(index) {
      this.optionDiv.splice(index, 1);
    },
    //删除题目
    deleteQuestionButton(id) {
      this.$confirm("是否删除改题目？", "提示", {
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
            url: baseUrl+"/title/v1/delete",
            data: {
              ids: id
            },
            type: "post",
            dataType: "json",
            success: data => {
              this.getQuestionList();
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
    //确定修改题目
    updateQuestionClick() {
      this.getQuestionList();
      this.optionOrScore = [];
      for (var i = 0; i < this.optionDiv.length; i++) {
        this.optionOrScore.push({
          answerContent: $("#option" + i).val(),
          score: $("#score" + i).val()
        });
      }
      var data = {
        titleId: this.questionId,
        type: this.questionValue,
        sort: this.questionSort,
        titleContent: this.questionName,
        answers: JSON.stringify(this.optionOrScore)
      };
      $.ajax({
        url: baseUrl+"/title/v1/update",
        data: data,
        type: "post",
        dataType: "json",
        success: data => {
          if (data.status == "success") {
            this.$message({
              type: "success",
              message: "修改成功!"
            });
            this.getQuestionList();
            this.updateQuestionDialog = false;
          } else {
            this.$message({
              type: "success",
              message: "修改失败，请联系管理员!"
            });
          }
        }
      });
    },
    //修改题目弹窗
    updateQuestionButton(row) {
      this.getQuestionList();
      this.questionId = row.titleId;
      this.questionName = row.titleContent;
      this.questionSort = row.sort;
      this.questionValue = row.type;
      this.optionDiv = row.answers;
      this.options = row.answers.length;
      this.updateQuestionDialog = true;
    },
    //添加题目
    addQuestionClick() {
      for (var i = 0; i < this.optionDiv.length; i++) {
        this.optionOrScore.push({
          answerId: $("#id" + i).val(),
          answerContent: $("#option" + i).val(),
          score: $("#score" + i).val()
        });
      }
      $.ajax({
        url: baseUrl+"/title/v1/add",
        data: {
          type: this.questionValue,
          sort: this.questionSort,
          titleContent: this.questionName,
          answers: JSON.stringify(this.optionOrScore)
        },
        type: "post",
        dataType: "json",
        success: data => {
          if (data.status == "success") {
            this.$message({
              type: "success",
              message: "添加成功!"
            });
            this.getQuestionList();
            this.addQuestionDialog = false;
          } else {
            this.$message({
              type: "success",
              message: "添加失败，请联系管理员!"
            });
          }
        }
      });
    },
    //新增选项
    addOption() {
      this.optionDiv.push(this.options++);
    },
    //删除选项
    deleteOption() {
      this.optionDiv.pop(this.options);
      this.options--;
    },
    //新增题目按钮
    addQuestionButton() {
      this.optionOrScore = [];
      this.options = 0;
      this.optionDiv = [];
      this.questionName = "";
      this.questionSort = "";
      this.questionValue = "";
      this.addQuestionDialog = true;
    },
    getQuestionIDSum() {},
    //获取区间贷款额度
    getAmount() {
      $.ajax({
        url: baseUrl+"/type-amount/v1/list",
        data: {
          type: this.questionType
        },
        type: "post",
        dataType: "json",
        success: data => {
          this.amountList = data.data.reverse();
        }
      });
    },
    //题目类别
    serviceMenu(type) {
      this.questionTitle = "";
      this.questionTime = "";
      this.questionType = type;
      this.getQuestionList();
      this.getAmount();
    },
    //获取列表数据
    getQuestionList() {
      $.ajax({
        url: baseUrl+"/title/v1/titles",
        data: {
          type: this.questionType
        },
        type: "post",
        dataType: "json",
        success: data => {
          (data);
          this.qusetionList = data.data;
          this.questionSum = data.data.length;
          // this.questionIdSum = 0;
          // var data = [];
          // var min = 0;
          // var max = 0;
          // let t = 0;
          // for (var i = 0; i < this.qusetionList.length; i++) {
          //   data.push(this.qusetionList[i].answers);
          // }
          // for (var i = 0; i < data.length; i++) {
          //   this.loanMax += data[i][0].score;
          //   // t = data[i][0].score;
          //   // for (var j = 0; j < data[i].length; j++) {
          //   //   if (t > data[i][j].score) {
          //   //     t = data[i][j].score;
          //   //   }
          //   // }
          //   this.loanMin += data[i][data[i].length - 1].score;
          // }
        }
      });
    }
  },
  created() {
    this.getQuestionList();
    this.getAmount();
  }
};
</script>

<style>
.option-input:hover {
  border-color: #c0c4cc;
}
.option-input {
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
  width: 35%;
}
.top-menu {
  margin-left: 2%;
}
.question-score {
  float: left;
  width: 33%;
}
.question-createTime {
  float: left;
  width: 33%;
}
.question-answerContent {
  float: left;
  width: 33%;
}
.question-answers {
  overflow: hidden;
  width: 100%;
}
.content-page {
  margin-left: 2%;
  padding-top: 20px;
  width: 100%;
}
.content-list {
  margin-left: 2%;
  padding-top: 20px;
}
.content-addOrDelete {
  margin-left: 2%;
  padding-top: 20px;
}
.menu-span {
  font-size: 16px;
}
.content-find {
  margin-left: 2%;
  padding-top: 20px;
}
.intellect-content {
  width: 100%;
  height: 98%;
  background: #fff;
  margin-top: 0.5%;
}
</style>
