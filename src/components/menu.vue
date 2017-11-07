<template>
	<div >
		<!-- 主菜单 -->
		<el-row class = menu>
		  	<el-col :span="6" max-height="60px"><img width="290px" style="height: 60px; margin-bottom: -15px;" src="../assets/GSlogo.png"></el-col>
		  	<el-col :span="14" >
		  	<el-menu  mode="horizontal" class="menubk">
		  	  <el-submenu 
		  	  	v-bind:index=menu.menuid v-for="(menu, index) in basic"
		  	  	class="maxmenu"
		  	   >
			    <template slot="title" >{{menu.menuname}}</template>
			    <el-menu-item 
				    v-for="(midmenu, midindex) in basic[menu.menuid-1].menus"
				    v-bind:index=midmenu.menuid
				    class="midmenu"
				>
				<div v-on:mouseenter="menuindex = midmenu.menuid">
					{{midmenu.menuname}}
				</div>
					<ul class="minmenu" v-show="midmenu.menuid === menuindex">
						<li 
							v-for="(minmenu, index) in basic[menu.menuid-1].menus[midindex].menus"
						    v-bind:index=minmenu.menuid
					    >
					    <div @click="select(minmenu.url,minmenu.menuname)">{{minmenu.menuname}}</div>
						</li>
					</ul>
				</el-menu-item>
			  	</el-submenu>
		  	</el-menu>
		  </el-col>
		  <el-col :span="2">
		  	<div style="text-align: center;margin-top: 15px;cursor: pointer;"><img src="../assets/man.png"> {{user}} <i class="el-icon-caret-bottom"></i></div>
		  </el-col>
		</el-row>
		<el-tabs
			style="margin: -4px 0 -15px;"
            v-model="activeIndex"
            closable
            @tab-click="tabClick"
            v-if="options.length"
            @tab-remove="tabRemove">
            <el-tab-pane
              :key="item.name"
              v-for="(item, index) in options"
              :label="item.name"
              :name="item.route">
            </el-tab-pane>
          </el-tabs>
		<router-view></router-view>
		<!-- 首页内容 -->
		<div v-show="this.$store.state.activeIndex == '/'">
			<h1>您好,我是首页</h1> 
		</div>
	</div>
</template>

