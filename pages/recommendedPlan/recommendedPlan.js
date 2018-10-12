var util = require('../../utils/util.js')
var app = getApp()
var config = require('../../config.js')
import regeneratorRuntime from '../../lib/runtime';
import endpoint from '../../lib/endpoint';
import { login } from '../../lib/promise';

var serverUrl = 'https://dm.static.elab-plus.com/wuXiW3/recommendedPlan/'
Page({
    data:{
        serverUrl:serverUrl,
        hasPlan:false,
        current:0,
        layout:{},
        programme:{},
        designer:{},
    },
    onShow:async function(e){
        wx.setNavigationBarTitle({
            title: '设计师推荐'
        })

        const appData = await login();
        const { id: customerId, houseId } = appData;
        const data =  await endpoint('getProcessStatus', { customerId, houseId });
        if(data.success){
            this.setData({hasPlan:data.single.customizedStatus==1})
        }

    },
    onShareAppMessage(options) {
        return {
            title: '设计师推荐',
            path: '/pages/recommendedPlan/recommendedPlan'
        }
    },
    change(e){
        if(e.detail.source!='touch'){
            return false
        }
        this.setData({
            current:e.detail.current
        })
    },
    checkout(e){
        this.setData({
            current:e.currentTarget.dataset.num
        })
    },
    async initData(){
        const houseId =config.houseId;
        const data = await endpoint('designerRecommend', houseId);
        console.log('设计师推荐方案',data);
        if(!data.success){
            return
        }
        const {layout,programme,designer} =data.single;
        this.setData({
            layout,programme,designer
        })
    },
    async save(){

        const appData = await login();
        const { id: customerId, houseId } = appData;
        const data = await endpoint('saveDesignerRecommend', { customerId, houseId });
        if(data.success){
            wx.navigateTo({ url: '/pages/customPay/customPay' });
        }
    },
    toDiy(){
        wx.navigateTo({ url: '/pages/customCenter/customCenter' });
    },
    onUnload(){
    },
    onHide(){
    },

    onLoad:function(options) {
        this.initData()
    }
})
