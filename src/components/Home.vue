<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  methods:{
      logout(){
          //退出原理，直接把token销毁，让他重新登录
          window.sessionStorage.clear();
          this.$router.push('/login')
      }
  }
}
</script>

<style Lang="less" scoped>

</style>