<script>
import PreOrder from '@/components/PreOrder'
import NetOrder from '@/components/NetOrder'
import InqueryOrder from '@/components/InqueryOrder'
export default {
    name: 'Menu',
    components: {
    	PreOrder,NetOrder,InqueryOrder
    },
    mounted () {
      // 刷新时以当前路由做为tab加入tabs
      if (this.$route.path !== '/') {
        this.$store.commit('add_tabs', {route: '/', name: '首页'});
        this.$store.commit('add_tabs', {route: this.$route.path , name: this.$route.name });
      } else {
        this.$store.commit('add_tabs', {route: '/', name: '首页'});
      }
      this.$store.commit('set_active_index', this.$route.path);
    },
    computed:{
	    options () {
	      return this.$store.state.options;
	    },
	    activeIndex: {
	      get () {
	        return this.$store.state.activeIndex;
	      },
	      set (val) {
	        this.$store.commit('set_active_index', val);
	      }
	    }
 	},
 	watch: {
    '$route'(to) {
      let flag = false;
      for (let option of this.options ) {
        if (option.name === to.name) {
          flag = true;
          this.$store.commit('set_active_index', to.path);
          break
        }
      }
      if (!flag) {
        this.$store.commit('add_tabs', {route: to.path, name: to.name});
        this.$store.commit('set_active_index', to.path);
      }
    }
  },
    methods: {
    	tabClick () {
	      this.$router.push({path: this.activeIndex});
	    },
	    tabRemove (targetName) {
	      this.$store.commit('delete_tabs', targetName);
	      if (this.activeIndex === targetName) {
	        // 设置当前激活的路由
	        if (this.options && this.options.length >= 1) {
	          this.$store.commit('set_active_index', this.options[this.options.length-1].route);
	          this.$router.push({path: this.activeIndex});
	        } else {
	          this.$router.push({path: '/'});
	        }
	      }
	    },
      	//点击最底层菜单,传入url
      	select(route,name){
      		if(route.match('.html') != null){
      			return;
      		}
      		 // this.$store.commit('addtab',[name,route]);
      		this.$router.push({path: route});
      	},
	},
    data() {
    	return {
    		user: '用户',
        	editableTabs2: [{
          	title: 'Tab 1',
          	name: '1',
          	content: 'Tab 1 content'
        	}, {
	          title: 'Tab 2',
	          name: '2',
	          content: 'Tab 2 content'
        	}],
        	tabIndex: 2,
    		menuindex: 0,
    		basic: [{
				"menuid": "1",
				"menuname": "物流管理",
				"icon": "icon-logistic",
				"menus": [{
						"menuid": "011",
						"menuname": "原始单据",
						"menus": [{
							"menuid": "0112",
							"menuname": "手工订单",
							"url": "PreOrder"
						}, {
							"menuid": "0111",
							"menuname": "网络订单",
							"url": "NetOrder"
						}]
					}, {
						"menuid": "012",
						"menuname": "采购流程",
						"icon": "icon-logistic",
						"menus": [{
							"menuid": "0121",
							"menuname": "销售订单",
							"url": "UI/LOGISTICS/SellOrder/SellOrderAdd.html"
						}, {
							"menuid": "0122",
							"menuname": "采购单",
							"url": "UI/LOGISTICS/PurchaseOrder/PurchaseOrderSearch.html"
						}, {
							"menuid": "0123",
							"menuname": "入库单",
							"url": "UI/LOGISTICS/WareHouseSchedule/WareHouseScheduleSearch.html"
						}, ]
					}, {
						"menuid": "013",
						"menuname": "销售流程",
						"menus": [{
							"menuid": "0131",
							"menuname": "销售单",
							"url": "salesOrder.html"
						}, {
							'menuid': "0132",
							"menuname": "出库单",
							"url": "UI/LOGISTICS/WareHouseOutOrder/WareHouseOutOrderSearch.html"
						}, {
							'menuid': "0133",
							"menuname": "配送管理",
							"url": "UI/LOGISTICS/DeliverManagementOrder/DeliverManagementOrderSearch.html"
						}, {
							'menuid': "0134",
							"menuname": "销售结算",
							"url": "UI/LOGISTICS/SalesSettlementOrder/SalesSettlementSearch.html"
						}, ]
					}, {
						"menuid": "014",
						"menuname": "库房管理",
						"menus": [{
							'menuid': "0141",
							"menuname": "库存盘点",
							"url": "UI/LOGISTICS/InventoryOrder/InventoryOrderAdd.html"
						}, {
							'menuid': "0142",
							"menuname": "冲销帐",
							"url": "UI/LOGISTICS/WriteOff/WriteOffAdd.html"
						}, {
							"menuid": "0143",
							"menuname": "移库单",
							"url": "UI/LOGISTICS/StockTransferOrder/StockTransferOrderAdd.html"
						}, ]
					}, {
						"menuid": "015",
						"menuname": "物流管理日志",
						"menus": [{
							'menuid': "0151",
							"menuname": "订单日志",
							"url": "UI/LOGISTICS/ExecuteOrder/ExecuteOrderList.html"
						}, {
							'menuid': "0152",
							"menuname": "修改记录",
							"url": "UI/LOGISTICS/Log/LogSearch.html"
						}, ]
					},
					{
						"menuid": "016",
						"menuname": "价格维护",
						"menus": [{
							'menuid': "0161",
							"menuname": "后定价价格维护",
							"url": "UI/LOGISTICS/BasicInformationPrice/BasicInformationPriceAdd.html"
						}, {
							'menuid': "0162",
							"menuname": "采购价格价格维护",
							"url": "UI/LOGISTICS/BasicInformationInPrice/BasicInformationInPriceAdd.html"
						}, ]
					},
				]
			}, {
				"menuid": "2",
				"menuname": "市场管理",
				"icon": "icon-market",
				"menus": [{
					"menuid": "021",
					"menuname": "商户管理",
					"menus": [{
						"menuid": "0211",
						"menuname": "固定商户管理",
						"url": "UI/Market/BusinessInformation/BusinessInformationSearch.html"
					}, {
						"menuid": "0212",
						"menuname": "小商户管理",
						"url": "UI/Market/SmallBusinessInformation/SmallBusinessInformationSearch.html"
					}]
				}, {
					"menuid": "022",
					"menuname": "合同管理",
					"menus": [{
							"menuid": "0221",
							"menuname": "合同管理",
							"url": "UI/Market/BIContract/BIContractSearch.html"
						},
						{
							"menuid": "0222",
							"menuname": "合同汇总",
							"url": "UI/Market/BoothManagement/BoothManagementStatistics.html"
						}
					]
				}, {
					"menuid": "023",
					"menuname": "摊位管理",
					"menus": [{
							"menuid": "0231",
							"menuname": "摊位管理",
							"url": "UI/Market/BoothManagement/BoothManagementSearch.html"
						},
						{
							"menuid": "0231",
							"menuname": "摊位卡证管理",
							"url": "UI/Market/BoothCard/BoothCardList.html"
						}
					]
				}, {
					"menuid": "024",
					"menuname": "事件管理",
					"menus": [{
						"menuid": "0241",
						"menuname": "突发事件",
						"url": "UI/Market/EmergentEventManagement/EmergentEventsAdd.html"
					}, {
						"menuid": "0242",
						"menuname": "退市事件",
						"url": "UI/Market/DelistEventManagement/DelistEventManagementAdd.html"
					}, {
						"menuid": "0243",
						"menuname": "纠纷事件",
						"url": "UI/Market/DisputeEventManagement/DisputeEventManagementAdd.html"
					}, {
						"menuid": "0244",
						"menuname": "商户表彰",
						"url": "UI/Market/CommendEventManagement/CommendEventsAdd.html"
					}, {
						"menuid": "0245",
						"menuname": "商户违章",
						"url": "UI/Market/PeccancyEventManagement/PeccancyEventManagementAdd.html"
					}]
				}, {
					"menuid": "025",
					"menuname": "设备管理",
					"menus": [{
						"menuid": "0251",
						"menuname": "设备管理",
						"url": "UI/Market/EquipmentManagement/EquipmentManagementSearch.html"
					}, {
						"menuid": "0252",
						"menuname": "设备维护",
						"url": "UI/Market/EquipmentRepairManagement/EquipmentRepairManagementAdd.html"
					}, ]
				}, {
					"menuid": "026",
					"menuname": "收费管理",
					"menus": [{
						"menuid": "0261",
						"menuname": "收费管理",
						"url": "UI/Market/Receipt/receiptAdd.html"
					}]
				}, {
					"menuid": "027",
					"menuname": "市场地图",
					"menus": [{
						"menuid": "0271",
						"menuname": "主地图",
						"url": "UI/Market/MAP/MarketMap.html"
					}, {
						"menuid": "0272",
						"menuname": "蔬菜区地图",
						"url": "UI/Market/MAP/Map_2_1.html"
					}, {
						"menuid": "0273",
						"menuname": "水果区地图",
						"url": "UI/Market/MAP/Map_2_2.html"
					}]
				}, {
					"menuid": "028",
					"menuname": "关怀系统",
					"menus": [{
						"menuid": "0281",
						"menuname": "即时短信",
						"url": "UI/Market/SMSInTime/SMSInTimeList.html"
					}, {
						"menuid": "0282",
						"menuname": "定时短信",
						"url": "UI/Market/SMSScheduler/SMSSchedulerList.html"
					}, {
						"menuid": "0282",
						"menuname": "短信模板",
						"url": "UI/Market/SMSModule/SMSModuleList.html"
					}, {
						"menuid": "0282",
						"menuname": "短信发送情况",
						"url": "UI/Market/SMSScheduler/SMSScheduleSendList.html"
					}, ]
				}, {
					"menuid": "029",
					"menuname": "食品安全",
					"menus": [{
						"menuid": "0291",
						"menuname": "安全事件",
						"url": "UI/Market/FoodSecurityManagement/FoodSecurityManagementSearch.html"
					}, {
						"menuid": "0292",
						"menuname": "抽查周期",
						"url": "UI/Market/FoodSecurityCycle/FoodSecurityCycleList.html"
					}]
				}]
			}, {
				"menuid": "3",
				"menuname": "气调库管理",
				"icon": "icon-frozencave",
				"menus": [{
					"menuid": "031",
					"menuname": "库房管理",
					"menus": [{
							"menuid": "0311",
							"menuname": "库房信息",
							"url": "UI/FrozenCave/StoreHouseInformation/StoreHouseInformationSearch.html"
						}, {
							"menuid": "0312",
							"menuname": "租赁操作",
							"url": "UI/FrozenCave/LeasingOperation/LeasingOperationList.html"
						}, {
							"menuid": "0313",
							"menuname": "库房维修维护",
							"url": "UI/FrozenCave/StoreHouseRepair/StoreHouseRepairAdd.html"
						}, {
							"menuid": "0314",
							"menuname": "包库管理",
							"url": "UI/FrozenCave/PackageStoreHouse/PackageStoreHouseSearch.html"
						},
						{
							"menuid": "0314",
							"menuname": "库房温度记录表",
							"url": "UI/FrozenCave/WarehouseTemperature/WarehouseTemperatureList.html"
						},

					]
				}, {
					"menuid": "032",
					"menuname": "租户管理",
					"menus": [{
						"menuid": "0321",
						"menuname": "租户基础信息",
						"url": "UI/FrozenCave/TenantInformation/TenantInformationSearch.html"
					}, {
						"menuid": "0322",
						"menuname": "租户明细账",
						"url": "UI/FrozenCave/TenantCharge/TenantChargeSearch.html"
					}]
				}]
			}, {
				"menuid": "4",
				"menuname": "基础信息",
				"icon": "icon-information",
				"menus": [{
					"menuid": "041",
					"menuname": "物流基础信息",
					"menus": [{
							"menuid": "0411",
							"menuname": "供货单位",
							"url": "UI/LOGISTICS/BasicInformation/BasicInformationSupplyUnitList.html"
						}, {
							"menuid": "0412",
							"menuname": "商品转换表",
							"url": "UI/LOGISTICS/BasicInformation/BasicInformationConvertTableList.html"
						}, {
							"menuid": "0413",
							"menuname": "订货单位",
							"url": "UI/LOGISTICS/BasicInformation/BasicInformationOrderUnitList.html"
						}, {
							"menuid": "0414",
							"menuname": "内部商品管理",
							"url": "UI/LOGISTICS/BasicInformation/BasicInformationInternalProductGradingList.html"
						}, {
							"menuid": "0414",
							"menuname": "内部商品类型",
							"url": "UI/Market/DictData/DictDataAdd.html?id=internaltradetype"
						}, {
							"menuid": "0418",
							"menuname": "用户组",
							"url": "UI/Market/DictData/DictDataAdd.html?id=customertype"
						}, {
							"menuid": "0419",
							"menuname": "库房名称",
							"url": "UI/Market/DictData/DictDataAdd.html?id=logisticsstorehouse"
						}, {
							"menuid": "0420",
							"menuname": "商品质量",
							"url": "UI/Market/DictData/DictDataAdd.html?id=logisticslevel"
						},
						{
							"menuid": "0420",
							"menuname": "配送类型",
							"url": "UI/Market/DictData/DictDataAdd.html?id=delivertype"
						},
					]

				}, {
					"menuid": "042",
					"menuname": "市场基础信息",
					"menus": [{
							"menuid": "0421",
							"menuname": "卡证信息",
							"url": "UI/Market/DictData/DictDataAdd.html?id=boostcard"
						}, {
							"menuid": "0282",
							"menuname": "短信设置",
							"url": "UI/Market/SMSModule/SMSConfig.html"
						}, {
							"menuid": "0282",
							"menuname": "责任书",
							"url": "UI/Market/DictData/DictDataAdd.html?id=duty"
						}, {
							"menuid": "0282",
							"menuname": "短期合同名称",
							"url": "UI/Market/DictData/DictDataAdd.html?id=shorttype"
						}, {
							"menuid": "0282",
							"menuname": "合同类型",
							"url": "UI/Market/DictData/DictDataAdd.html?id=contracttype"
						}, {
							"menuid": "0282",
							"menuname": "市场收费类型",
							"url": "UI/Market/DictData/DictDataAdd.html?id=marketchargetype"
						}, {
							"menuid": "0282",
							"menuname": "营业执照类型",
							"url": "UI/Market/DictData/DictDataAdd.html?id=businesslicensetype"
						}, {
							"menuid": "0282",
							"menuname": "设备类型",
							"url": "UI/Market/DictData/DictDataAdd.html?id=devicetype"
						},
						{
							"menuid": "0282",
							"menuname": "市场区域类型",
							"url": "UI/Market/DictData/DictDataAdd.html?id=regiontype"
						},
						{
							"menuid": "0282",
							"menuname": "摊位收费标准",
							"url": "UI/Market/BoothChargeRatio/BoothChargeRatioSearch.html"
						}, {
							"menuid": "0282",
							"menuname": "市场区域名称",
							"url": "UI/Market/Region/RegionAdd.html"
						}
					]
				}, {
					"menuid": "043",
					"menuname": "气调库基础信息",
					"menus": [{
						"menuid": "0431",
						"menuname": "气调库收费类型",
						"url": "UI/Market/DictData/DictDataAdd.html?id=frozenchargetype"
					}, {
						"menuid": "0431",
						"menuname": "气调库收费标准",
						"url": "UI/FrozenCave/FrozenChargeRatio/FrozenChargeRatioSearch.html"
					}, {
						"menuid": "0282",
						"menuname": "库房维护类型",
						"url": "UI/Market/DictData/DictDataAdd.html?id=repairtype"
					}, {
						"menuid": "0283",
						"menuname": "气调库内部商品管理",
						"url": "UI/FrozenCave/InternalGoods/InternalGoodsSearch.html"
					}]
				}]
			}, {
				"menuid": "5",
				"menuname": "基础设置",
				"icon": "icon-usermanagement",
				"menus": [{
					"menuid": "051",
					"menuname": "用户权限",
					"menus": [{
						"menuid": "0512",
						"menuname": "角色管理",
						"url": "UI/Common/roleManager/roleManagerList.html"
					}, {
						"menuid": "0513",
						"menuname": "用户管理",
						"url": "UI/Common/UserManager/UserList.html"
					}, {
						"menuid": "0415",
						"menuname": "部门信息",
						"url": "UI/Market/DictData/DictDataAdd.html?id=department"
					}, {
						"menuid": "0415",
						"menuname": "系统设置",
						"url": "UI/Common/Set/Set.html"
					}, ]
				}, {
					"menuid": "052",
					"menuname": "菜单管理",
					"menus": [{
						"menuid": "0521",
						"menuname": "菜单配置",
						"url": "UI/Common/Menu/MenuList.html"
					}, ]
				}]
			}, ]
    	}
    }
}

