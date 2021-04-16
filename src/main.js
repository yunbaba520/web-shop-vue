import Vue from 'vue'
import App from './App.vue'
import router from './router'

//导入nprogress对应的js和css,进度条
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import './plugins/element.js'
//引入全局样式表
import './assets/css/global.css'
//引入字体图标
import './assets/fonts/iconfont.css'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入axios包 并挂载到vue实例上 并配置根路径
import axios from 'axios'
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
//在request请求中，展示进度条Nprogress.start()
/* 挂载前添加请求拦截器 */
 axios.interceptors.request.use(config => {
  Nprogress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //console.log(config);此时打印，值为null 登录时没有令牌不需要
  //必须return
  return config
}) 
//在response中隐藏进度条Nprogress.done()
axios.interceptors.response.use(config => {
  Nprogress.done()
  return config
})
import TreeTable from 'vue-table-with-tree-grid'
//时间过滤器,dateFormat名称
Vue.filter('dateFormat',function(originVal){
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 +'').padStart(2,'0')
  const d = (dt.getDate() + '').padStart(2,'0')

  const hh =(dt.getHours() + '').padStart(2,'0')
  const mm = (dt.getMinutes() + '').padStart(2,'0')
  const ss = (dt.getSeconds() + '').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
 })
//富文本编辑器相关样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble 
//全局挂载
Vue.use(VueQuillEditor, /* { default global options } */)
Vue.prototype.$http = axios


Vue.config.productionTip = false
Vue.component('tree-table',TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
