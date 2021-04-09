import Vue from 'vue'
//导入消息弹框，
import {Message,Button,Form,FormItem,Input} from 'element-ui'
/* 按需求导入的 */
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
//消息弹框需要挂载到vue全局实例上，全局通过this.$message访问
Vue.prototype.$message = Message
