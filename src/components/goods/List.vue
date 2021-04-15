<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!--搜索区域  -->
      <el-row :gutter="20">
        <!-- 输入框 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 添加按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addGoodsPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!--列表区域  -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="110px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="80px"
        ></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="200px">
          <!-- 时间自定义显示 -->
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editGoodsById(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoodById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
    <!-- 修改商品对话框 -->
    <el-dialog
      title="修改商品信息"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <span>接口崩了，兄弟请回吧</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false"
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
      //请求时，需要分页，查询信息
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      //保存商品列表信息
      goodsList: [],
      //总条数
      total: 0,
      //控制修改商品对话框的显示与隐藏
      editDialogVisible: false
    }
  },
  created() {
    //开局调用函数获取商品参数
    this.getGoodsList()
  },
  methods: {
    //获得商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods/', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.$message.success('获取商品列表成功')

     // console.log(res)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    //用手点击分页，分页每页多少条数据发生变化
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getGoodsList()
    },
    //用手点击分页，去往哪一页
    handleCurrentChange(newnum) {
      this.queryInfo.pagenum = newnum
      this.getGoodsList()
    },
    //监听点击删除，根据id删除商品
    async deleteGoodById(id) {
      const confirmRes = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
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
      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getGoodsList()
    },
    //跳转到增加商品页面
    addGoodsPage() {
      this.$router.push(`goods/add`)
    },
    //编辑商品名称
    editGoodsById(id) {
      this.editDialogVisible = true
    },
  },
}
</script>

<style  scoped>
</style>

