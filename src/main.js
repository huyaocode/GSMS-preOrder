// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store/store.js'//引入store

Vue.config.productionTip = false
Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,	//引入store
  template: '<App/>',
  components: { App,toolbar }
})