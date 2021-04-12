<template>
  <div>
    <!--面包屑导航  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
        <el-table :data="rightsList">
            <el-table-column type="index"></el-table-column>
            <el-table-column label="权限名称" prop="authName"></el-table-column>
            <el-table-column label="路径" prop="path"></el-table-column>
            <el-table-column label="权限等级" prop="level" >
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag> 
                    <el-tag type="warning" v-else>三级</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
    data() {
        return{
            //权限列表，获取过来的数据为list，用数组保存
            rightsList: []
        }
    },
    //打开网页就要加载
    created() {
        this.getRightsList()
    },
    methods: {
        //获取权限列表
        async getRightsList() {
          const {data:res} = await this.$http.get('rights/list')
          //console.log(res);
          if(res.meta.status !== 200){
            return this.$message.error("获取权限列表失败");
          }
          //获取数据成功 赋值给data里 数组rightsList
          this.rightsList = res.data
        }
    }
}
</script>

<style Lang="less" scoped>
</style>