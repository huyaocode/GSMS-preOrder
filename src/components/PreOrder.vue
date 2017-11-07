<template>
<div class="PreOrder">
  <!-- ---- toolbar ---- -->
  <toolbar type="PreOrder" v-on:listenToChildEvent="getToolEvent"></toolbar>
  <!-- 审核通过与否标识 -->
  <img class="vertify" src="../../static/checked.png" v-if="detail.ISVERIFY === '1'">
  <img class="vertify" src="../../static/checkfailed.png" v-else-if="detail.ISVERIFY === '0'">
  <img class="vertify" src="" v-else="detail.ISVERIFY ==='' ">
  <!-- ---- 4个input框 ---- -->
  <el-form label-width="90px" style="width: 1200px; margin: 20px auto 0;" v-on:click.native="saveRow" >
    <el-row :gutter="80">
      <el-col :span="10">
        <div class="grid-content ">
          <el-form-item label="配送单位">
            <el-autocomplete v-model="detail.CUSTOMER_NAME" :fetch-suggestions="querySearchAsync" placeholder="请输入内容" style="width: 350px;" @select="handleSelect"></el-autocomplete>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="grid-content ">
          <el-form-item label="用户组 ">
            <el-input placeholder="请输入内容" v-model="detail.CUSTOMER_TYPE" style="width: 350px" :readonly="true"></el-input>
          </el-form-item>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="80">
      <el-col :span="10">
        <div class="grid-content ">
          <el-form-item label="订单编号">
            <el-input placeholder="由系统自动生成,不需要填写" v-model="detail.ORDER_NO" style="width: 350px" :disabled="true"></el-input>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="grid-content ">
          <el-form-item label="配送时间">
            <el-date-picker v-model="detail.DISTRIBUTION_DATE" type="date" @change="getStartdata" value-format="yyyy/MM/dd"   placeholder="选择日期" style="width: 350px"></el-date-picker>
          </el-form-item>
        </div>
      </el-col>
    </el-row>
  </el-form>

  <!-- ---- 数据表格 ---- -->
  <!-- ---- preOderGridtoolbar ---- -->
  <toolbar type="preOderGrid" v-on:listenToChildEvent="getToolEvent"></toolbar>
  <el-table :data="detail.rows" size="mini" border height="400" highlight-current-row @row-dblclick="selectrow" @row-click="heighLightRow" >
    <el-table-column width="1">
      <template slot-scope="detail">
        <span style="display: none;">{{ detail.row.ID }}</span>
      </template>
    </el-table-column>
    <el-table-column type="index" align="center" width="50"></el-table-column>
    <el-table-column label="*内部商品名">
      <template slot-scope="message">
        <el-autocomplete v-if="selecting == message.row.ID" v-model="editingRow.INTERNAL_NAME" :fetch-suggestions="searchName" @keyup.enter.native="addRow" @select="changeTypeUnit" size="mini"></el-autocomplete>
        <span v-else>{{ message.row.INTERNAL_NAME }}</span></template>
    </el-table-column>
    <el-table-column label="内部商品类型">
      <template slot-scope="message">
        <el-input v-if="selecting == message.row.ID" v-model="editingRow.INTERNAL_TYPE" size="mini" readonly></el-input>
        <p v-else>{{ message.row.INTERNAL_TYPE }}</p>
      </template>
    </el-table-column>
    <el-table-column label="单位">
      <template slot-scope="message">
        <el-input v-if="selecting == message.row.ID" v-model="editingRow.UNIT_NAME" size="mini" readonly></el-input>
        <p v-else>{{ message.row.UNIT_NAME }}</p>
      </template>
    </el-table-column>
    <el-table-column label="*数量">
      <template slot-scope="message">
        <el-input-number v-if="selecting == message.row.ID" v-model="editingRow.AMOUNT" size="mini" @keyup.enter.native="addRow"></el-input-number>
        <p v-else>{{ message.row.AMOUNT }}</p>
      </template>
    </el-table-column>
    <el-table-column label="单价">
      <template slot-scope="message">
        <el-input-number v-if="selecting == message.row.ID" size="mini" v-model="editingRow.UNIT_PRICE" @keyup.enter.native="addRow"></el-input-number>
        <p v-else-if="!message.row.UNIT_PRICE==''">￥{{ message.row.UNIT_PRICE }}</p>
      </template>
    </el-table-column>
    <el-table-column label="总价">
      <template slot-scope="message">
        <el-input v-if="selecting == message.row.ID" size="mini" v-model="editingRow.UNIT_PRICE * editingRow.AMOUNT" readonly></el-input>
        <p v-else-if="!message.row.AMOUNT==''">￥{{ message.row.UNIT_PRICE * message.row.AMOUNT }}</p>
      </template>
    </el-table-column>
  </el-table>

  <!-- ---- 底部input框 ---- -->
  <div class="footer">
    <sumprice :money="summation"></sumprice>
    
    <footer-detail :MEMO="detail.MEMO" :CREATE_MAN="detail.CREATE_MAN"  :AUDITOR="detail.AUDITOR" :AUDITOR_TIME="detail.AUDITOR_TIME" :PRINTCOUNT="detail.PRINTCOUNT" ></footer-detail>
  </div>
