<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加角色区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表展示 -->
      <el-table :data="rolesList">
        <!-- 扩展列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', 'vcenter', i1 === 0 ? 'bdtop' : '']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限列 -->
              <el-col :span="5">
                <!-- tag标签美化 -->
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级 三级权限列 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="['vcenter', i2 === 0 ? '' : 'bdtop']"
                >
                  <!-- 渲染二级 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRoleById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog
      title="修改角色信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="角色id">
          <el-input v-model="editForm.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRoleInfo">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClose"
    >
      <!--data绑定数据源 props自定义对象，怎么显示 , show-checkbox前加小框框，default-expand-all默认展开，node-key="id"以id作为唯一标识-->
      <!--default-checked-keys给他一个数组，数组中为之前原有权限，默认选中 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allowKeys"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //获取所有角色列表
      rolesList: [],
      //控制添加角色对话框
      addDialogVisible: false,
      //增加角色对象
      addForm: {
        roleName: '',
        roleDesc: '',
      },
      //增加角色对象规则
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
        ],
      },
      //控制修改角色对话框显示与隐藏
      editDialogVisible: false,
      //保存根据id获取过来的原有数据
      editForm: {},
      //修改角色规则
      editFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
        ],
      },
      //控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      //保存所有权限数据
      rightsList: [],
      //树形控件,属性绑定对象
      treeProps: {
        children: 'children',
        label: 'authName',
      },
      //原有权限默认选中，保存id的数组,递归动态添加
      defKeys: [],
      //当前分配权限角色id
      roleId :''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    //网络请求获取所有角色
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      //console.log(res)
      this.rolesList = res.data
    },
    //监听增加角色表单关闭
    addDialogClose() {
      //表单对象引用，reset重置
      this.$refs.addFormRef.resetFields()
    },
    //添加角色对话框提交
    addRole() {
      //检查是否符合提交资格
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        //可以发起添加用户网络请求
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功')
        //隐藏对话框
        this.addDialogVisible = false
        //重新刷新列表
        this.getRolesList()
      })
    },
    //点击修改用户后
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        this.$message.error('查询用户信息失败')
      }
      //成功的话把数据保存下来并显示
      this.editForm = res.data
      this.editDialogVisible = true
    },
    //监听修改用户表单关闭
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    //修改角色表单验证并提交
    editRoleInfo() {
      //效验是调用ref引用的validate函数，参数为回调函数，值为布尔
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return
        }

        //可以提交
        const { data: res } = await this.$http.put(
          'roles/' + this.editForm.roleId,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc,
          }
        )
        if (res.meta.status !== 200) {
          //console.log(res);
          //console.log(this.editForm.roleId);
          return this.$message.error('修改角色信息失败')
        }
        //提示成功
        this.$message.success('修改角色信息成功')
        //关闭对话框
        this.editDialogVisible = false
        //重新加载页面
        this.getRolesList()
      })
    },
    //删除角色
    async removeRoleById(id) {
      //弹框询问是否删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      //console.log(confirmResult);
      //确定删除返回confirm，取消删除返回cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除用户')
      }
      //console.log("确认删除");
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status != 200) {
        return this.$message.error('删除角色失败')
      }
      this.$message.success('删除角色成功')
      this.getRolesList()
    },
    //删除权限
    async removeRightById(role, rightId) {
      //删除前弹框提示
      const confirmRes = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmRes !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      //确定删除发起请求
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      //因为请求返回的数据里有最新的data，不能this.getRolesList()会刷新整个页面，展开列会闭合
      role.children = res.data
    },
    //点击分配权限弹出dialog
    async showSetRightDialog(role) {
        //后加的，获得当前角色id
        this.roleId = role.id
      //先把所有权限请求过来
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取所有权限失败')
      }
      //console.log(res);
      //把获取的数据保存下来
      this.rightsList = res.data
      //console.log(this.rightsList)
      //后加的。在打开前，默认把已有权限点上
      this.getLeafKeys(role,this.defKeys)
      this.setRightDialogVisible = true
    },
    //递归,默认勾选权限数组里添加id
    getLeafKeys(node,arr) {
      //先判断是否为三级权限
      if(!node.children){
          return arr.push(node.id)
      }
      //不是三级节点
      node.children.forEach( item => {
          this.getLeafKeys(item,arr)
      })
    },
    //监听分配权限对话框关闭，把数组清空
    setRightDialogClose() {
        this.defKeys= []
    },
    //提交权限分配
    async allowKeys(){
        /* 调用el里的方法获得选中的节点，并整合到一个数组中 */
        const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        /* 然后转化为以，链接的字符串 */
        const idstr = keys.join(',')
        /*  请求 */
        const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idstr})
        if(res.meta.status !== 200){
            return this.$message.error("修改角色权限失败")
        }
        this.$message.success("修改角色权限成功")
        this.getRolesList()
        this.setRightDialogVisible = false
    }
  },
}
</script>

<style Lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
/* 上下居中 */
.vcenter {
  display: flex;
  align-items: center;
}
</style>