<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 选择分类区域 -->
      <el-row class="row">
        <el-col>
          <span>选择商品分类</span>
          <el-cascader
            v-model="selectCateId"
            :options="cateList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
            }"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab标签页 -->
      <!--  activeName当前选择的页的name-->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!--动态参数面板  -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isAddButDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数信息 -->
          <el-table :data="saveGetParams" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="paramsClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="inputnewtag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editDialogopen(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--静态属性面板  -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isAddButDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性信息 -->
          <el-table :data="saveGetParams" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="paramsClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="inputnewtag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editDialogopen(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加动态属性或静态参数对话框 -->
    <el-dialog
      :title="'添加' + titleAddDialog"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <el-form
        :model="addRuleForm"
        :rules="addRuleFormRules"
        ref="addRuleFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleAddDialog" prop="attr_name">
          <el-input v-model="addRuleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog
      :title="'修改' + titleAddDialog"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form
        :model="editRuleForm"
        :rules="editRuleFormRules"
        ref="editRuleFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleAddDialog" prop="attr_name">
          <el-input v-model="editRuleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //保存获取过来的分类列表
      cateList: [],
      //联级选择框选择的分类id
      selectCateId: [],
      //tab标签当前选择页，默认第一页
      activeName: 'many',
      //保存获得的商品属性或参数信息
      saveGetParams: [],
      //控制添加参数或属性显示与吟隐藏
      addDialogVisible: false,
      //增加参数或属性的表单对象
      addRuleForm: {
        attr_name: '',
      },
      //增加表单对象的验证规则
      addRuleFormRules: {
        attr_name: [{ required: true, message: '不能为空', trigger: 'blur' }],
      },
      //控制修改对话框的显示与隐藏
      editDialogVisible: false,
      //修改表单提交数据对象
      editRuleForm: {
        attr_name: '',
      },
      //修改表单数据验证规则
      editRuleFormRules: {
        attr_name: [{ required: true, message: '不能为空', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //开局获得分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      //获取成功，保存下来
      this.cateList = res.data
      //console.log(this.cateList)
    },
    //当联级选择框发生改变，调用此函数
    handleChange() {
      //选择分类后，发动请求获取参数
      this.getParamsList()
    },
    //tab标签页发生点击，调用此函数
    handleTabClick() {
      this.getParamsList()
      //console.log(this.activeName)
    },
    //获得商品参数
    async getParamsList() {
      //先看是不是选择的三级分类商品
      if (this.selectCateId.length !== 3) {
        this.selectCateId = []
        //联级清空，下面也要清空,防止上一个残留
        this.saveGetParams = []
        this.activeName = 'many'
        return
      }
     //console.log(this.selectCateId)
      //此时已选择三级分类，获得商品参数与属性
      const {
        data: res,
      } = await this.$http.get(
        `categories/${this.selectCateId[2]}/attributes`,
        { params: { sel: this.activeName } }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品参数失败')
      }
     // console.log(res)
      //在保存前将attr_vals字符窜改为数组
      res.data.forEach((item) => {
        //先循环，在拆分
        //小bug，若attr_vals为空，split后会返回一个[''],要先判断
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        //在循环时，给每一行单独赋值inputVisible，不冲突，否则公用一个
        item.inputVisible = false
        item.inputValue = ''
      })
      //此时已拿到商品参数或属性信息，保存下来
      this.saveGetParams = res.data
    },
    //监听增加对话框关闭
    addDialogClose() {
      this.$refs.addRuleFormRef.resetFields()
    },
    //监听增加对话框提交
    async addParams() {
      //先判断是否符合提交规格
      this.$refs.addRuleFormRef.validate((vail) => {
        if (!vail) return
      })
      //请求，把三级分类id，增加的，属性还是参数，传过去
      const { data: res } = await this.$http.post(
        `categories/${this.selectCateId[2]}/attributes`,
        {
          attr_name: this.addRuleForm.attr_name,
          attr_sel: this.activeName,
        }
      )
      if (res.meta.status !== 201) {
        console.log(res)
        return this.$message.error('添加失败')
      }
      this.$message.success('添加成功')
      this.addDialogVisible = false
      this.getParamsList()
    },
    //监听修改对话框打开
    async editDialogopen(attrid) {
      const { data: res } = await this.$http.get(
        `categories/${this.selectCateId[2]}/attributes/${attrid}`,
        {
          params: { attr_sel: this.activeName },
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      //获取成功
      this.editRuleForm = res.data
      this.editDialogVisible = true
    },
    //监听修改对话框关闭
    editDialogClose() {
      this.$refs.editRuleFormRef.resetFields()
    },
    //监听修改对话框提交
    async editParams() {
      //console.log(this.editRuleForm);
      //先验证是否符合提交规则
      this.$refs.editRuleFormRef.validate((vali) => {
        if (!vali) {
          return this.$message.error('不能为空')
        }
      })
      //提交
      const { data: res } = await this.$http.put(
        `categories/${this.selectCateId[2]}/attributes/${this.editRuleForm.attr_id}`,
        {
          attr_name: this.editRuleForm.attr_name,
          attr_sel: this.activeName,
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('更新失败')
      }
      this.$message.success('更新成功')
      this.getParamsList()
      this.editDialogVisible = false
    },
    //监听删除操作
    async deleteParams(attrid) {
      //先提示
      const confirmRes = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      //console.log(confirmRes);
      if (confirmRes !== 'confirm') {
        return this.$message.info('取消删除')
      }
      //确定删除
      const { data: res } = await this.$http.delete(
        `categories/${this.selectCateId[2]}/attributes/${attrid}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getParamsList()
    },
    //按下enter，和失去焦点后触发,增加可选项
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      //必须先把添加的保存到前端里面
      row.attr_vals.push(row.inputValue.trim())
      row.inputVisible = false
      row.inputValue = ''
      //发起请求
      this.saveAttrvals(row)
    },
    //点击新增按钮，切换input
    showInput(row) {
      row.inputVisible = true
      //$nextTick函数，用于延时执行一个代码，就是寻找时机，没有的话，按钮为true了，实际上dom
      //还没有渲染，input没有，自然调不到focus
      this.$nextTick((_) => {
        //下面代码就是获得焦点
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    //删除可选项
    paramsClose(i, row) {
      //先在本地删除，然后网络请求
      row.attr_vals.splice(i, 1)
      //console.log(row.attr_vals);
      //再请求，
      this.saveAttrvals(row)
    },
    //把对可选项的删除，增加，抽离出来
    async saveAttrvals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.selectCateId[2]}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' '),
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('操作失败')
      }
      this.$message.success('操作成功')
    },
  },
  computed: {
    //控制添加按钮是否禁用，返回true禁用
    isAddButDisabled() {
      //依据有没有选择三级分类判断
      if (this.selectCateId.length !== 3) {
        return true
      } else {
        return false
      }
    },
    //添加动态属性或静态参数公用一个对话框，判断是哪个
    titleAddDialog() {
      if (this.activeName == 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    },
  },
}
</script>

<style>
.row {
  margin: 15px 0;
}
.el-tag {
  margin: 0 10px;
}
.inputnewtag {
  width: 120px !important;
}
</style>