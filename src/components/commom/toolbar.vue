<template>
  <div>
    <el-button-group class="toolbar">
    <span v-for="tool of toolbar">
      <el-button v-bind:class="tool.iconcls" size="small" class="mybutton" v-on:click="letgo(tool)">{{tool.text}}</el-button></span>
  </el-button-group>
  </div>
</template>

<script>
export default {
  name: 'toolbar',
  props: ['type'],
  created: function(){
  	for(let i of this.jurisdiction[this.type]){
  		this.toolbar[i] = this.alltool[i]
  	}
  },
  methods: {
  	letgo(tool){
  		this.$emit("listenToChildEvent",tool.func);
  	},
  	loadPreOrder(){

  	}
  },
  data(){
  	return {
  		toolbar:{},
  		jurisdiction:{
  			PreOrder:['left','right','add','save','remove','check','search'],
        NetOrder:['left','right','check','search','saveTranslate','getNetOrder','emptyNetOrder'],
        preOderGrid:['addRow','saveRow','delateRow','cancelRow']
  		},
  		alltool: {
		        left: {
		          iconcls: 'el-icon-arrow-left',
		          text: '上张',
		          func: 'changePage(0)'
		        },
		        right: {
		          iconcls: 'el-icon-arrow-right',
		          text: '下张',
		          func: 'changePage(1)'
		        },
		        add: {
		          iconcls: 'el-icon-plus',
		          text: '新建单据',
		          func: 'addOrder()'
		        },
		        save: {
		          iconcls: 'el-icon-upload',
		          text: '保存单据',
		          func: 'saveOrder()'
		        },
		        remove: {
		          iconcls: 'el-icon-delete',
		          text: '删除单据',
		          func: 'deleteOrder()'
		        },
		        check: {
		          iconcls: 'el-icon-circle-check',
		          text: '审核单据',
		          func: 'checkOrder()'
		        },
		        search: {
		          iconcls: 'el-icon-search',
		          text: '查询',
		          func: 'inquire()'
		        },
            saveTranslate: {
              iconcls: 'el-icon-upload',
              text: '保存转换表',
              func: 'saveTranslate()'
            },
            getNetOrder: {
              iconcls: 'el-icon-download',
              text: '获取网络订单',
              func: 'getNetOrder()'
            },
            emptyNetOrder: {
              iconcls: 'el-icon-delete',
              text: '清空网络订单',
              func: 'emptyNetOrder()'
            },
            addRow:{
              iconcls: 'el-icon-plus',
              text: '新建',
              func: 'addRow()'
            },
            saveRow:{
              iconcls: 'el-icon-document',
              text: '保存',
              func: 'saveRow()'
            },
            delateRow:{
              iconcls: 'el-icon-delete',
              text: '删除',
              func: 'delateRow()'
            },
            cancelRow:{
              iconcls: 'el-icon-more',
              text: '取消',
              func: 'canceleEit()'
            }
		    }
  	}
  }
}
</script>

<style scoped>
.toolbar {
  margin: 0;
  width: 100%;
  background-color: rgb(250,240,250);
}
.mybutton{
  padding: 5px 1px; margin: 3px;
}
.el-button {
  margin: 2px 3px;
  border: 1px solid rgb(250,240,250);
  background-color: rgb(250,240,250);
}
.el-button:hover{
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color:  rgb(210,224,242);
  color: #666;
}
</style>