</script>

<style scoped>
div{
	margin: 0;
	padding: 0;
}
a{
	text-decoration: none;
	color: black;
}
.tags{
	width: 100%;
	border: 1px solid #39c;
	background-color: rgb(210,224,252);
	position: absolute;
	top: 60px;
	height: 33px;
	border-left: none;
	border-right: none;
}
.tab{
	position: absolute;
	/*top: 80px;*/
}
.el-tag{
	background-color: #fff;
	color: black;
	border-bottom-left-radius: 0px;
	border-bottom-right-radius: 0px; 
}
.el-tag + .el-tag {
    margin-left: 3px;
 }
.menu{
	background-color: rgb(210,224,242);
	height: 60px;
}
.menubk{
	margin: 0 0 -5px ; 
	background-color: rgb(210,224,242);
	height: 60px;
}
.maxmenu{
	background-color: rgb(210,224,242);
}
.maxmenu:hover{
	background-color: rgb(210,224,242);
}
.midmenu{
	position: relative;
	color: #000;
}
.midmenu:hover{
	background-color: rgb(210,224,242);
}
.minmenu{
	display: none;
	position: absolute;
	left: 165px;
	top: -1px;
	display: block;
	width: 165px;
	text-indent: 20px;
	border-radius: 9px;
	border: 1px solid #eee;
}
.minmenu li{
	height: 35px;
	line-height: 35px;
	background-color: rgb(250,250,250);
}
.minmenu li:hover{
	background-color: rgb(210,224,242);
}
.activeTag{
	color: #09c;
}
</style>