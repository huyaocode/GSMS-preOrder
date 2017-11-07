<template>
<div id="app">
	<div class="inquery">
	    <el-row>
	        <el-col :span="24">
	            <div class="maintitle">
	                查询
	            </div>
	        </el-col>
	    </el-row>
	    <el-row>
	        <el-form style="margin-top: 10px">
	            <el-col :span="4">
	                <el-form-item label="用户组">
	                    <el-select v-model="CUSTOMER_TYPE" style="width: 190px" placeholder="请选择">
	                        <el-option v-for="item in customertypes"  :label="item.CUSTOMER_TYPE"
	                        :value="item.CUSTOMER_TYPE">
	                        </el-option>
	                    </el-select>
	                </el-form-item>
	            </el-col>
	            <el-col :span="4">
	                <el-form-item label="配送单位">
	                    <el-autocomplete v-model="CUSTOMER_NAME" :fetch-suggestions="querySearchAsync"
	                    placeholder="请输入内容" style="width: 190px" @select="handleSelect">
	                    </el-autocomplete>
	                </el-form-item>
	            </el-col>
	            <el-col :span="4">
	                <el-form-item label="配送开始时间	">
	                    <el-date-picker v-model="distribution_start" type="date" @change="getStartdata" value-format="yyyy/MM/dd"  style="width: 160px"
	                    placeholder="选择日期时间">
	                    </el-date-picker>
	                </el-form-item>
	            </el-col>
	            <el-col :span="4">
	                <el-form-item label="配送结束时间">
	                    <el-date-picker v-model="distribution_end" type="date"  @change="getEnddata" value-format="yyyy/MM/dd"  style="width: 160px"
	                    placeholder="选择日期时间">
	                    </el-date-picker>
	                </el-form-item>
	            </el-col>
	            <el-col :span="3">
	                <el-form-item label="审核状态">
	                    <el-select v-model="verify" style="width: 120px" placeholder="请选择">
	                        <el-option v-for="item in isverify" :key="item.value" :label="item.label"
	                        :value="item.value">
	                        </el-option>
	                    </el-select>
	                </el-form-item>
	            </el-col>
	            <el-col :span="3">
	                <el-form-item label="编号">
	                    <el-input v-model="findingID" placeholder="请输入编号" style="width: 150px">
	                    </el-input>
	                </el-form-item>
	            </el-col>
	            <el-col :span="2">
	                <el-button plain @click="inquery">
	                    <i class="el-icon-search" >
	                    </i>
	                    搜索
	                </el-button>
	            </el-col>
	        </el-form>
	    </el-row>
	</div>
	<!-- ----datagrid---- -->
	<el-col :span="24" style="margin: -3px;">
	    <div class="maintitle">
	        <span style="background-color: #fff; border: blue; display: inline-block; border: 1px solid #39c; border-radius:5px; text-indent: 1px; border-bottom: none; font-size: 15px; ">
	            原始订单列表
	        </span>
	    </div>
	</el-col>
	<el-table @row-dblclick="selectrow" ref="singleTable" highlight-current-row size="mini" height="618" :data="tableData" stripe style="width: 100%">
	    <el-table-column type="index" align="center" width="60">
	    </el-table-column>
	    <el-table-column prop="ORDER_NO" label="订单编号">
	    </el-table-column>
	    <el-table-column prop="CUSTOMER_TYPE" label="用户组">
	    </el-table-column>
	    <el-table-column prop="CUSTOMER_NAME" label="配送单位名称">
	    </el-table-column>
	    <el-table-column prop="DISTRIBUTION_DATE" label="配送时间">
	    </el-table-column>
	    <el-table-column label="总价">
	        <template slot-scope="scope">
	            <p>
	                ￥{{scope.row.LUMP_SUM}}元
	            </p>
	        </template>
	    </el-table-column>
	    <el-table-column prop="STATE" label="订单状态">
	    </el-table-column>
	    <el-table-column label="审核状态">
	        <template slot-scope="scope">
	            <p v-show="scope.row.ISVERIFY=='0'">
	                未审核
	            </p>
	            <p v-show="scope.row.ISVERIFY=='1'">
	                审核通过
	            </p>
	        </template>
	    </el-table-column>
	</el-table>
	<!-- 底部改变页数的toolbar -->
	<div class="gridfooter">
		<el-button size="mini" round plain @click="goBorder(-1)">
	        <i class="el-icon-d-arrow-left"></i>
	    </el-button>
	    <el-button size="mini" round plain @click="changePage(-1)">
	        <i class="el-icon-arrow-left"></i>
	    </el-button>
	   	<div style="display: inline-block; margin-left: 5px;margin-right:5px;">
	    	第<el-input v-model="page" style="width: 50px" size="mini"></el-input>页,总共{{this.pagetotal}}页
	    </div> 
	    <el-button size="mini" round plain @click="changePage(1)">
	        <i class="el-icon-arrow-right"></i>
	    </el-button>
	    <el-button size="mini" round plain @click="goBorder(1)">
	        <i class="el-icon-d-arrow-right"></i>
	    </el-button>
	    <span style="float: right;"> 共{{total}}条 &emsp;&emsp;</span>
	</div>

</div>
</template>