</div>
</template>

<!-- ----JS----- -->
<script>
import qs from 'qs';
import axios from 'axios'
import toolbar from './commom/toolbar'
import sumprice from './commom/sumprice'    //显示总价和大写的总价
import FooterDetail from './commom/FooterDetail'  //底部备注栏
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
//用于处理新增行时第一栏为空的情况 
const newRow =  {
  AMOUNT: '',
  FREE_AMOUNT:'',
  FREE_SUM: '',
  ID: '',
  INTERNALTRADE_ID:'',
  INTERNAL_NAME:"",
  INTERNAL_TYPE:"",
  ORDER_ID:'',
  SELF_AMOUNT:'',
  SELF_SUM:'',
  STATE:"",
  SUM:'',
  TRADE_NAME:"",
  UNIT_NAME:"",
  UNIT_PRICE:'',
};
export default {
    name: 'PreOrder',
    components: {
      toolbar,sumprice,FooterDetail
    },
    //页面创建钩子函数

    // 1. 查看vuex中是否存有页面的数据,有表示是点击toolbar跳转了, 需要将缓存的数据加载进去
    // 2. 查看vuex中是否存有ID, 有代表是查询订单,需要findbyID
    // 3. 不满足以上情况就是新建页面,需要获取上下张边界
    created: function () {
      var ID;
      if(this.$store.state.tempOrderDetailData.ID != null){
        console.log('存有订单tempOrderDetailData')
        this.fillData(this.$store.state.tempOrderDetailData);
      }
      else if(this.$store.state.OrderDetailID != 0){
        console.log('存有订单ID,并且ID为')
        console.log(this.$store.state.OrderDetailID)
        this.findbyid(this.$store.state.OrderDetailID);
        this.$store.state.OrderDetailID = 0;  //找完之后立即讲ID置为0,防止页面切换时再次查找此ID
      }
      this.getPageRegion();
    },
    //关闭这个页面时需要将留着页面上的数据销毁
    destroyed: function(){
      console.log('原始订单页面销毁')
    },
    computed: {
      summation: function(){
        let sum = 0;
        for(let i in this.detail.rows){
          let unitSum = 0;
          this.detail.rows[i].SUM = this.detail.rows[i].UNIT_PRICE * this.detail.rows[i].AMOUNT;
          sum += this.detail.rows[i].SUM;
        }
        this.detail.LUMP_SUM = sum;
        return sum;
      }
    },
    data() {
      return {
        detail: message,  //页面信息
        maxPage: 0,
        minPage: 0,
        selecting: 999,   //表格选中行号,当selecting == 行的ID, 显示input框
        heighLightingRow: 999,  //高亮栏. 只需要选中,不展示input, 用于删除
        editingRow: {},     // 正在编辑行,用来填正在编辑时的input
        tempEditingRow:{},  // 保存正在编辑行的原状态
        urlhead: 'http://222.196.35.35:9080/GSMS/', // 方便测试
        pickerOptions: {  // 用与日期选择器,今天后不可选
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        }
      }
    },
    methods: {
      //toolbar组件监听事件, toolbar组件emit某图标被点击, 传回被点击图标信息
      getToolEvent(func){
        eval("this." + func); //eval() 函数可计算某个字符串，并执行其中的的 JavaScript 代码。
      },
      //上下载张
      /* 判断是否存在上下张,拼接url, 调用获取数据函数,讲选中行与正在编辑行置空
       *
      */
      changePage(order) {
        console.log('上下载张时当前页数')
        console.log(this.detail.ID)
        // this.canceleEit();-------------------改
        this.OverEdit();
        let url;
        url = this.urlhead;
        if (order) {
          if(this.detail.ID < this.maxPage){
            url += 'logistics/originalorder/next.do?ID=' + this.detail.ID;
          }else{
            this.$notify({
              title: '警告',
              message: '没有下张',
              type: 'warning'
            });
            return;
          }
        }
        else{
          if(this.detail.ID > this.minPage){
            url += 'logistics/originalorder/pre.do?ID=' + this.detail.ID;
          }else{
            this.$notify({
              title: '警告',
              message: '没有上张',
              type: 'warning'
            });
            return;
          }
        }
        this.loadData(url);
      },
      //新增订单
      //讲detail中数据职位空, 将新增行flag置为false,将表格留下一行,并让那行数据为空,将合计价置为空,编辑中行置空,当前页ID置为最大页
      addOrder() {
        //获取页数范围
        for(let i in this.detail){
          if(this.detail[i] == this.detail.rows)
            continue;
          this.detail[i] = '';
        }
        let temp = this.detail.rows[0];
        this.detail.rows = [];
        this.detail.rows[0] = temp;
        for(let i in this.detail.rows[0]){
          this.detail.rows[0][i] = '';
        }
        this.OverEdit();
      },
      //获取数据
      //讲数据存到vuex中,使得页面切换时不需要重新加载,调用填充页面函数
      loadData(url) {
        axios.get(url).then((response)=>{
          this.$store.state.tempOrderDetailData = response.data;
          this.fillData(response.data);
          //改变存储ID,形成链接
        }).catch((error)=>{
            console.log(error);
        });
      },
      //数据填写页面
      fillData(response){
        this.detail = response;
      },
      //保存订单
      //先保存行
      //如果是已审核页面,警告并return
      //如果配送单位,配送时间未填---警告并return
      //如果不是未审核页面,拼接保存url,是拼接更新URL,
      //提交数据, 如果 返回提示结果成功, 是新增页就填写订单号与ID,存储ID,调用修改审核图片函数,不是提示保存成功
      //查找当前页,
      //更新页数范围
      saveOrder(){
        this.saveRow();
        console.log(this.detail)
        if(this.detail.isVertify == '1'){
          this.$notify({
              title: '警告',
              message: '审核后页面不可编辑',
              type: 'warning'
            });
          return;
        }
        if(this.detail.CUSTOMER_NAME == ''){
          this.$message({
            message: '请选择配送单位',
            type: 'warning'
          });
          return;
        }
        if(this.detail.DISTRIBUTION_DATE == ''){
          this.$message({
            message: '请选择配送时间',
            type: 'warning'
          });
          return;
        }
        let data = this.detail;
        let url = this.urlhead;
        if(this.detail.ISVERIFY !== 0){
          url += 'logistics/originalorder/save.do'
        }
        else{
          url += 'logistics/originalorder/update.do'
        };
        let me = this;
        console.log('提交的数据')
        console.log(this.detail);
        axios.post(url ,qs.stringify({
          a: this.detail
        }))
        .then(function(res){
          console.log(res.data)
          if(me.detail.ISVERIFY !== 0){
            me.detail.ORDER_NO = res.data.data.ORDER_NO;
            me.detail.ISVERIFY = '0';
            me.detail.ID = res.data.data.ID;
            me.$message({
              message: '保存成功',
              type: 'success'
            });
          }else{
            me.$message({
              message: '修改保存成功',
              type: 'success'
            });
          }
           me.findbyid(me.detail.ID);
           me.getPageRegion();
          })
          .catch(function(err){
            console.log(err)
          })
      },

      //删除订单
      //判定是否为新增与已审核页面, 提示是否删除, 是则删除,调用删除接口,如果删除成功就下一张或新增一张
      deleteOrder() {
        let me = this;
        //页面为新增页面，不能删除
        console.log('删除时查看数据')                                                
        console.log(this.detail)
        if(this.detail.ISVERIFY ===''){
          this.$notify({                                
              title: '提示',
              message: '该页面为新增页面，不能删除！',
              type: 'warning'
            });
        }
        else if(this.detail.ISVERIFY =='1'){
          this.$notify({
              title: '提示',
              message: '该页面已审核，不能删除！',
              type: 'warning'
            });
        }
        else{
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            console.log('删除的ID')
            console.log(this.detail.ID)
            console.log('最大张')
            console.log(this.maxPage);
            axios.post(this.urlhead + 'logistics/originalorder/delete.do' ,qs.stringify({
               ID: this.detail.ID
            }))
            .then(function(res){
              if(res.data.message === "success"){
                //  alert("审核成功");
                if(me.detail.ID === me.maxPage){
                  alert('新增')
                  this.addOrder();
                }else{
                  alert('下账')
                  me.changePage(1);
                }
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
            }
          })
            .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        })
        }
      },
      //审核订单
      //调用审核接口,成功后调用改变审核图片函数
      checkOrder() {
        let me = this;
        if(this.detail.ID < this.minPage || this.detail.ID > this.maxPage || this.detail.ID == '') {
          this.$notify({
              title: '提示',
              message: '该页面为新增页面，不能进行审核操作！',
              type: 'warning'
            });
        } else if(this.detail.ISVERIFY == '1') {
          this.$notify({
              title: '提示',
              message: '该订单已通过审核，无须再审！',
              type: 'warning'
            });
        } else {
          axios.post(this.urlhead + 'logistics/originalorder/verify.do' ,qs.stringify({
             ID: this.detail.ID
          }))
          .then(function(res){
            if(res.data.message === "success"){
            //  alert("审核成功");
              me.detail.ISVERIFY = '1';
            }
          })
          .catch(function(err){
            console.log(err)
          })
        }
      },
      //查询,跳转到InquiryOrder页面
      inquire() {
        this.$router.push({path: 'InqueryOrder'});
      },
      /* 例: 高水配送单位查询
       * 下拉框,点击时候获取数据
       * queryString 在框中输入的值
       * callback 获取数据后网下拉列中的数据
      */
      querySearchAsync(queryString, callback) {
        var list = [{}];
        //从后台获取到对象数组
        let url = this.urlhead + 'logistics/customer/findbypinyin?PINYINFIELDNAME=' + queryString;
         axios.get( url ).then((response)=>{
            //在这里为这个数组中每一个对象加一个value字段, 因为autocomplete只识别value字段并在下拉列中显示
            for(let i of response.data){
              i.value = i.CUSTOMER_NAME;  //将CUSTOMER_NAME作为value
            }
            list = response.data;
            callback(list);
          }).catch((error)=>{
              console.log(error);
          });
      },
      //配送单位选中联动
      //选中时保存多项信息
      handleSelect(item) {
        this.detail.CUSTOMER_TYPE = item.CUSTOMER_TYPE;
        this.detail.CUSTOMER_ID = item.ID;
        this.detail.CUSTOMERTYPE_ID = item.TYPE_ID;
      },
      //按照ID查找,查找后充页面
      findbyid(ID){
        let url = this.urlhead + 'logistics/originalorder/findbyid.do?ID=' + ID;
        axios.get(url).then((response)=>{
          this.fillData(response.data);
        }).catch((error)=>{
            console.log(error);
        });
      },

