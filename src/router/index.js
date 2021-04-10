import Vue from 'vue'
import VueRouter from 'vue-router'
//路由实现登录组件
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/users/Users.vue'
Vue.use(VueRouter)

const routes = [
  //重定向路径
  { path:'/',redirect:'/login'},
  //配置登录组件路径
  {path:'/login',component:Login},
  {path:'/home',component:Home,  redirect:'/welcome',children:[ 
    {path:'/welcome',component:Welcome},
    {path:'/users',component:Users}
  ]}
 
]

const router = new VueRouter({
  routes
})
//为router添加导航守卫
router.beforeEach((to,from,next) => {
/* to,表示要跳转的页面
   from表示来的页面
   next（）放行函数 next(路径)强制跳转的页面 */
   if(to.path === '/login') return next();
   //这里表示访问的不是登录页，先拿到token判断
  const tokenstr = window.sessionStorage.getItem('token');
  //没有token强制跳转
  if(!tokenstr) return next('/login');
  next()

})

export default router
