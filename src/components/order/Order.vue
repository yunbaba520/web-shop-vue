<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 列表展示区域 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>

        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-button
              size="mini"
              v-if="scope.row.pay_status === '1'"
              type="primary"
              >已付款</el-button
            >
            <el-button size="mini" v-else type="danger">未付款</el-button>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope" >
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editAddress"
            ></el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location"
              @click="showLogistics(scope.row.order_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editAddressDialogVisible"
      width="50%"
      @close="editAddressDialogClose"
    >
      <el-form
        :model="editAddressForm"
        :rules="editAddressFormRules"
        ref="editAddressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="editAddressForm.address1"
            :options="citydata"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editAddressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddressDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 展示物流进度对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="showDialog"
      width="50%"
    >
      <span>接口崩了，实现不了了，兄弟请回吧</span>
    </el-dialog>
  </div>
</template>

<script>
import citydata from './citydata.js'
export default {
  data() {
    return {
      //查询信息
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      //总条数
      total: 0,
      //订单信息
      orderList: [],
      //控制修改地址对话框的显示与隐藏
      editAddressDialogVisible: false,
      //修改表单对象
      editAddressForm: {
        address1: [],
        address2: '',
      },
      //修改表单对象验证规则
      editAddressFormRules: {
        address1: [{ required: true, message: '请选择地址', trigger: 'blur' }],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' },
        ],
      },
      //城市数据
      citydata,
      //控制物流进度的显示与隐藏
      showDialog : false
    }
  },
  created() {
    //开局获得订单信息
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单信息失败')
      }
      //获取成功,保存
     // console.log(res)
      this.total = res.data.total
      this.orderList = res.data.goods
    },
    //点击分页，每页数据发生变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    //点击分页，页码值发生变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    //点击修改地址
    editAddress() {
      this.editAddressDialogVisible = true
    },
    //监听修改地址对话框的关闭
    editAddressDialogClose() {
      this.$refs.editAddressFormRef.resetFields()
    },
    //点击查看物流
    async showLogistics(id) {
/*         const {data:res} = await this.$http.get(`/kuaidi/${id}`)
        if(res.meta.status !== 200) {
            return this.$message.error("获得物流信息失败")
        }
        console.log(res); */
        this.showDialog = true
    }
  },
}
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>