//////////////////////////////////表格///////////////////////////////////////

 
      //选中某行
      //如果是第一行,让他的ＩＤ等于－１；关联选中行与editingRow,深拷贝tempediting
      selectrow(row, event){
        if(this.detail.ISVERIFY =='1' || row.ID == this.selecting)
          return;
        if(this.editingRow.INTERNAL_NAME =='' || this.editingRow.AMOUNT == 0 || this.editingRow.UNIT_PRICE ==0){
          this.saveRow();
          return;
        }
        if(this.detail.rows[0].ID =='')
            this.detail.rows[0].ID = -1;
        this.selecting = row.ID;
        this.editingRow = row;  //这里建立一个连接, 就像指针一样,editingrow改变,row也随着改变-----------浅拷贝
        for(let i in this.editingRow ){
          this.tempEditingRow[i] = this.editingRow[i];
        }
      },
      //表格内新增一行
      //讲正在编辑行置空,防止数据复制
      //如果行数为1,并且行内INTERNAL_NAME为空,选中此行
      //否则 判断是否行填写完整, 完整增加一行,此行用const数据newRow深拷贝而来,将新增加行flag置为true,将行内ORDER_ID填写,push到detail.rows中,选中新增的这一行
      addRow(){
          this.OverEdit();
          let index = 0;
          if(this.detail.ISVERIFY =='1')
            return;
          // 当第一行为空时, 选中第一行
          if(this.detail.rows.length ==1 && this.detail.rows[0].INTERNAL_NAME == '' ){
            this.detail.rows[0].ID = -1;
            this.selectrow(this.detail.rows[0], 1);
            console.log('进入当第一行为空时, 选中第一行')
            console.log(this.detail.rows)
          }
          else{
            if(this.editingRow.INTERNAL_NAME =='' || this.editingRow.AMOUNT == 0 || this.editingRow.UNIT_PRICE ==0){
              this.$message({
                message: '请填写完整信息',
                type: 'warning'
              });
              return;
            }
            let tempnewRow =  {};
            for(let i in newRow){
              tempnewRow[i] = newRow[i];
            }
            tempnewRow.ORDER_ID = this.detail.ID;
            this.detail.rows.push(tempnewRow);
            this.detail.rows[this.detail.rows.length-1].ID = 0 - this.detail.rows.length;
            this.selectrow(this.detail.rows[this.detail.rows.length-1], 0);
            this.isadd = true;
          }
      },
      //行内回车事件
      //判断行内编辑是否结束
      saveRow(){
        if(this.editingRow.INTERNAL_NAME =='' || this.editingRow.AMOUNT == 0 || this.editingRow.UNIT_PRICE ==0){
          this.$message({
            message: '请填写完整信息',
            type: 'warning'
          });
           return;
        }
        this.OverEdit();
        console.log(this.detail.rows);
      },
      //表格内删除一行
      //判断是否可删除
      //如果没有选中行,就删除高亮行
      //从detail.rows中删除
      //将选中行,正在编辑行,高亮行置空
      deleteRow(){
        if(this.detail.ISVERIFY =='1')
          return;
        let deleteRowID = this.selecting;
        if(this.selecting == 999){
          deleteRowID = this.heighLightingRow;
        }
        let index = -1;
        for(let i of this.detail.rows){
          index++;
          if(i.ID == deleteRowID){
            this.detail.rows.splice(index, 1);
            break;
          }
        }
        this.OverEdit();
      },
      //高亮某一行
      heighLightRow(row, event, column){
        this.heighLightingRow = row.ID;
        console.log(row.ID);
      },
      //表格内取消编辑一行
      //是新增的就删除
      //将保存的tempEditingRow填回到detail中
      //取消选中
      canceleEit(){
        if(this.isadd == true){
          this.deleteRow();
        }else{
          for(let i in this.editingRow ){
            this.editingRow[i] = this.tempEditingRow[i];
            console.log(this.tempEditingRow[i])
          }
          this.OverEdit();
        }
      },
      OverEdit(){
        this.selecting = 999;
        this.heighLightingRow = 999;
        this.editingRow = {};
        this.isadd = false;
      },
      //内部商品名查询
      //获取数据
      searchName(queryString, cb) {
        var list = [{}];
         axios.get( this.urlhead + 'logistics/internaltrade/findbypinyin?PINYINFIELDNAME=' + queryString).then((response)=>{
            for(let i of response.data){
              i.value = i.INTERNAL_NAME;
            }
            list = response.data; 
            cb(list);
          }).catch((error)=>{
              console.log(error);
          });
      },
      //内部商品名选中联动
      //填写数据
      changeTypeUnit(item){
        this.editingRow.INTERNAL_TYPE = item.INTERNAL_TYPE;
        this.editingRow.UNIT_NAME = item.UNIT_NAME;
        this.editingRow.INTERNALTRADE_ID = item.TYPE_ID;
      },
      //获取上下张范围
      //填写maxPage与minpage
      getPageRegion(callback) {
        let url = this.urlhead + "logistics/originalorder/getmaxminid.do";
        axios.get(url).then((response)=>{
          this.maxPage = response.data.MAXID;
          this.minPage = response.data.MINID;
          if(callback != null){
            callback();
          }
        }).catch((error)=>{
            console.log(error);
        })
      },
      //用@change调用,目的是保证存储的格式
      getStartdata(date){
        this.detail.DISTRIBUTION_DATE = date;
      }
  }
}


</script>

<!-- -------------- CSS -------------- -->
<style scoped>

.toolbar {
  margin: 0;
  width: 100%;
  background-color:#eee;
}
.el-button {
  margin:2px 5px;
  border: 1px solid #eee;
  background-color:#eee;
}
.el-button:hover{
  border: 1px solid #ccc;
  border-radius: 10px;
}
.details{
  width: 70%;
  margin: 20px auto;
}
.vertify{
  position: absolute;
  right: 0;
  width: 90px;
}
.displaytable {
  width:70%;
  margin:0 auto;
  height:80px;
}
.displaytable .lable {
  display:inline-block;
  width:150px;
}
.displaytable .input {
  display:inline-block;
  width:250px;
}
.money {
  margin-left:20px;
}
.money input {
  text-indent:10px;
  border:none;
}
.displaytable span {
  color:red;
}
.grid-content {
  min-height:36px;
}
.mybutton{
  padding: 4px 0; margin: 3px;
}
</style>