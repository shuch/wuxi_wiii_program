import {trackRequest} from "../../utils/util";

var util = require('../../utils/util.js')
var app = getApp()
var config = require('../../config.js')
import regeneratorRuntime from '../../lib/runtime';
import endpoint from '../../lib/endpoint';
import { login } from '../../lib/promise';
var pvCurPageParams=null

var serverUrl = 'https://dm.static.elab-plus.com/wuXiW3/recommendedPlan/'
Page({
    data:{
        serverUrl:serverUrl,
        mask2:'#272A34',
        hasPlan:false,
        current:0,
        layout:{},
        programme:{},
        designer:{},
        imgUrlPram:[]
    },
    onShow:async function(e){
        wx.setNavigationBarTitle({
            title: '设计师推荐'
        })

        const appData = await login();
        const { id: customerId, houseId } = appData;
        const data =  await endpoint('customState', { customerId, houseId });
        if(data.success){
            this.setData({hasPlan:data.single.customizedStatus==1})
        }
         const param = {
                type: 'PV',
                pvId: 'P_2cdinzhi_7',
                pvCurPageName: 'tuijianfangan',
            };
        trackRequest(param);

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
        console.log(!!programme.image3d)
    },
    async save(){

        const appData = await login();
        const { id: customerId, houseId } = appData;
        const data = await endpoint('saveDesignerRecommend', { customerId, houseId });
        if(data.success){
            wx.navigateTo({ url: '/pages/customPay/customPay' });
        }
    },
    imgOnload(e){
        console.log(e.detail);
        let imgUrlPram =this.data.imgUrlPram;
        imgUrlPram[e.detail.index]=710/e.detail.width*e.detail.height;
        this.setData({imgUrlPram})
    },
    toDiy(){
        const url = `/pages/customHouse/customHouse`
        wx.navigateTo({ url });
    },

    onRoute3D() {
        const src = encodeURIComponent(this.data.programme.image3d);
        const url = `/pages/webView/webView?view=${src}`;
        wx.navigateTo({ url });
    },
    toIM(){

        var isSend = wx.getStorageSync('isSend'+config.houseId);
        if (!isSend) { //没聊天
            var para={
                clkId:'clk_2cmina_23',
                clkDesPage:'xuanzeguwenliebiao',//点击前往的页面名称
                clkName:'zaixianzixun',//点击前往的页面名称
                type:'CLK',//埋点类型
                pvCurPageName:'zhuye',//当前页面
                pvCurPageParams:pvCurPageParams,//当前页面参数
            }
            util.trackRequest(para,app)
            wx.navigateTo({
                url: '../counselorList/counselorList'
            })
        } else {
            var para={
                clkId:'clk_2cmina_23',
                clkDesPage:'xiaoxiliebiao',//点击前往的页面名称
                clkName:'zaixianzixun',//点击前往的页面名称
                type:'CLK',//埋点类型
                pvCurPageName:'zhuye',//当前页面
                pvCurPageParams:pvCurPageParams,//当前页面参数
            }
            util.trackRequest(para,app)
            wx.navigateTo({
                url: '../messagesList/messagesList'
            })
        }
    },
    onUnload(){
    },
    onHide(){
    },

    onLoad:function(options) {
        this.initData()
        pvCurPageParams=JSON.stringify(options)
    }
})
