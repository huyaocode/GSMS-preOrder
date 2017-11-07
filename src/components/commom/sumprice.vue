<template>
  <div >
    <div class="money">人名币金额合计
      <input type="text"  v-model="lowSum" readonly>人名币金额合计(大写)
      <input type="text"  v-model="uprSum" readonly>
  </div>
  </div>
</template>

<script>
export default {
	//动态处理数据的方法
	//使用compute检测传来的值
	//使用watch处理数据
  	name: 'sumpirce',
  	props: ['money'],
  	data(){
	  	return {
	  		uprSum: ''
	  	}
	},
  	computed:{
  		lowSum: function(){
  		 	return this.money;  		}
  	},
  	watch:{
  		lowSum :function(val, oldVal){
  			this.uprSum = this.digitUppercase(val)
  		}
  	},
  	methods: {
  	//小写总价转大写总价
      digitUppercase(n) {
        var fraction = ['角', '分'];
        var digit = [
          '零', '壹', '贰', '叁', '肆',
          '伍', '陆', '柒', '捌', '玖'
        ];
        var unit = [
          ['元', '万', '亿'],
          ['', '拾', '佰', '仟']
        ];
        var head = n < 0 ? '欠' : '';
        n = Math.abs(n);
        var s = '';
        for(var i = 0; i < fraction.length; i++) {
          s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
        }
        s = s || '整';
        n = Math.floor(n);
        for(var i = 0; i < unit[0].length && n > 0; i++) {
          var p = '';
          for(var j = 0; j < unit[1].length && n > 0; j++) {
            p = digit[n % 10] + unit[1][j] + p;
            n = Math.floor(n / 10);
          }
          s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
        }
        return head + s.replace(/(零.)*零元/, '元')
            .replace(/(零.)+/g, '零')
            .replace(/^整$/, '零元整');
      }
  }
}
</script>

<style>
.money {
  margin-left:20px;
}
.money input {
  text-indent:10px;
  border:none;
}
</style>
