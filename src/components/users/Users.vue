<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 栅格布局 -->
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <template #append>
              <el-button icon="el-icon-search" @click="getUserList"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="2"
          ><el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          ></el-col
        >
      </el-row>
      <!-- 列表展示区域 -->
      <el-table :data="userlist" stripe border>
        <!-- 添加索引 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <!-- 因为状态值为布尔类型，使用插槽作用域显示出来 -->
          <!-- slot-scope接受数据 scope.row这一行数据 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <!-- 这里是操作对象的，所以要先把对象拿过来 -->
          <template slot-scope="scope">
            <!-- 修改 -->
            <!-- 点击修改id，要先把该id数据渲染到对话框 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色 增加一个提示信息 dark深色的 effect影响效果 placement落点-->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="addRoles(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
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
        <el-form-item label="姓名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRolesDialogVisible"
      width="50%"
      @close="setRolesDialogClose"
    >
      <div>
        <!-- 展示当前用户信息 -->
        <p>用户姓名:{{ userInfo.username }}</p>
        <p>用户角色:{{ userInfo.role_name }}</p>
        <p>
          分配新角色:
          <el-select v-model="newRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setRolesDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo"
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
    //自定义邮箱验证规则，先写箭头函数(规则，要校验的值，回调函数)
    //直接回调函数表示效验通过，给回调函数一个失败对象表示不通过
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入有效的邮箱'))
    }
    //自定义手机验证规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[3|5|7|8|9]\d{9}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的手机号'))
    }
    return {
      //获取用户列表参数对象
      queryInfo: {
        query: '',
        //当前页数
        pagenum: 1,
        //当前每页显示多少数据
        pagesize: 2,
      },
      userlist: [],
      total: 0,
      //控制对话框的显示与隐藏
      addDialogVisible: false,
      //增加用户数据对象
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      //增加用户验证规则对象
      addFormRules: {
        //prop后为验证规则
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 10,
            message: '长度在 6 到 10 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      //控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      //修改用户时，根据id获取过来的原本数据，
      editForm: {},
      //修改用户信息规则对象
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      //控制分配角色对话框的显示与隐藏
      setRolesDialogVisible: false,
      //当前分配角色用户信息
      userInfo: {},
      //获取的所有分配角色
      rolesList: [],
      //选中的新角色id
      newRoleId:''
    }
  },
  created() {
    this.getUserList()
  },

  methods: {
    //获取用户列表
    async getUserList() {
      //使用async,await优化异步操作，
      //结构赋值出date属性重命名ref
      const { data: ref } = await this.$http.get('users', {
        params: this.queryInfo,
      })
      //console.log(ref)
      if (ref.meta.status !== 200)
        return this.$message.error('获取用户列表失败')
      this.userlist = ref.data.users
      this.total = ref.data.total
    },
    //监听pagesize改变事件 每页多少数据
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    //监听页码值改变事件
    handleCurrentChange(newCurrent) {
      this.queryInfo.pagenum = newCurrent
      this.getUserList()
    },
    //监听用户状态改变
    async userStateChange(userInfo) {
      //console.log(userInfo)
      //put请求常用于修改
      const { data: ref } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (ref.meta.status !== 200) {
        //更改失败页面和数据库保持一致
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    //监听增加用户表单关闭
    addDialogClose() {
      //表单对象引用，reset重置
      this.$refs.addFormRef.resetFields()
    },
    //增加表单预校验
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        //可以发起添加用户网络请求
        const { data: ref } = await this.$http.post('users', this.addForm)
        if (ref.meta.status !== 201) {
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        //隐藏对话框
        this.addDialogVisible = false
        //重新刷新列表
        this.getUserList()
      })
    },
    //点击修改用户
    async showEditDialog(id) {
      //根据id获取原本数据并显示
      const { data: ref } = await this.$http.get('users/' + id)
      if (ref.meta.status !== 200) {
        this.$message.error('查询用户信息失败')
      }
      //成功的话把数据保存下来并显示
      this.editForm = ref.data
      this.editDialogVisible = true
    },
    //监听修改用户信息对话框关闭事件
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    //修改用户信息提交前效验并提交
    editUserInfo() {
      //效验是调用ref引用的validate函数，参数为回调函数，值为布尔
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        //可以提交
        const { data: ref } = await this.$http.put(
          'users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          }
        )
        if (ref.meta.status !== 200) {
          this.$message.error('修改用户信息失败')
        }
        //提示成功
        this.$message.success('更新用户信息成功')
        //关闭对话框
        this.editDialogVisible = false
        //重新加载页面数据
        this.getUserList()
      })
    },
    //删除用户
    async removeUserById(id) {
      //弹框询问是否删除对象
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
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
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status != 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      this.getUserList()
    },
    //分配角色对话框
    async addRoles(userInfo) {
      this.userInfo = userInfo
      //在展开前获取所有角色信息
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取所有角色信息失败')
      }
      //获取成功保存下来
      this.rolesList = res.data
     // console.log(this.rolesList)
      this.setRolesDialogVisible = true
    },
    //保存分配角色
    async saveRoleInfo() {
      //先判断有没有保存
      if(!this.newRoleId) {
        return this.$message.info("请选择新角色")
      }
      const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.newRoleId})
      if(res.meta.status !== 200){
        //打印下错误信息
        //console.log(res);
        return this.$message.error("更新用户角色失败")
      }
      this.$message.success("更新用户角色成功")
      this.setRolesDialogVisible = false
      this.getUserList()
    },
    //监听分配角色对话框关闭
    setRolesDialogClose(){
      this.userInfo={}
      this.newRoleId=''
    }
  },
}
</script>

<style>
</style>