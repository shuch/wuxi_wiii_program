var pvCurPageParams='';
var util = require('../../utils/util.js')
var app = getApp()
var config = require('../../config.js')
var serverUrl = 'http://skyforest.static.elab-plus.com/wepy_pro/v1-2/'
Page({
    data:{
        serverUrl:serverUrl,
        jbColor1:" #6294A6",//渐变色
        jbColor2:"#3B4B81",//渐变色
        dataList:[],
        list:['123','123','123','123','123'],//面积列表
        picList:[],//设计图列表
        houseType:"",
        despage:'huxingtupian',
        previewFlag:false,
        houseDetail:"",
        active:0,//选中的
        current:0,//轮播索引
        detail:''

    },
    onShareAppMessage(options) {
        let param = {
            clkId:'clk_2cmina_31',
            clkDesPage:'huxingfenxiang',//点击前往的页面名称
            clkName:'huxingfenxiang',//点击前往的页面名称
            type:'CLK',//埋点类型
            pvCurPageName:'huxingtupian',//当前页面
            clkParams:{houseType:this.data.active},//点击参数
            expand:'',
            pvCurPageParams:pvCurPageParams,//当前页面参数
        }
        util.trackRequest(param,app);
        console.log("***houseTypeDetail-onShareAppMessage***",app.globalData.shareToken)
        return {
            title: config.projectName,
            path: '/pages/houseTypeDetail/houseTypeDetail?shareToken='+app.globalData.shareToken+'&detail='+JSON.stringify(this.data.detail)
        }
    },
    pre:function(){
        this.setData({"current":this.data.current-1})
    },
    next:function(){
        this.setData({"current":this.data.current+1})
    },
    checkOutHouse(e){
        var id=e.currentTarget.dataset.id;//点击的索引
        var para={
            clkId:'clk_2cmina_30',
            clkName:'huxingxuanze',
            clkDesPage:'huxingtupian',//点击前往的页面名称
            type:'CLK',//埋点类型
            clkParams:{houseType:id},//点击参数
            pvCurPageName:'huxingye',//当前页面
            pvCurPageParams:pvCurPageParams,//当前页面参数
        }
        util.trackRequest(para,app)
        this.setData({
            'active':e.target.dataset.id,
            'current':0
        })
        var index=e.target.dataset.index,houseList=this.data.dataList;
        this.setData({
            'houseType':(houseList[index].room?houseList[index].room+'室':'')+(houseList[index].hall?houseList[index].hall+'厅':'')+(houseList[index].kitchen?houseList[index].kitchen+'厨':'')+(houseList[index].toilet?houseList[index].toilet+'卫':''),
            'houseDetail':houseList[index].propertyType+' | '+houseList[index].floorHeight+'M | '+houseList[index].orientation,
            'picList':houseList[index].layoutImageResponseList
        })
    },
    bindchange:function(e){
        this.setData({'current':e.detail.current})
    },
    priviewPic1:  function (event) {
        // //图片预览
        var src = this.data.picList[event.currentTarget.dataset.index].imageUrl;
        var urls=this.data.picList.map(function (v) {
            return v.imageUrl
        })
        // urls.push(src)
        this.data.previewFlag = true;
        console.log(urls);
        wx.previewImage({
            current:src, // 当前显示图片的http链接
            urls: urls // 需要预览的图片http链接列表
        })
    },
    goChatList:function(e){
        var isSend = wx.getStorageSync('isSend'+config.houseId);
        if (!isSend) { //没聊天
            var para={
                clkId:'clk_2cmina_32',
                clkDesPage:'xuanzeguwenliebiao',//点击前往的页面名称
                clkName:'huxingzaixianzixun',//点击前往的页面名称
                type:'CLK',//埋点类型
                pvCurPageName:'huxingtupian',//当前页面
                pvCurPageParams:pvCurPageParams,//当前页面参数
            }
            util.trackRequest(para,app)
            wx.navigateTo({
                url: '../counselorList/counselorList'
            })
        } else {
            var para={
                clkId:'clk_2cmina_32',
                clkDesPage:'xiaoxiliebiao',//点击前往的页面名称
                clkName:'huxingzaixianzixun',//点击前往的页面名称
                type:'CLK',//埋点类型
                pvCurPageName:'huxingtupian',//当前页面
                pvCurPageParams:pvCurPageParams,//当前页面参数
            }
            util.trackRequest(para,app)
            wx.navigateTo({
                url: '../messagesList/messagesList'
            })
        }
    },
    onShow: function(e){
        console.log('onshow')
        var that = this;
        wx.setStorageSync('loadTime',new Date().getTime())
        app.login(function () {
            if(that.data.previewFlag){
                that.data.previewFlag=false
                return
            }
            var para={
                pvId:'P_2cMINA_10',
                type:'PV',//埋点类型
                pvCurPageParams:{houseType:that.data.active},//点击参数
                pvCurPageName:'huxingtupian',//当前页面
                pvLastPageName:'huxingye',//上-页面
                pvPageLoadTime:(new Date().getTime() - wx.getStorageSync('loadTime')),//加载时间
            }
            util.trackRequest(para,app)
            console.log('已发送埋点')
        })
    },
    onUnload(){
        util.stopTrackEventTimeObj();
    },
    onHide(){
        util.stopTrackEventTimeObj();
    },
    onLoad:function(options){
        pvCurPageParams=JSON.stringify(options)
        console.log("****houseTypeDetail-onload**",pvCurPageParams,options.detail,)
        var detail =app.globalData.houseTypeDetail||JSON.parse(options.detail);
        var houseList =detail.houseList;
        var index =detail.index;
        // app.globalData.fromChannel = options.shareToken||'';
        if(options&&options.shareToken&&options.shareToken!="null"&&options.shareToken!="undefined"){
            app.globalData.fromChannel = options.shareToken
        }
        wx.setNavigationBarTitle({
            title: detail.currentName
        })
        this.setData({
            'dataList':houseList,
            'detail':detail,
            'active':detail.id,
            'houseType':(houseList[index].room?houseList[index].room+'室':'')+(houseList[index].hall?houseList[index].hall+'厅':'')+(houseList[index].kitchen?houseList[index].kitchen+'厨':'')+(houseList[index].toilet?houseList[index].toilet+'卫':''),
            'houseDetail':houseList[index].propertyType+' | '+houseList[index].floorHeight+'M | '+houseList[index].orientation,
            'picList':houseList[index].layoutImageResponseList
        })
    }
})