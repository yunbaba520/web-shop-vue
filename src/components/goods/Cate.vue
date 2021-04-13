<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-row>
      <el-col>
        <el-button type="primary" @click="showAddCateDialog"
          >添加分类</el-button
        >
      </el-col>
    </el-row>
    <!-- 列表展示 -->
    <tree-table
      :data="cateList"
      :columns="columns"
      :selection-type="false"
      :expand-type="false"
      show-index
      index-text=""
      border
    >
      <!--  是否有效-->
      <template slot="isok" slot-scope="scope">
        <i
          v-if="scope.row.cat_deleted === false"
          class="el-icon-success"
          style="color: lightgreen"
        ></i>
        <i v-else class="el-icon-error" style="red"></i>
      </template>
      <!-- 排序 -->
      <template slot="order" slot-scope="scope">
        <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
        <el-tag v-else-if="scope.row.cat_level === 1" type="danger"
          >二级</el-tag
        >
        <el-tag v-else type="success">三级</el-tag>
      </template>
      <!-- 操作 -->
      <template slot="opt" slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" @click="editCateName(scope.row)"
          >编辑</el-button
        >
        <el-button type="danger" icon="el-icon-delete" @click="deleteCateById(scope.row.cat_id)">删除</el-button>
      </template>
    </tree-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="querInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="querInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClose"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options指定数据源 cascaderProps 配置对象-->
          <el-cascader
            :options="parentCateList"
            :props="cascaderProps"
            @change="handleChange"
            v-model="selectedKeys"
            clearable

          ></el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editDialogVisible" width="50%">
      <el-form
        :model="editCateNameForm"
        :rules="editCateNameFormRules"
        ref="editCateNameFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateNameForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEditCateName"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //保存商品列表数据
      cateList: [],
      //总数
      total: 0,
      //请求时参数
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //设置树形表格列
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        //指定当前列为模板列，并指定模板，模板在tree-table中定义
        { label: '是否有效', type: 'template', template: 'isok' },
        { label: '排序', type: 'template', template: 'order' },
        { label: '操作', type: 'template', template: 'opt' },
      ],
      //控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      //添加分类数据对象，最后提交的
      addCateForm: {
        //添加分类名称
        cat_name: '',
        //父id，默认为零，表示要添加一级分类
        cat_pid: 0,
        //分类层级，0表示一级
        cat_level: 0,
      },
      //添加分类数据对象规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      //保存父级分类列表数据
      parentCateList: [],
      //父级列表选择配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        //选中的值
        value: 'cat_id',
        //展示的值
        label: 'cat_name',
        //层级关系
        children: 'children',
        //是否可以只选择一级分类
        checkStrictly:'true'
      },
      //最后选中的父级分类id数组,保存的是id，也就是第二个复选框
      selectedKeys: [],
      //控制编辑对话框是否显示
      editDialogVisible: false,
      //编辑修改分类对象
      editCateNameForm: {
          cat_name:''
      },
      //编辑修改分类对象验证规则
      editCateNameFormRules: {
        cat_name:[ { required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      //当前修改分类名称对象
      nowEditCateName:''
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //获取商品分类列表数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.querInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      //this.$message.success('获取商品分类成功')
      //console.log(res.data)
      //保存数据
      this.cateList = res.data.result
      this.total = res.data.total
    },
    //分页，监听分页每页数据发生变化
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    //分页，监听页码发生变化
    handleCurrentChange(newNum) {
      this.querInfo.pagenum = newNum
      this.getCateList()
    },
    //监听添加分类按钮
    showAddCateDialog() {
      //在展示前，先加载父级分类
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    //获得父级catelist，在添加分类对话框中显示
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类列表失败')
      }
      //console.log(res.data);
      //把数据保存下来
      this.parentCateList = res.data
    },
    //选择发生变化
    handleChange() {
      //console.log(this.selectedKeys);
      //先判断有没有选择，根据selectedKeys数组长度
      if (this.selectedKeys.length > 0) {
        //表示有选择,给父级列表配置对象属性赋值
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
      }
    },
    //点击按钮，添加分类
    addCate() {
      //先判断是否符合提交规则
      this.$refs.addCateFormRef.validate(async (vali) => {
        if (!vali) {
          return
        }
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    //监听添加分类对话框关闭
    addCateDialogClose() {
      //重置表单
      this.$refs.addCateFormRef.resetFields()
      //选中的父级分类，也就是第二个复选框保存的id
      this.selectedKeys = []
      //把要提交的表单对象清空
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    //监听点击编辑按钮
    editCateName(cate) {
      this.nowEditCateName = cate
      this.editDialogVisible = true
      //console.log(cate);
    },
    //监听提交编辑修改类名
    saveEditCateName() {
        this.$refs.editCateNameFormRef.validate(async vali => {
            if(!vali){
                return
            }
            const {data:res} = await this.$http.put('categories/' + this.nowEditCateName.cat_id,{
                cat_name:this.editCateNameForm.cat_name
            })
            if(res.meta.status !== 200){
                return this.$message.error("更新失败")
            }
            this.$message.success("更新成功")
            this.getCateList()
            this.editDialogVisible = false
        })
    },
    //监听删除按钮点击
    async deleteCateById(id) {
       const confirmRes = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        //console.log(confirmRes);
        //确定删除返回confirm,取消删除返回concel
        if(confirmRes !== 'confirm'){
          return this.$message.info("已取消删除分类")
        }
        const {data:res} = await this.$http.delete('categories/' + id)
        if(res.meta.status !== 200){
          return this.$message.error("删除分类失败")
        }
        this.$message.success("删除分类成功")
        this.getCateList()
      }
  },
}
</script>

<style>
</style>