<script>
import axios from 'axios'
export default {
  	name: 'app',
  	data(){
  		return{
  			page: 1,	//页数
  			pagetotal: 0,
  			total: 0,
  			tableData: [{}],
  			customertypes: [],
  			customer: [],
  			distribution_start: '',
  			distribution_end: '',
  			verify:'',
  			isverify: [{
	          value: '0',
	          label: '未审核'
	        }, {
	          value: '1',
	          label: '已审核'
	        },{
	          value: '',
	          label: '全部'
	        }],
  			findingID: '',
  			CUSTOMER_NAME: '',
  			CUSTOMER_TYPE: '',
  			CUSTOMERTYPE_ID: '',
  			urlhead: 'http://192.168.199.198:3000/GSMS/',
  		}
  	},
  	watch: {
  		//当页数改变,调用获取数据函数
    	page: function (newQuestion) {
      		this.getPagedata();
    	}
  	},
  	mounted(){//el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子。如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$el 也在文档内。
        this.getPagedata();
        this.getCustomertype();
    },
  	methods: {
  		setCurrent(row) {
        	this.$refs.singleTable.setCurrentRow(row);
      	},
      	selectrow(row, event){
      		console.log(row.ID)
      		this.$store.state.OrderDetailID = row.ID;
      		this.$router.push({path: '/PreOrder'});
      		this.$store.commit('set_active_index', this.$route.path);
      	},
  		//配送单位查询
  		querySearchAsync(queryString, cb) {		
        	var list = [{}];
         	axios.get( this.urlhead + 'basic/customer/findbypinyin?PINYINFIELDNAME=' + queryString).then((response)=>{
            for(let i of response.data){
              	i.value = i.CUSTOMER_NAME;		//向数组中注入value,让input 可识别
            }
            list = response.data;
            cb(list);
          	}).catch((error)=>{
              	console.log(error);
          	});
      	},
      	//配送单位的选中处理
      	handleSelect(item) {	
        	this.CUSTOMER_TYPE = item.CUSTOMER_TYPE;
        	this.CUSTOMERTYPE_ID = item.CUSTOMERTYPE_ID;
      	},
      	//查询,拼接字符串,调用获取数据函数
      	inquery(){		
      		let url = this.urlhead + 'logistics/originalorder/list.do?';
      		 url = url + 'CUSTOMER_TYPE=' +	this.CUSTOMER_TYPE + '&CUSTOMER_NAME=' + this.CUSTOMER_NAME + '&DISTRIBUTION_DATE_START=' + this.distribution_start + '&DISTRIBUTION_DATE_END=' + this.distribution_end + '&ISVERIFY=' + this.verify + '&ORDER_NO=' + this.findingID + '&currentPage=' + this.page;
      		this.loadData(url);
      	},
      	//获取某页数据
      	getPagedata(){
      		let url =this.urlhead + 'logistics/originalorder/list.do?currentPage=' + this.page + + 'CUSTOMER_TYPE=' +	this.CUSTOMER_TYPE + '&CUSTOMER_NAME=' + this.CUSTOMER_NAME + '&DISTRIBUTION_DATE_START=' + this.distribution_start + '&DISTRIBUTION_DATE_END=' + this.distribution_end + '&ISVERIFY=' + this.verify ;
      		this.loadData(url);
      	},
      	//获取数据函数, 填充一起
      	loadData(url) {
	        axios.get(url).then((response)=>{
	        	console.log('订单查询返回数据')
	        	console.log(response)
	          this.tableData = response.data.rows;
	          this.pagetotal = parseInt(response.data.count / 10) + 1;
	          if(response.data.count % 10 == 0){
	          	this.pagetotal--;
	          }
	          this.total = response.data.count;
	          this.$store.state.preOrderID = response.data.ID;
	        }).catch((error)=>{
	            console.log(error);
	        });
      	},
      	//改变页数 + - 1页
      	changePage(order){
      		if(order == 1 && this.page < this.pagetotal){
      			this.page++;
      		}
      		else if(order == -1 && this.page > 1){
      			this.page--;
      		}
      	},
      	//改变页数 ,跳到尽头
      	goBorder(order){
      		if(order== -1){
      			this.page = 1;
      		}else{
      			this.page = this.pagetotal;
      		}
      	},
      	//获取用户组类型
      	getCustomertype(){
      		axios.get(this.urlhead + 'basic/customertype/listall.do').then((response)=>{
	          this.customertypes = response.data;
	        }).catch((error)=>{
	            console.log(error);
	        });
      	},
      	//用@change调用,目的是保证存储的格式
      	getStartdata(date){
      		this.distribution_start = date;
      	},
      	//用@change调用,目的是保证存储的格式
      	getEnddata(date){
      		this.distribution_end = date;
      	}
  	}
}
</script>

<style>
body,html,div {
  	padding: 0px;
  	margin: 0px;
}
.maintitle{
	min-height: 25px;
	text-indent: 10px;
	background-color: rgb(210,224,242);
}
.inquery{
	height: 88px;
	border-bottom: 1px solid #39c;
	border-left: none;
	border-right: none; 
}
.gridfooter{
	width: 100%;
	height: 30px;
	border-bottom: 1px solid #39c;
	background-color: rgb(220,220,222);
	
}
</style>