// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'babel-polyfill'
import axios from 'axios'
import store from './store'
import zkTable from 'vue-table-with-tree-grid'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/total.less'
import './i18n'

Vue.use(ElementUI, { size: 'small', zIndex: 3000 })
Vue.use(zkTable) // 多功能表格

Vue.config.productionTip = false

Vue.prototype.$http = axios

/* eslint-disable no-new */
const v = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
// http请求设置
v.$http.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
v.$http.defaults.transformRequest = [(data) => {
  let ret = ''
  data = data || {}
  data.current_user_name = store.state.USERNAME
  data.current_user_type = store.state.USERTYPE
  data.current_user_id = store.state.USERID
  for (let it in data) {
    if (data[it] === 'undefined' || data[it] === undefined) { data[it] = '' }
    ret += `${decodeURIComponent(it)}=${decodeURIComponent(data[it])}&`
  }
  return ret
}]
// 过滤响应
v.$http.interceptors.response.use(result => {
  /* result 为服务器响应回来的数据 */
  /* 方式一：直接返回处理后的 result */
  result.data.status = result.data.status ? parseInt(result.data.status) : result.data.status
  if (parseInt(result.data.status) === 2) {
    // v.$router.push('/login')
    // v.$message.error(result.data.msg)
    // sessionStorage.clear()
    // v.setName('')
    // v.setUserName('')
    // v.setUserType('')
    // v.setUserId('')
  } else if (parseInt(result.data.status) === 1 && result.data.msg && result.data.msg.replace(/^\s*|\s*$/g, '') !== '') {
    v.$message({
      message: result.data.msg,
      type: 'success'
    })
  } else if (parseInt(result.data.status) !== 1) {
    /* 方式二：返回一个 Promise 对象 可以根据服务端返回的错误码进行判断 */
    v.$message.error(result.data.msg)
  }

  return result
}, (err) => {
  /* 当响应出错的时候 */
  return Promise.reject(err)
})
