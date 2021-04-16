<template>
  <div class="login_c">
    <div class="login_box">
      <div class="head_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- el插件语法 -->
      <!-- 表单区域 -->
      <el-form
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <!-- 正则，先 :rules创建验证对象 对象里设置验证的属性 ，再prop绑定到input上 -->
        <el-form-item prop="username">
          <!-- 字体图标使用，prefix前缀 先加一个基础类iconfont 再加要使用的那个 -->
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <!-- 在向服务器请求前验证下，点击后在函数里调用validate方法 参数为一个回调函数，参数为布尔值，合法为true -->
          <el-button type="primary" @click="login">登录</el-button>
          <!-- 重置，el表单对象有个方法可以重置 用ref引用这个表单对象，点击后在函数里调用这个方法-->
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      /* 登录表单数据绑定对象 */
      loginForm: {
        username: "admin",
        password: "123456",
      },
      //表单验证对象
      loginFormRules: {
        //验证的名字要和表单数据对象一样
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 6,
            max: 10,
            message: "长度在 6 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(async (bool) => {
        /* console.log(bool); */
        if (!bool) return; /* bool为false退出 */
        /* 发送请求  后带参数*/
        const { data: res } = await this.$http.post("login", this.loginForm);
        /* async 和 await 两种语法结合可以让异步代码看起来像同步代码一样；
        1. await 必须写在 async 函数中；
        2. await 右侧的表达式一般为 promise 对象；
        3. await 返回的是 promise 成功的值；
        4. await 的 promise 失败了, 就会抛出异常, 需要通过 try...catch 捕获处理；
        */
        /* 把返回对象data属性重命名res 使返回对象只返回data属性 */
        /* console.log(res); */
        if (res.meta.status != 200) return this.$message.error('登录失败');
        this.$message.success('登陆成功')
        /* 登录成功后，保存res里面的token，因为访问其他api需要登录成功，token作为令牌，保存到sessionstorage里，只在页面打开时有效 */
       // console.log(res);
        window.sessionStorage.setItem('token' , res.data.token)
        /* 成功后跳转home页面 */
        this.$router.push('/home')
      });
    },
  },
};
</script>

<style Lang="less" scoped>
/* scoped 规定只在组件中有效,less 语法 安装less和less-loader*/
.login_c {
  background-color: pink;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.head_box {
  width: 130px;
  height: 130px;
  border: 1px solid #aaa;
  border-radius: 50%;
  padding: 10px;
  /*  overflow: hidden; */
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -40%);
}
.head_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style> 

