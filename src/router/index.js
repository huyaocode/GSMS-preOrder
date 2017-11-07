import Vue from 'vue'
import Router from 'vue-router'
import PreOrder from '@/components/PreOrder'
import NetOrder from '@/components/NetOrder'
import InqueryOrder from '@/components/InqueryOrder'
import Menu from '@/components/menu'

Vue.use(Router)

export default new Router({
  routes: [
  {
		path: '/',
		name: '首页',
	    component: Menu,
	    children:[
		{
	      path: 'PreOrder',
	      name: '原始订单详情',
	      component: PreOrder
	    },{
	      path: 'NetOrder',
	      name: '网络订单',
	      component: NetOrder
	    },{
	      path: 'InqueryOrder',
	      name: '订单查询',
	      component: InqueryOrder
	    }
      ]
	}
  ]
})
