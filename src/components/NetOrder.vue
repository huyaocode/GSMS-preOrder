<template>
  <div id="app">
   <!-- ---- toolbar ---- -->
  <toolbar type="NetOrder" ></toolbar>
  <el-form label-width="100px" style="width: 1200px; margin: 20px auto 0;" >
    <el-row :gutter="80">
      <el-col :span="10">
        <div class="grid-content ">
          <el-form-item label="用户组">
            <el-autocomplete  :disabled="true" style="width: 350px;" ></el-autocomplete>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="grid-content ">
          <el-form-item label="配送单位名称">
            <el-input placeholder="请输入内容" style="width: 350px" :disabled="true"></el-input>
          </el-form-item>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="80">
      <el-col :span="10">
        <div class="grid-content ">
          <el-form-item label="网络订单编号">
            <el-input placeholder="由系统自动生成,不需要填写"  style="width: 350px" :disabled="true"></el-input>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="grid-content ">
          <el-form-item label="配送时间">
            <el-date-picker  type="date"  placeholder="由系统自动生成,不需要填写" :disabled="true" style="width: 350px"></el-date-picker>
          </el-form-item>
        </div>
      </el-col>
    </el-row>
  </el-form>
  <el-table @row-dblclick="selectrow" ref="singleTable" highlight-current-row size="mini" height="400" :data="tableData" stripe style="width: 100%">
	    <el-table-column type="index" align="center" width="60">
	    </el-table-column>
	    <el-table-column label="内部商品ID">
	    </el-table-column>
	    <el-table-column  label="内部商品名">
	    </el-table-column>
	    <el-table-column label="内部商品类型">
	    </el-table-column>
	    <el-table-column  label="原始名称">
	    </el-table-column>
	    <el-table-column label="单位">
	    </el-table-column>
	    <el-table-column  label="数量">
	    </el-table-column>
	    <el-table-column label="单价">
	    </el-table-column>
	    <el-table-column label="总价">
	    </el-table-column>
	</el-table>
	<sumprice :money="sumprice"></sumprice>
	<footer-detail :MEMO="detail.MEMO" :CREATE_MAN="detail.CREATE_MAN"  :AUDITOR="detail.AUDITOR" :AUDITOR_TIME="detail.AUDITOR_TIME" :PRINTCOUNT="detail.PRINTCOUNT" ></footer-detail>
  </div>
</template>

<script>
import sumprice from './commom/sumprice'
import toolbar from './commom/toolbar'
import FooterDetail from './commom/FooterDetail'
export default {
  name: 'NetOrder',
  components:{
  	toolbar,sumprice,FooterDetail
  },
  data() {
  	return {
  		detail: message,
  		tableData: [],
  		sumprice: 0,
  	}
  },
  methods:{
  	selectrow(){

  	},
  }
}
var message={
    AUDITOR: "",
    AUDITOR_TIME: "",
    CREATE_MAN: "",
    CREATE_TIME: "",
    CUSTOMERTYPE_ID: 0,
    CUSTOMER_ID: 0,
    CUSTOMER_NAME: "",
    CUSTOMER_TYPE: "",
    DISTRIBUTION_DATE: "",
    ID: 1,
    ISVERIFY: "",
    ISWEB: "",
    LOG: "",
    LUMP_SUM: 0,
    MEMO: "",
    ORDER_NO: "",
    PRINTCOUNT: 0,
    SINGLE_MAN: "",
    SINGLE_MAN_TEL: "",
    STATE: "",
    isadd: false,
    rows:[{
          AMOUNT: '',
          FREE_AMOUNT:0,
          FREE_SUM:0,
          ID:'',
          INTERNALTRADE_ID:'',
          INTERNAL_NAME:"",
          INTERNAL_TYPE:"",
          ORDER_ID:'',
          SELF_AMOUNT:'',
          SELF_SUM:'',
          STATE:"",
          SUM:'',
          UNIT_NAME:"",
          UNIT_PRICE:'',
        }]
  };
</script>

<style>
body,html,div {
  padding: 0px;
  margin: 0px;
}
</style>