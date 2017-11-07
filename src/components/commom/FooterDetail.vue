<template>
  <div>
    <el-form label-width="70px" style="width: 1200px; margin: 40px auto 0;">
      <el-form-item label="备注">
        <el-input v-model="MEMO" :readonly="true"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="6">
          <div class="grid-content ">
            <el-form-item label="制单人">
              <el-input v-model="CREATE_MAN" :readonly="true"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content ">
            <el-form-item label="审核人">
              <el-input v-model="AUDITOR" :readonly="true"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content ">
            <el-form-item label=" 审核日期">
              <el-date-picker v-model="AUDITOR_TIME" type="date" placeholder="选择日期" :picker-options="pickerOptions" :readonly="true"></el-date-picker>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content ">
            <el-form-item label="打印次数">
              <el-input v-model="PRINTCOUNT" :readonly="true"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'FooterDetail',
  props:['MEMO','CREATE_MAN','AUDITOR','AUDITOR_TIME','PRINTCOUNT'],
  data(){
  	return{
  		pickerOptions: {  // 用与日期选择器,今天后不可选
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        }
  	}
  },
  computed:{

  }
}
</script>

<style>
body,html,div {
  padding: 0px;
  margin: 0px;
}
</style>