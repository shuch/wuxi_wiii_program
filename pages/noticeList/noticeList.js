var util = require('../../utils/util.js')
var app = getApp()
var config = require('../../config.js')
var serverUrl = 'http://skyforest.static.elab-plus.com/wepy_pro/v1-2/'
var {authorizeInfo,getUserInfo} = require('../../getlogininfo.js')
var pvCurPageParams = '';
Page({
    data:{
        serverUrl:serverUrl,
        count:'',
        list:[],
        pageNo:1,//初始页码
        total:'',//总页数后台获取
        showInfoModel:false,
        showPhoneModel:false,
        phoneFailFun:null,
        phoneFun:null,
        hasNotice:false
    },
    onShow: function(e){
        wx.setStorageSync('loadTime',new Date().getTime())
        wx.setNavigationBarTitle({
            title: '消息通知'
        })
        let param = {
            type:'PV',
            pvId:'P_2cMINA_12',
            pvCurPageName:'xiaoxitongzhi',//当前页面名称
            pvCurPageParams:pvCurPageParams,//当前页面参数
            pvLastPageName:getCurrentPages()[getCurrentPages().length-2]?getCurrentPages()[getCurrentPages().length-2].data.despage:'',//上一页页面名称
            pvLastPageParams:'',//上一页页面参数
            pvPageLoadTime:(new Date().getTime() - wx.getStorageSync('loadTime')),//加载时间
        }
        console.log(param,'埋点')
        util.trackRequest(param,app)
    },
    onUnload(){
    },
    onHide(){
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
        // var parm={pageNo:that.data.pageNo,customerId:"20045"};//联调数据
        wx.request({
            url: util.newUrl()+'elab-marketing-notify/customer/pageList',
            method: 'POST',
            header: {
                'token':app.globalData.tonken,
                "houseId": config.houseId,
                'content-type': 'application/json' // 默认值
            },
            data:{
                pageNo:that.data.pageNo,
                customerId : app.globalData.single.id
            },
            success:function(res){
                console.log('解密后 消息通知data: ', res);
                wx.hideLoading();
                if(res.data.success&&res.data.pageModel.resultSet.length>0){
                    if(!that.data.total){
                        that.setData({
                            "total":res.data.pageModel.total,
                        })
                    }
                    var res=res.data.pageModel.resultSet
                    res.forEach(function (v,i) {
                        res[i].sendTime=that.transformTime(v.sendTime/1000);
                        if(res[i].mobile){
                            console.log( res[i].content.split(res[i].mobile))
                            res[i].array1 = res[i].content.split(res[i].mobile)[0];
                            res[i].array2 = res[i].content.split(res[i].mobile)[1];
                        }else{
                            res[i].array1 =res[i].content
                        }

                    })
                    that.setData({
                        "list":that.data.list.concat(res),
                        "pageNo":that.data.pageNo+1,//页码加1
                        "hasNotice":true
                    })
                }else if(!res.data.success){
                    wx.showToast({
                        title: res.data.message,
                        icon: 'warn',
                        duration: 1500,
                    })

                }
            },
            fail: function (res) {
                console.log('获取信息失败: ', res);
                wx.hideLoading();
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
    callTel:function(e){
        var para={
            clkId:'clk_2cmina_33',
            clkDesPage:'',//点击前往的页面名称
            clkName:'dianjidianhuahaoma',//点击前往的页面名称
            type:'CLK',//埋点类型e
            pvCurPageName:'xiaoxitongzhi',//当前页面
            pvCurPageParams:pvCurPageParams,//当前页面参数
        }
        util.trackRequest(para,app)
        wx.makePhoneCall({
            phoneNumber:e.currentTarget.dataset.tel
        })
    },
    onLoad:function(options){
        pvCurPageParams = JSON.stringify(options)
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
    getPhoneNumber: function (e) {
        var self = this;
        // 隐藏
        this.setData({
            showPhoneModel: false
        });
        app.globalData.tmpPhone=true
        wx.setStorageSync('ISauthorizePhone', true); // 是否授权过手机号,
        var iv = e.detail.iv;
        var token = app.globalData.tonken || "";
        var encryData = e.detail.encryptedData;
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
                houseId:config.houseId,
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
    },
    onReachBottom: function() {
        // Do something when pull down.
        this.getList();
    },
    goToDetail:function (e) {
        console.log('asd')
        var url=e.target.dataset.url;
        var type=e.target.dataset.type;//1.系统推送消息/2.报备消息
        // if(!readStatus){//未读状态发请求
        //     var parm={messageId:messageId};//messageId
        //     wx.request({
        //         url: util.url(),
        //         method: 'POST',
        //         data: util.reformParam(util.markRead, parm),
        //         header: {
        //             'content-type': 'application/json' // 默认值
        //         },
        //         success:function(res){
        //             console.log('解密后 data: ', res);
        //         }
        //     });
        // }

        if(url&&url.includes("m.elab-plus.com")&&type==1){//系统推送消息并且不是域名外链接跳转
            var view=encodeURIComponent(url);
            wx.navigateTo({
                url: '../webView/webView?view='+encodeURIComponent(view)
            })
        }else if(url&&type==1){//如推送消息包含只能在APP端打开，则小程序中点击无法打开并提示“请在APP中打开查看。”
            wx.showToast({
                title: '请在APP中打开查看!',
                icon: 'warn',
                duration: 1500,
            })
        }
    }
})
