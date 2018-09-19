var util = require('../../utils/util.js')
var app = getApp()
var serverUrl = 'http://skyforest.static.elab-plus.com/wepy_pro/'
var {authorizeInfo,getUserInfo} = require('../../getlogininfo.js')
Page({
    data:{
        serverUrl:serverUrl,
        list:[],
        note:'',
        showInfoModel:false,
        showPhoneModel:false,
        phoneFailFun:null,
        phoneFun:null
    },
    onShareAppMessage(options) {
        var shareData;
        if(options.from=='button'){
            var path=options.target.dataset.path,
                url=options.target.dataset.url,
                title=options.target.dataset.title;
                shareData={
                  title: title,
                  imageUrl: url,
                  path: "/pages/webView/webView?loginid="+app.globalData.single.loginid+"&view="+encodeURIComponent(path)
                }
        }else{
            shareData={
               title: '宁波WIII',
               imageUrl: "",
               path: '/pages/share/share?loginid='+app.globalData.single.loginid
            }
        }
        return shareData;
    },
    onShow: function(e){
        wx.setNavigationBarTitle({
            title: '我要分享'
        })
        var obj={
            "pageid":'10941010',
            "keyvalue":'sfc.nb.xcx.w3.head.fenxiang.enter',
        }
        util.reqTrackEventObj(obj,app);
        var obj={
            "pageid":'10941010',
            "keyvalue":'sfc.nb.xcx.w3.head.fenxiang.statetime',
            "usetime":"3000", // 使用时长
        }
        util.reqTrackEventTimeObj(obj,app);
        wx.hideShareMenu() //隐藏转发按钮
    },
    onUnload(){
        util.stopTrackEventTimeObj();
    },
    onHide(){
        util.stopTrackEventTimeObj();
    },
    getList:function(){
        var that=this;
        var parm={houseid:app.globalData.houseid,mobile:app.globalData.phone,enumType:"0574"}
        wx.request({
            url: util.url(),
            method: 'POST',
            data: util.reformParam(util.getRecommendInfoList, parm),
            header: {
                'content-type': 'application/json' // 默认值
            },
            success:function(res){
                console.log('解密后 分享数据data: ', res);
                if(res.data.success&&res.data.list.length>0){
                    var list=res.data.list;
                    list.forEach(function (v,i) {
                        list[i].tag=v.tag.split(",");
                    })
                    console.log(list);
                    that.setData({
                        "list":list,
                        "note":res.data.single.note
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
    goDetail:function(e){
        var url=e.target.dataset.path;
        wx.navigateTo({
            url:"/pages/webView/webView?loginid="+"&view="+encodeURIComponent(url)
        })
    },
    onLoad(options){
        wx.hideShareMenu();
        var that=this;
        authorizeInfo.call(this,function(){
            that.authorizeIndexPhone(function () {
                that.getList();
            },function () {
                wx.redirectTo({
                    url:'../index/index?loginid='+options.shareToken
                })
            })
        },function(){
            wx.redirectTo({
                url:'../index/index?loginid='+options.shareToken
            })
        });
    },//手机号授权
    authorizeIndexPhone(cb,failcb){
        var that = this;
        // wx.getStorageSync('ISauthorizePhone');// 是否授权过手机号,
        if(!wx.getStorageSync('phone')){
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
        wx.setStorageSync('ISauthorizePhone', true); // 是否授权过手机号,
        var iv = e.detail.iv;
        var errMsg = e.detail.errMsg;
        var houseid = app.globalData.houseid;
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
                iv: iv
            };
            wx.request({
                url: util.newUrl()+'elab-marketing-content/module/queryPositionPhone',
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
                        app.globalData.phone = res.data.single;
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
