var util = require('../../utils/util.js')
var config = require('../../config.js')
var app = getApp()
var serverUrl = 'http://skyforest.static.elab-plus.com/wepy_pro/v1-2/'
var {authorizeInfo,getUserInfo} = require('../../getlogininfo.js');
var pvCurPageParams = '';
Page({
    data:{
        serverUrl:serverUrl,
        count:'0',//推荐总人数
        jbColor1:" #6294A6",//渐变色
        jbColor2:"#3B4B81",//渐变色
        list:[],//好友信息列表
        pageNo:1,//初始页码
        total:'',//总页数后台获取
        showInfoModel:false,
        showPhoneModel:false,
        phoneFailFun:null,
        phoneFun:null
    },
    onShow: function(e){
        wx.setStorageSync('loadTime',new Date().getTime())
        let param = {
            type:'PV',
            pvId:'P_2cMINA_11',
            pvCurPageName:'wodetuijian',//当前页面名称
            pvCurPageParams:pvCurPageParams,//当前页面参数
            pvLastPageName:getCurrentPages()[getCurrentPages().length-2]?getCurrentPages()[getCurrentPages().length-2].data.despage:'',//上一页页面名称
            pvLastPageParams:'',//上一页页面参数
            pvPageLoadTime:(new Date().getTime() - wx.getStorageSync('loadTime')),//加载时间
        }
        console.log(param,'埋点')
        util.trackRequest(param,app)
    },
    onUnload(){
        util.stopTrackEventTimeObj();
    },
    onHide(){
        util.stopTrackEventTimeObj();
    },
    transformTime:function (time) {
            var date = new Date(time * 1000);

            var Y = date.getFullYear() + '-',
            M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
            D = (date.getDate()<10?('0'+date.getDate()):date.getDate()) + ' ',
            h = (date.getHours()<10?('0'+date.getHours()):date.getHours()) + ':',
            m = (date.getMinutes()<10?('0'+date.getMinutes()):date.getMinutes()) + ':',
            s = (date.getSeconds()<10?('0'+date.getSeconds()):date.getSeconds()) + ' ';

            return Y+M+D+h+m+s;
        },
    getList:function(){
        var that=this;
        if(that.data.total&&that.data.pageNo>that.data.total){//+1后的pageNo大于total结束
            wx.showToast({
                title: "无更多消息",
                icon: 'warn',
                duration: 1500,
            })
            return false;
        }else{
            wx.showLoading({
                title: '加载中',
            })
        }
        wx.request({
            url: util.newUrl()+'elab-marketing-authentication/contact/recommend/list',
            method: 'POST',
            data: {
                houseId:config.houseId,
                pageSize:10,
                pageNo:that.data.pageNo,
                customerId:app.globalData.single.id,
                shareType:'0'
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success:function(res){
                console.log('解密后 data: ', res);
                wx.hideLoading();
                if(res.data.success&&res.data.pageModel){
                    if(!that.data.total){
                        that.setData({
                            "total":res.data.pageModel.total,
                        })
                    }
                    var list=res.data.pageModel.resultSet
                    list.forEach(function (v,i) {
                        list[i].created=that.transformTime(v.created/1000)
                    })
                    that.setData({
                        "list":that.data.list.concat(list),
                        "pageNo":that.data.pageNo+1,//页码加1
                        "count":res.data.pageModel.rowTotal
                    })
                }
            },
            fail: function (res) {
                console.log('获取信息失败: ', res);
                if (res.errMsg == 'request:fail timeout') {
                    wx.showToast({
                        title: "网络请求超时，请检查网络状态",
                        icon: 'warn',
                        duration: 1500,
                    })
                }
                else{
                    wx.showToast({
                        title: res.errMsg,
                        icon: 'warn',
                        duration: 1500,
                    })
                }
            }
        });
    },
    onReachBottom: function() {
        // Do something when pull down.
        this.getList();
    },
    onLoad(options){
        var that=this;
        that.getList();
        // authorizeInfo.call(this,function(){
        //     that.authorizeIndexPhone(function () {
        //         that.getList();
        //     },function () {
        //         that.getList();
        //     })
        // },function(){
        //     that.authorizeIndexPhone(function () {
        //         that.getList();
        //     },function () {
        //         that.getList();
        //     })
        // });
    },//手机号授权
    authorizeIndexPhone(cb,failcb){
        var that = this;
        // wx.getStorageSync('ISauthorizePhone');// 是否授权过手机号,
        if(!wx.getStorageSync('phone')&&!app.globalData.tmpPhone){
            app.globalData.phone = wx.getStorageSync('phone');
            console.log("***authorizeIndexPhone***",app.globalData.phone,wx.getStorageSync('phone'))
            // 没有获得用户手机号
            if(!app.globalData.phone){
                that.setData({
                    showPhoneModel: true,
                    phoneFun:cb||null,
                    phoneFailFun:failcb||null
                })
            }
            else{
                that.setData({
                    showPhoneModel: false,
                    showPhoneAuth:true
                })
                typeof cb == "function" && cb()
            }
        }else{
            typeof cb == "function" && cb()
        }
    },
    // 手机号授权
    getPhoneNumber: function(e) {
        var self = this;
        // 隐藏
        this.setData({
            showPhoneModel: false
        });
        app.globalData.tmpPhone=true;
        wx.setStorageSync('ISauthorizePhone', true); // 是否授权过手机号,
        var iv = e.detail.iv;
        var errMsg = e.detail.errMsg;
        var houseid = app.globalData.houseid;
        var token = app.globalData.tonken || "";
        var encryData = e.detail.encryptedData;
        var customerId = app.globalData.single.id;
        var houseId = config.houseId;
        var session = app.globalData.sessionKey;
        var appid =app.globalData.appid; //"wxa6aef323462b8b14";
        console.log("***token***", token)
        // var pc = new WXBizDataCrypt(appid, session);
        console.log("****getPhoneNumber****")
        // 用户未授权
        if (e.detail.errMsg.includes("fail")) {
            typeof self.data.phoneFailFun == "function" && self.data.phoneFailFun();
        } else {
            if (!encryData || !session || !iv) {
                wx.showToast({
                    title: '系统提示:授权信息错误',
                    icon: 'warn',
                    duration: 1500,
                })
            }
            var parm = {
                encryptedData: encryData,
                sessionKey: session,
                appId: appid,
                iv: iv,
                houseId:houseId,
                shareParam : app.globalData.fromChannel,
                customerId:app.globalData.single.id
            };
            wx.request({
                url: util.newUrl()+'elab-marketing-authentication/position/queryPositionPhone',
                method: 'POST',
                data: parm,
                header: {
                    'content-type': 'application/json',
                    // 默认值
                    'token': token
                },
                success: function(res) {
                    console.log('解密后 data: ', res);
                    if (res.data.success && res.data.single) {
                        console.log(res.data.single);
                        app.globalData.phone = res.data.single.phone;
                        wx.setStorageSync('phone', res.data.single);
                        self.setData({
                            showPhoneModel: false,
                            showPhoneAuth: true,
                        })
                        // 存在跳转的
                        typeof self.data.phoneFun == "function" && self.data.phoneFun(); // 执行回调函数
                    }
                },
                fail: function(res) {
                    typeof self.data.phoneFailFun == "function" && self.data.phoneFailFun();
                    console.log(res, '解密手机号失败ggggggggggg')
                }
            });
        }
    },
    // 用户授权
    getUserInfo: function (e) {
        getUserInfo.call(this,e);
    }
})
