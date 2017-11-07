import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

/**
 * Vuex全局状态管理
 * @param options {Array} 用于渲染tabs的数组
 */
const store = new Vuex.Store({
  state: {
      options: [],
      activeIndex: '/',
      preOrderType: '',
      OrderDetailID: 0,
      tempOrderDetailData: {},
  },
  mutations: {
    // 添加tabs
    add_tabs (state, data) {
      this.state.options.push(data);
    },
    // 删除tabs
    delete_tabs (state, route) {
      let index = 0;
      if(state.options.length == 1){
        return;
      }
      if(route == '/PreOrder'){
        state.OrderDetailID= 0;
        state.tempOrderDetailData= {};
      }
      for (let option of state.options) {
        if (option.route === route) {
          break;
        }
        index++;
      }
      this.state.options.splice(index, 1);
    },
    set_active_index (state, index) {
      this.state.activeIndex = index;
    }
  }
});
var local = {
  save(key,value){
    localStorage.setItem(key,JSON.stringify(value));
  }
}
export default store;
