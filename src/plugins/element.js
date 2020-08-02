import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message //导入弹窗提示，需进行全局挂载
} from 'element-ui'



Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
//$为自定义属性名，也是Vue 自己暴露的一些属性
Vue.prototype.$message = Message