<template>
  <el-container class="home_container">
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <!-- 侧边栏菜单区域 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- active-text-color=""选中那个的颜色 unique-opened只能一个子菜单打开 router开启路由，ui以index为路径-->
        <el-menu background-color="#333744" text-color="#fff" unique-opened :collapse="isCollapse" :collapse-transition="false" :router="true"
          :default-active='activePath'>
          <!-- 一级菜单 -->
          <!-- 双层for循环把数据渲染出来，动态绑定不同的key和index值 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <template #title><i :class="iconObj[item.id]"></i><span>{{ item.authName }}</span></template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id"
              @click="saveNavState('/' + subitem.path)"
            >
              <template #title
                ><i class="el-icon-menu"></i>{{ subitem.authName }}</template
              >
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  /* 创建实例时就把数据获取过来 */
  created() {
    this.getMenuList()
    //从内存中获得高亮链接
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data() {
    return {
      menulist: [],
      //字体图标对象，循环渲染一级菜单图标，key值为item.id
      iconObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      isCollapse:false,
      //保持高亮链接
      activePath:''
    }
  },
  methods: {
    logout() {
      //退出原理，直接把token销毁，让他重新登录
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //获取所有的菜单
    async getMenuList() {
      //发生get请求并简化获得数据
      const { data: ref } = await this.$http.get('menus')
      //console.log(ref);
      //判断是否正确，提示错误信息
      if (ref.meta.status !== 200)
        return this.$message.console.error(ref.meta.msg)
      //获得数据
      this.menulist = ref.data
    },
    toggleCollapse(){
      this.isCollapse = !this.isCollapse
    },
    //保存高亮链接
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      //没有刷新页面，为activePath赋点击链接
      this.activePath = activePath
    }
  },
}
</script>

<style Lang="less" scoped>
.home_container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  background-color: #696969;
  align-items: center;
  padding-left: 0;
  color: #fff;
  font-size: 20px;
}
.el-header div {
  display: flex;
  align-items: center;
}
.el-aside {
  background-color: #333744;
}
.el-aside .el-menu {
  border-right: none;
}
.el-main {
  background-color: #f0f8ff;
}
.iconfont {
  margin-right: 5px;
}
.toggle-button {
  color: #fff;
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  /* 三个竖线太近了，增加空隙 */
  letter-spacing: 0.2em;
  /* 鼠标放上去为小手 */
  cursor: pointer;
}
</style>