var app = getApp();
var util = require('../../utils/util.js')
var config = require('../../config.js');
var serverUrl=util.getImgUrl()+"/wepy_pro";
var pvCurPageParams = '';
// var serverUrl = 'http://skyforest.static.elab-plus.com/wepy_pro/'
var {authorizeInfo,getUserInfo} = require('../../getlogininfo.js')
Page({
    data: {
        closeImg: serverUrl+'/close-button.png',
        chatButton: serverUrl+'/im-chat.png',
        showInfoModel:false,
        infoFun:null,
        infoFailFun:null,
        showPhoneModel:false,
        showImgModel:false,
        phoneFun:null,
        imTitle:'项目金牌顾问',
        imDesc:'请选择一名顾问为您在线咨询',
        isShowVideoButton:false,
        despage:'xuanzeguwenliebiao',
        phoneFailFun:null,
        loading:false,
        title:'在线咨询',
        sorry:serverUrl+'/sorry.png',//繁忙
        defaultImg: serverUrl+'/Avatar_male.png',
        yuyue: serverUrl+'/yuyue.png',
        fixImg: serverUrl+'/fix-b.png',//底部固定图片
        showTel:false,//顾问繁忙控制
        adviserList: [],
        tryAgainFlag:false,
        setInter:null,
    },
    onShow: function (e) {
        wx.setStorageSync('loadTime',new Date().getTime())
        var that = this;
        try{
            app.login(function(obj){
                var token = app.globalData.tonken;
                var time = util.formatTime(new Date());
                console.log("***counselorList***",app.globalData.single.id,config.houseId)
                wx.request({
                    url:util.newUrl()+'elab-marketing-authentication/adviser/video/callLog',
                    method:'POST',
                    data:{
                        customerId:app.globalData.single.id,
                        houseId:config.houseId
                    },
                    success:function(res){
                        if(res.data.single){
                            that.setData({
                                isShowVideoButton:true
                            })
                        }
                    }
                })
                wx.request({
                    header: {
                        token: token,
                    },
                    url: util.newUrl()+'elab-marketing-authentication/worker/adviser/statusList',
                    method: 'POST',
                    data: { houseId: config.houseId, time: time, pageNo: '1', pageSize: '100' },
                    success: function (res) {
                        console.log(res, '列表返回');
                        if (!res.data.single.imAdvisers || res.data.single.imAdvisers==undefined || res.data.single.imAdvisers.length < 1) {
                            that.setData({
                                showTel:true
                            })
                            let param = {
                                type:'PV',
                                pvId:'P_2cMINA_4',
                                pvCurPageName:'wuzaixianguwen',//当前页面名称
                                pvCurPageParams:pvCurPageParams,//当前页面参数
                                pvLastPageName:getCurrentPages()[getCurrentPages().length-2]?getCurrentPages()[getCurrentPages().length-2].data.despage:'',//上一页页面名称
                                pvLastPageParams:'',//上一页页面参数
                                pvPageLoadTime:(new Date().getTime() - wx.getStorageSync('loadTime')),//加载时间
                            }
                            console.log(param,'埋点1');
                            util.trackRequest(param,app);
                            return
                        }
                        let onlineList = [];
                        res.data.single.imAdvisers.forEach((item)=>{
                            if(!item.onlineStatus){
                                onlineList.push(item)
                            }
                        })
                        that.setData({
                            adviserList:onlineList || []
                        })
                        if (!that.data.adviserList||that.data.adviserList.length < 1) {
                            console.log(that.data.adviserList.length,'你居然走这里？')
                            that.setData({
                                showTel:true
                            })
                            let param = {
                                type:'PV',
                                pvId:'P_2cMINA_4',
                                pvCurPageName:'wuzaixianguwen',//当前页面名称
                                pvCurPageParams:pvCurPageParams,//当前页面参数
                                pvLastPageName:getCurrentPages()[getCurrentPages().length-2]?getCurrentPages()[getCurrentPages().length-2].data.despage:'',//上一页页面名称
                                pvLastPageParams:'',//上一页页面参数
                                pvPageLoadTime:(new Date().getTime() - wx.getStorageSync('loadTime')),//加载时间
                            }
                            console.log(param,'埋点1');
                            util.trackRequest(param,app);
                        }else{
                            console.log(that.data.adviserList.length,'你应该走这里啊')
                            that.setData({
                                showTel:false
                            })
                            let param = {
                                type:'PV',
                                pvId:'P_2cMINA_2',
                                pvCurPageName:'xuanzeguwenliebiao',//当前页面名称
                                pvCurPageParams:pvCurPageParams,//当前页面参数
                                pvLastPageName:getCurrentPages()[getCurrentPages().length-2]?getCurrentPages()[getCurrentPages().length-2].data.despage:'',//上一页页面名称
                                pvLastPageParams:'',//上一页页面参数
                                pvPageLoadTime:(new Date().getTime() - wx.getStorageSync('loadTime')),//加载时间
                            }
                            console.log(param,'埋点2')
                            util.trackRequest(param,app)
                        }
                        //that.data.adviserList = res.data.pageModel.resultSet||[];
                        console.log(that.data.adviserList,'拿到列表', that.data.showTel)
                        that.setData({
                            loading:false
                        })
                    },
                    complete:function(res){
                        wx.hideLoading();
                    }
                })
            });
        }
        catch(e){
            wx.hideLoading();
        }
        this.setData({
            loading:true
        })
        console.log('app.single',app.globalData.single,app.globalData)
        wx.hideShareMenu();
        wx.setNavigationBarTitle({
            title: '在线咨询'
        })
        console.log(app.globalData.isUserInfo,'isfalse')
        if(!app.globalData.isUserInfo){
            authorizeInfo.call(this,function(){
                console.log(app.globalData.phone,wx.getStorageSync('phone'),app.globalData.tmpPhone,'===========')
                if(!app.globalData.phone&&!wx.getStorageSync('phone')&&!app.globalData.tmpPhone){
                    console.log('从未授权过',wx.getStorageSync('phone'))
                    that.authorizeIndexPhone(function () {
                    },function () {
                    })
                }
            },function(){
                debugger
                console.log(app.globalData.phone,wx.getStorageSync('phone'),app.globalData.tmpPhone,'===========')
                if(!app.globalData.phone&&!wx.getStorageSync('phone')&&!app.globalData.tmpPhone){
                    console.log('从未授权过',wx.getStorageSync('phone'))
                    that.authorizeIndexPhone(function () {
                    },function () {
                    })
                }
            });
        }else{
            if(!app.globalData.phone&&!wx.getStorageSync('phone')&&!app.globalData.tmpPhone){
                console.log('从未授权过',wx.getStorageSync('phone'))
                that.authorizeIndexPhone(function () {
                },function () {
                })
            }
        }
        console.log(wx.getStorageSync('phone'),'有值就不会弹起')
    },
    goMessageList: function (e) {
        wx.redirectTo({
            url: '../messagesList/messagesList'
        })
    },
    // 手机号授权
    getPhoneNumber: function (e) {
        var self = this;
        // 隐藏
        this.setData({
            showPhoneModel: false
        })
        wx.setStorageSync('ISauthorizePhone',true);// 是否授权过手机号,
        var iv = e.detail.iv;
        var errMsg = e.detail.errMsg;
        var houseid=app.globalData.houseid;
        var token=app.globalData.tonken||"";
        var encryData = e.detail.encryptedData;
        var session = app.globalData.sessionKey;
        var appid = app.globalData.appid;//"wxa6aef323462b8b14";
        console.log("***token***",token)
        app.globalData.tmpPhone=true;
        // var pc = new WXBizDataCrypt(appid, session);
        console.log("****getPhoneNumber****")
        // 用户未授权
        if (e.detail.errMsg.includes("fail")){
            typeof self.data.phoneFailFun == "function" && self.data.phoneFailFun();
        }
        else{
            if (!encryData || !session || !iv) {
                wx.showToast({
                    title: '系统提示:授权信息错误',
                    icon: 'warn',
                    duration: 1500,
                })
            }
            if(!app.globalData.single){ //如果没有登录成功
                self.data.setInter = setInterval(function(){
                    if(app.globalData.single){
                        self.getPhone(encryData,session,appid,iv,token)
                        clearInterval(self.data.setInter);
                    }
                },200)
            }
            else{   //登录成功后
                self.getPhone(encryData,session,appid,iv,token)
            }
        }
    },
    getPhone(encryData,session,appid,iv,token){
        var self = this;
        var parm = {
            encryptedData: encryData,
            sessionKey: session,
            appId: appid,
            customerId: app.globalData.single.id,
            houseId:config.houseId,
            shareParam : app.globalData.fromChannel,
            iv: iv
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
                    wx.setStorageSync('phone', res.data.single.phone);
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
    },
    authorizeIndexPhone(cb,failcb){
        var that = this;
        // wx.getStorageSync('ISauthorizePhone');// 是否授权过手机号,
        if(!wx.getStorageSync('phone')){
            // app.globalData.phone = wx.getStorageSync('phone');
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
    getUserInfo: function (e) {
        getUserInfo.call(this,e);
    },
    onUnload:function(){
        util.stopTrackEventTimeObj()
    },
    goChat: function (e) {
        //console.log(e,'===传参===')
        var item = e.currentTarget.dataset.item;
        wx.setStorageSync('adviserInfo', JSON.stringify(item));
        let param = {
            type:'CLK',//埋点类型
            pvPageStayTime:(new Date().getTime()-wx.getStorageSync('loadTime'))/1000,
            adviserId:item.id,
            imTalkId:item.id+'_'+app.globalData.single.id+'_'+config.houseId,
            imTalkType:'1',
            clkDesPage:'liaotianchuangkou',//点击前往的页面名称
            clkName:'xuanzeguwenliaotian',//点击前往的页面名称
            clkId:'clk_2cmina_24',//点击ID
            clkParams:'',//点击参数
        }
        util.trackRequest(param,app)
        wx.redirectTo({
            url: '../chat/chat'
        })

        console.log(item, '------------', JSON.stringify(item))
    },
    proto_getLoginInfo: function() {
        wx.request({
            url: util.newUrl()+'elab-marketing-authentication/tencent/signature',
            method: 'POST',
            data:  {
                identifier: app.globalData.identifier,
                appId: config.sdkAppID
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(ret) {
                if (ret.data.code) {
                    console.log('获取登录信息失败，调试期间请点击右上角三个点按钮，选择打开调试');
                    wx.showToast({
                        title: ret.data.message + '[' + ret.data.code + ']',
                        icon: 'warn',
                        duration: 1500,
                    });
                    return;
                }
                console.log('获取usersig登录信息成功', ret);
                app.globalData.userSig = ret.data.single.signature;
            },
            fail: function(ret) {
                console.log('获取IM信息失败: ', ret);
                if (ret.errMsg == 'request:fail timeout') {
                    wx.showToast({
                        title: "网络请求超时，请检查网络状态",
                        icon: 'warn',
                        duration: 1500,
                    })
                } else {
                    wx.showToast({
                        title: ret.errMsg,
                        icon: 'warn',
                        duration: 1500,
                    })
                }
            }
        });
    },
    goVideo: function (e) {
        var that=this;
        if(that.data.tryAgainFlag){
            return
        }
        let param = {
            type:'CLK',//埋点类型
            pvPageStayTime:(new Date().getTime()-wx.getStorageSync('loadTime'))/1000,
            clkDesPage:'ekanfangjietongye',//点击前往的页面名称
            clkName:'shipin_xuanguwenliebiao',//点击前往的页面名称
            clkId:'clk_2cmina_42',//点击ID
            clkParams:'',//点击参数
        }
        util.trackRequest(param,app)
        that.data.tryAgainFlag=true;
        wx.getSetting({
            success: (response) => {
                console.log("***rtcroomCom.onLoad***getSetting",response)
                // 没有授权
                if (!response.authSetting['scope.record']){
                    wx.authorize({
                        scope: 'scope.record',
                        success() {
                            if(!response.authSetting['scope.camera']){
                                wx.authorize({
                                    scope: 'scope.camera',
                                    success() {
                                        that.data.tryAgainFlag=false;
                                        wx.navigateTo({
                                            url:'../multiroom/aide/aide'
                                        })
                                    },
                                    fail(res){
                                        that.data.tryAgainFlag=false;
                                        wx.hideLoading()
                                        that.setData({
                                            showImgModel:true
                                        })
                                    }
                                })
                            }else{
                                that.data.tryAgainFlag=false;
                                wx.navigateTo({
                                    url:'../multiroom/aide/aide'
                                })
                            }
                        },
                        fail(){
                            that.data.tryAgainFlag=false;
                            wx.hideLoading()
                            that.setData({
                                showImgModel:true
                            })
                        }
                    })
                }
                else{
                    if(!response.authSetting['scope.camera']){
                        wx.authorize({
                            scope: 'scope.camera',
                            success() {
                                that.data.tryAgainFlag=false;
                                wx.navigateTo({
                                    url:'../multiroom/aide/aide'
                                })
                            },
                            fail(){
                                that.data.tryAgainFlag=false;
                                wx.hideLoading()
                                that.setData({
                                    showImgModel:true
                                })
                            }

                        })
                    }else{
                        that.data.tryAgainFlag=false;
                        wx.navigateTo({
                            url:'../multiroom/aide/aide'
                        })
                    }

                }
            },
            fail: function () {
                that.data.tryAgainFlag=false;
                // typeof cb == "function" && cb()
                wx.showToast({
                    title: '系统提示:网络错误',
                    icon: 'warn',
                    duration: 1500,
                })
            }
        })
    },
    onReady(){
        // wx.hideLoading();
    },
    onLoad: function (options) {
        wx.showLoading({
            title: '正在加载',
        })
        var that = this;
        pvCurPageParams=JSON.stringify(options)
        //设置小程序顾问标语
        wx.request({
            url:util.newUrl()+'elab-marketing-authentication/house/house/selectHouseLeadWork',
            method:'POST',
            data:{id:config.houseId},
            success:function(res){
                if(res.data.single.leadTitle){
                    that.setData({
                        imTitle:res.data.single.leadTitle,
                    })
                }
                if(res.data.single.leadRemark){
                    that.setData({
                        imDesc:res.data.single.leadRemark
                    })
                }
                app.globalData.imHelloWord = res.data.single.greetings;
                app.globalData.imRepeat = res.data.single.autoReply;


            }
        })

    },
    goTel:function(){
        var phone = wx.getStorageSync('phone');
        var Liudian = wx.getStorageSync('indexLiudian');
        let param = {
            type:'CLK',//埋点类型
            pvPageStayTime:(new Date().getTime()-wx.getStorageSync('loadTime'))/1000,
            clkDesPage:'querenliudianye',//点击前往的页面名称
            clkName:'wuren_liudianyuyue',//点击前往的页面名称
            clkId:'clk_2cmina_41',//点击ID
            clkParams:{tel:phone},//点击参数
        }
        util.trackRequest(param,app)
        if(!phone && !Liudian){
            wx.navigateTo({
                url: '../savephone/savephone'
            })
        }else{
            // var pageid='01011093';
            // var key='sfc.nb.xcx.w3.head.shifouliudian';
            // var obj={
            //     "pageid":pageid,
            //     "keyvalue":key + ".click",
            // }
            // util.reqTrackEventObj(obj,app);
            wx.showToast({
                title: '留电成功，我们会尽快联系您',
                icon:"none",
                duration: 2000
            })
        }
        console.log(12,phone)
    },
    getShareProgram:function(){
        this.setData({
            showImgModel:false
        })
    },
})