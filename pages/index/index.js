//index.js
var util = require('../../utils/util.js');
var config = require('../../config.js');
var app = getApp(); //获取应用实例
var serverUrl = util.getImgUrl();
var pvCurPageParams=null;
// var serverUrl = 'http://skyforest.static.elab-plus.com/wepy_pro/'
var startTime=(new Date()).getTime()
Page({
    data: {
        InitFlag: "0",
        homeLocation: {},
        // 地段分析
        home3D: {},
        initData:{},//所有数据
        newsModule:[],//咨询模块
        operationModule:[],//运营位模块
        featureModule:{},//项目特点模块
        parameterModule:{},//楼盘参数模块
        momentModule:{},//此时此刻模块
        viewModule:{},//720模块
        valueModule:{},//投资价值模块
        areaModule:{},//地段分析模块
        layoutModule:{},//户型模块
        effectModule:{},//效果图模块
        sampleModule:{},//样板间模块
        realityModule:{},//实景图模块
        watchModule:{},//3d看房模块
        matchModule:{},//周围配套模块
        scrollFlag:true,
        despageForChat:'xuanzeguwenliebiao',//这里的despage因为chat页面的pv记录不到上一页的页面名称，所以放在首页
        despage:'zhuye',
        title:config.projectName,
        quanjinUrl:serverUrl + 'wepy_pro/v1-2/720bg.png',
        mask1:'rgba(39,42,52,0.00)',
        mask2:'#272A34',
        defaultBanner:[{coverUrl:serverUrl + 'wepy_pro/v1-2/head.jpg',jumpUrl:''}],
        //banner
        bannerUrl:serverUrl + 'wepy_pro/v1-2/banner-1.png',
        rightButtonUrl:serverUrl + 'wepy_pro/v1-2/right-button.png',
        notificationUrl:serverUrl + 'wepy_pro/v1-2/notification.png',
        projectFeatureUrl:serverUrl + 'wepy_pro/v1-2/projectFeature.png',
        statisticsUrl:serverUrl+'wepy_pro/v1-2/statistics.png',
        investmentUrl:serverUrl+'wepy_pro/v1-2/investment.png',
        locationUrl:serverUrl+'wepy_pro/v1-2/location.png',
        neighborUrl:serverUrl+'wepy_pro/v1-2/neighbor.png',
        liveUrl:serverUrl+'wepy_pro/v1-2/live.png',
        quanjinIconUrl:serverUrl+'wepy_pro/v1-2/720icon.png',
        renderUrl:serverUrl+'wepy_pro/v1-2/renderings.png',
        typesUrl:serverUrl+'wepy_pro/v1-2/types.png',
        threeDUrl:serverUrl+'wepy_pro/v1-2/houseType/3D.png',
        showroomsUrl:serverUrl+'wepy_pro/v1-2/showrooms.png',
        photographyUrl:serverUrl+'wepy_pro/v1-2/photography.png',

        // 动态资讯
        scrollMsg:{
            msgList:[
                {text:'南滨小镇南滨小镇南滨小镇南滨小镇',linkUrl:'https://www.baidu.com'},
                {text:'哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈',linkUrl:'https://www.baidu.com'},
                {text:'阿萨德阿萨德阿萨德阿萨德阿萨德',linkUrl:'https://www.baidu.com'},
            ]
        },
        // 3D看房
        homeMoment: {},
        // 此时此刻
        homeBanner: [{coverUrl:serverUrl + 'wepy_pro/v1-2/head.jpg',jumpUrl:''}],
        Height: "1070",
        showAdmit:false,
        toView:'',
        gradient1:'#3A4A80',
        gradient2:'#6294A6',
        showPhoneModel: false,
        swiperCurrent:0,
        showInfoModel: false,
        isSend: false,
        showPhoneAuth: false,
        showAgree: false,
        indexLiudian: false,
        showAuth: true,
        maidinData:[{id:'#jingcaishijiao',eventId:'exp_2cmina_0',flag:true},
            {id:'#liaojiexiangmu',eventId:'exp_2cmina_1',flag:true},
            {id:'#jingcaitupian',eventId:'exp_2cmina_2',flag:true},
            {id:'#fenxianggeipengyou',eventId:'exp_2cmina_3',flag:true},],
        // phoneGoUrl:"",
        phoneFun: null,
        phoneFailFun: null,
        infoFun: null,
        infoFailFun: null,
        appid: "",
        flag: false,
        name: "",
        // imgUrl:config.imageUrl,
        motto: 'Hello World',
        currentTab: "0",
        userInfo: {},
        verifyText: '完成',
        verifyCode: '',
        tel: '',
    },
//滚动资讯
    scrollMsg:function(){

    },
    onUnload:function(){
        console.log('关闭小程序-onUnload')
    },
    onHide:function(){
      console.log('隐藏首页小程序-onHide')
    },
    onShareAppMessage(options) {
        let param = {
            clkId:'clk_2cMINA_1',
            type:'CLK',//埋点类型
            clkName:'fenxiang',
            pvCurPageName:this.data.despage||'',//当前页面
            pvCurPageParams:pvCurPageParams,//当前页面参数
        }
        util.trackRequest(param,app)
        return {
            title: config.projectName,
            path: '/pages/index/index?shareToken='+app.globalData.shareToken
        }
    },
    // 我要分享
    goToShare: function() {
        debugger
        var para={
            clkId:'clk_2cmina_18',
            clkDesPage:'woyaofenxiang',//点击前往的页面名称
            clkName:'woyaofenxiang',//点击前往的页面名称
            type:'CLK',//埋点类型
            pvCurPageName:'zhuye',//当前页面
            pvCurPageParams:pvCurPageParams,//当前页面参数
        }
        util.trackRequest(para,app);
    },
    /*** 滑动切换tab***/
    bindChange: function(e) {
        var that = this;
        // console.log(e)
        if (e.detail.source == "autoplay") {
            return false;
        }
        var myheight = "";
        if (e.detail.current == "1") {
            myheight = "600"
        } else {
            myheight = this.data.homePapa.isShow == '0' ? "700": "1070";
            console.log("this.data.homePapa.isShow,", this.data.homePapa.isShow, myheight)
        }
        that.setData({
            Height: myheight,
            currentTab: e.detail.current
        });
    },
    swiperChange:function(e){
        this.setData({
            swiperCurrent: e.detail.current
        })
    },
    /*** 点击tab切换***/
    swichNav: function(e) {
        console.log('滑动切换', e);
        var that = this;
        var myheight = "";
        if (e.target.dataset.current == "1") {
            myheight = "600"
        } else {
            myheight = this.data.homePapa.isShow == '0' ? "700": "1070";
            console.log("this.data.homePapa.isShow,", this.data.homePapa.isShow, myheight)
        }
        that.setData({
            Height: myheight,
            currentTab: e.target.dataset.current
        });
    },
    goImgSwip:function(e){
        var type = e.currentTarget.dataset.type;
        wx.request({
            url:util.newUrl()+'elab-marketing-content/atlas/listGroup',
            method:'post',
            data:{
                "appVersion":"",
                "authToken":"",
                "environment":"",
                "type":type,
                "houseId":config.houseId,
                "openId":app.globalData.openid,
                "uid":""
            },
            success:function(res){
                if(res.data.list&&res.data.list[0]){
                    let param={
                        clkId:e.currentTarget.dataset.clkid||'',
                        clkDesPage:'tupianku'||'',//点击前往的页面名称
                        clkName:e.currentTarget.dataset.despage||'',//点击前往的页面名称
                        type:'CLK',//埋点类型
                        pvCurPageName:'zhuye',//当前页面
                        pvCurPageParams:pvCurPageParams,//当前页面参数
                    }
                    util.trackRequest(param,app)
                    wx.navigateTo({
                        url:'../scaleImg/scaleImage?type='+type
                    })
                }else{
                    return
                }
            }
        })

    },
    // 展示web-view
    goWebView: function(e) {
        // console.log(e);
        var self = this;
        var url = e.currentTarget.dataset.url;
        if (url.includes("/layout")) {
            wx.showToast({
                title: '敬请期待...',
                icon: 'warn',
                duration: 1500,
            });
            return false;
        }
        var linkUrl = e.currentTarget.dataset.srcurl;
        var imgUrl = e.currentTarget.dataset.img; //分享图片
        var parm = "";
        var view = encodeURIComponent(url);
        if (url == null || url.indexOf('http') != 0) {
            return false;
        }
        console.log("***linkUrl***", linkUrl);
        if (linkUrl) {
            var data = {
                houseId: app.globalData.houseid,
                picUrl: linkUrl,
                numberType: '2',
                // 数字类型(1点赞数|2观看数|3点击数)
                status: "1",
                // 1观看，-1 不观看
                uniqueId: app.globalData.openid,
            }
            wx.request({
                url: util.url(),
                method: 'POST',
                data: util.reformParam(util.likeUrl, data),
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function(res) {
                    if (res.data.success && res.data.single) {
                        console.log("***like***", res.data.single);
                        var home3D = self.data.home3D;
                        home3D.viewCount = Number(home3D.viewCount) + 1;
                        self.setData({
                            home3D: home3D,
                        });
                    } else {
                        console.log("***Scale-setLike***", res);
                    }
                }
            })
        }

        var pageid = e.currentTarget.dataset.pageid;
        var key = e.currentTarget.dataset.key;

        // console.log("goWebView",url,view,app.globalData.single.loginid)
        // this.authorizeInfo(function(){
        wx.navigateTo({
            url: '../webView/webView?view=' + view + "&linkUrl=" + linkUrl + "&imgUrl=" + imgUrl
        })
        // });
    },
    // 播放视频
    goVideo: function(e) {
        // console.log(e);
        var self = this;
        // var url=e.currentTarget.dataset.source;
        var linkUrl = e.currentTarget.dataset.srcurl;
        var parm = "";

        console.log("/////////////linkUrl/////////////", e)
        // this.authorizeInfo(function(){
        // self.reqVideoInfo(linkUrl);
        // });
        var data = {
            houseId: app.globalData.houseid,
            picUrl: linkUrl,
            numberType: '2',
            // 数字类型(1点赞数|2观看数|3点击数)
            status: "1",
            // 1观看，-1 不观看
            uniqueId: app.globalData.openid,
        }
        wx.request({
            url: util.url(),
            method: 'POST',
            data: util.reformParam(util.likeUrl, data),
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
                if (res.data.success && res.data.single) {
                    console.log("***like-homeMoment.viewCount***", res.data.single);
                    self.reqVideoInfo(linkUrl, res.data.single.id);
                    var homeMoment = self.data.homeMoment;
                    homeMoment.viewCount = Number(homeMoment.viewCount) + 1;
                    self.setData({
                        homeMoment: homeMoment,
                    });
                } else {
                    console.log("***Scale-setLike***", res);
                }
            }
        })
    },
    reqVideoInfo: function(linkUrl, id) {
        var self = this;
        var data = {
            houseid: app.globalData.houseid,
        }
        wx.request({
            url: util.url(),
            method: 'POST',
            data: util.reformParam(util.videoInfo, data),
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
                if (res.data.success && res.data.list) {
                    console.log("***like***", res.data.list)
                    // 用户已经授权
                    wx.navigateTo({
                        url: '../video/video?source=' + encodeURI(decodeURI(res.data.list[0].video_url)) + "&linkUrl=" + linkUrl + "&id=" + id
                    })
                } else {
                    console.log("***reqVideoInfo***", res);
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000
                    })
                }
            }
        })
    },
    userCheck: function(e) {
        console.log(e.target.dataset.name);
        wx.navigateTo({
            url: '../detail/detail?id=' + e.target.dataset.name
        })

    },
    log: function(e) {
        var id = this.data.userInfo.nickName;
        wx.navigateTo({
            // url: '../logs/logs'
            url: '../multiroom/roomlist/roomlist'
        })
    },
    // 同意授权
    agree: function(e) {
        var para={
            clkId:'clk_2cmina_20',
            clkDesPage:'',//点击前往的页面名称
            clkName:'tongyi',//点击前往的页面名称
            type:'CLK',//埋点类型
            pvCurPageName:'zhuye',//当前页面
            pvCurPageParams:pvCurPageParams,//当前页面参数
        }
        util.trackRequest(para,app)
        // showAgree:false, 显示同意的文字
        // showAuth:true,
        this.setData({
            showAgree: true
        })
    },
    // 不同意授权
    noagree: function(e) {
        this.setData({
            showAgree: false
        })
    },
    //户型
    goHouseType: function() {
        var para={
            clkId:'clk_2cmina_12',
            clkDesPage:'huxingye',//点击前往的页面名称
            clkName:'huxing',//
            type:'CLK',//埋点类型
            pvCurPageName:'zhuye',//当前页面
            pvCurPageParams:pvCurPageParams,//当前页面参数
        }
        util.trackRequest(para,app)
        const url = `/pages/customHouse/customHouse`
        wx.navigateTo({ url });
    },
    //消息通知
    goToNoticeList: function() {
        var para={
            clkId:'clk_2cMINA_0',
            clkDesPage:'xiaoxitongzhi',//点击前往的页面名称
            clkName:'xiaoxitongzhi',//点击前往的页面名称
            type:'CLK',//埋点类型
            pvCurPageName:'zhuye',//当前页面
            pvCurPageParams:pvCurPageParams,//当前页面参数
        }
        util.trackRequest(para,app)
        wx.navigateTo({
            url: '../noticeList/noticeList'
        })
    },
    //我分享的好友
    goToShareFriend: function() {
        var para={
            clkId:'clk_2cmina_19',
            clkDesPage:'wofenxiangdehaoyou',//点击前往的页面名称
            clkName:'wofenxiangdehaoyou',//点击前往的页面名称
            type:'CLK',//埋点类型
            pvCurPageName:'zhuye',//当前页面
            pvCurPageParams:pvCurPageParams,//当前页面参数
        }
        util.trackRequest(para,app)
        console.log("***goToShareFriend-authorizePhone***", app.globalData.phone)
        // this.authorizePhone(function(){
        //   wx.navigateTo({
        //     url: '../shareFriend/shareFriend'
        //   })
        // });
        wx.navigateTo({
            url: '../shareFriend/shareFriend'
        })
    },
    video: function(e) {
        var id = this.data.userInfo.nickName;
        wx.navigateTo({
            // url: '../logs/logs'
            url: '../multiroom/chatlist/chatList'
        })
    },
    goChatList: function(e) {

        app.globalData.userInfo = e.detail.userInfo;
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
        // wx.navigateTo({
        //     url:'../multiroom/room/room?type=create&roomName=sdg&userName=asdg&roomID=asdg&isSuc=1'
        // })
    },
    goxzs: function(e) {
        console.log(e.detail.rawData);
        app.globalData.userInfo = e.detail.userInfo;
        wx.setStorageSync('userInfo', e.detail.userInfo);
        // var id = this.data.userInfo.nickName
        wx.navigateTo({
            // url: '../logs/logs'
            url: '../multiroom/aide/aide'
        })
    },
    onLoad: function(options) {
        pvCurPageParams=JSON.stringify(options)
        var that = this
        // console.log(options,'yyyy')
        console.log("***onLoad***", options, options.shareToken);
        //将渠道存至全局，留电接口需要用
        if(options&&options.shareToken&&options.shareToken!="null"&&options.shareToken!="undefined"){
            app.globalData.fromChannel = options.shareToken
        }
        // 获得用户授权
        // that.authorizePhone();
        // that.authorizeIndexInfo(function(){
        //   that.authorizeIndexPhone();
        // },function(){
        //   that.authorizeIndexPhone();
        // });
        that.authorizeIndexPhone();
    },
    onReady: function() {
        // console.log("-----++++-dfghkdsfhjsdklfjhk",this.data.homePapa)
        // if(this.data.homePapa.isShow == "0"){
        //   this.data.papaHeight="600";
        //   console.log("------dfghkdsfhjsdklfjhk",this.data.homePapa.isShow)
        // }
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
    onShow: function(e) {
        wx.setStorageSync('loadTime',new Date().getTime())
        var that = this;
        that.getInitData();
        console.log("***onShow***", this.data.name);
        wx.showShareMenu({
            withShareTicket: true
        })
        // wx.hideShareMenu() //隐藏转发按钮
        wx.setNavigationBarTitle({
            title: config.projectName
        });
        if (wx.getStorageSync('phone')) {
            this.setData({
                showPhoneAuth: true
            })
        } else {
            this.setData({
                showPhoneAuth: false
            })
        }
        if (wx.getStorageSync('indexLiudian')) {
            this.setData({
                indexLiudian: true
            })
        }
        app.login(function(){
            let param = {
                ip:app.globalData.ip,
                type:'PV',
                pvId:'P_2cMINA_1',
                pvCurPageName:'zhuye',//当前页面名称
                pvCurPageParams:pvCurPageParams,//当前页面参数
                pvLastPageName:getCurrentPages()[getCurrentPages().length-2]?getCurrentPages()[getCurrentPages().length-2].data.despage:'',//上一页页面名称
                pvLastPageParams:'',//上一页页面参数
                pvPageLoadTime:(new Date().getTime() - wx.getStorageSync('loadTime')),//加载时间
            }
            console.log(param,'埋点')
            util.trackRequest(param,app)

        });
        this.setData({
            maidinData:[{id:'#jingcaishijiao',eventId:'exp_2cmina_0',flag:true},
                {id:'#liaojiexiangmu',eventId:'exp_2cmina_1',flag:true},
                {id:'#jingcaitupian',eventId:'exp_2cmina_2',flag:true},
                {id:'#fenxianggeipengyou',eventId:'exp_2cmina_3',flag:true},]
        })

    },
    scrollExp:function(e){
        var that = this;
        // console.log(e.detail)
        if(this.data.scrollFlag){
            this.setData({
                scrollFlag:false
            })
            setTimeout(()=>{
                this.setData({
                    scrollFlag:true
                })
            },1000)
            console.log(this.data.maidinData)
            if( this.data.maidinData.length<1){
                return
            }
            this.data.maidinData.forEach((item,index)=>{
                this.getTop(item.id,function(){
                    let param = {
                        type:'EXP',//埋点类型
                        eventId:item.eventId,//埋点ID
                        pvCurPageName:'zhuye',
                        pvCurPageParams:pvCurPageParams,
                        eventModuleDes:item.id.slice(1),//模块描述信息
                        eventInnerModuleId:'',//事件内部模块信息
                    }
                    util.trackRequest(param,app)
                    console.log(item.id,index);
                    var maidinData =  'maidinData['+index+'].id';
                    that.setData({
                        [maidinData]:0
                    })
                    // that.data.maidinData.splice(index,1)
                    console.log(that.data.maidinData)
                })
            })

            // for(let i=0;i<this.data.maidinData.length;i++){
            //     var flag = true;
            //     this.getTop(this.data.maidinData[i].id,()=>{
            //         debugger
            //         console.log(this.data.maidinData[i].id,i);
            //         that.data.maidinData.splice(i,1)
            //         flag = false;
            //     })
            //     console.log(flag)
            //     if(!flag){
            //         break;
            //     }
            // }
        }
    },
    getTop:function(id,cb){
        if(!id){
            return
        }
        var query = wx.createSelectorQuery()
        query.select(id).boundingClientRect()
        query.selectViewport().scrollOffset()
        return query.exec(function(res){
            // console.log(res[0].top)
            if(res[0].top<550&&res[0].top>100){
                cb()
            }
            // return res[0].top
            // console.log(res[0].top,res[1].scrollTop,id)
            // if()
        })
    },
    goJump:function(e){
        console.log(e.currentTarget.dataset)
        const miniList=['projectIntroduction','recommendedPlan','customStars']//小程序二级页面
        const jumpUrl=e.currentTarget.dataset.jump
        let flag=false
        for(let i=0;i<miniList.length;i++){
            let item =miniList[i]
            if(jumpUrl&&jumpUrl.indexOf(item)>-1){
                const url=`../${item}/${item}`
                wx.navigateTo({
                    url
                })
                flag = true
                break
            }
        }
        if(flag){
            return
        }
        if(e.currentTarget.dataset.jump){
            let param = {
                type:'CLK',//埋点类型
                pvPageStayTime:(new Date().getTime()-wx.getStorageSync('loadTime'))/1000,
                expand:'',
                clkDesPage:e.currentTarget.dataset.despage||'',//点击前往的页面名称
                clkName:e.currentTarget.dataset.despage||'',//点击前往的页面名称
                pvCurPageName:'zhuye',
                pvCurPageParams:pvCurPageParams,
                clkId:e.currentTarget.dataset.clkid,//点击ID
                clkParams:e.currentTarget.dataset.clkid=='clk_2cmina_4'?{
                    "trendId":e.currentTarget.dataset.item.id,
                    "title":e.currentTarget.dataset.item.title||'',
                    "jumpUrl":e.currentTarget.dataset.jump}:{
                    "linkParam":'view='+ encodeURIComponent(e.currentTarget.dataset.jump)+'&title='+e.currentTarget.dataset.title,
                    "imageCode":e.currentTarget.dataset.item.id||'',
                    "jumpUrl":e.currentTarget.dataset.jump||'',
                }//点击参数
            }
            util.trackRequest(param,app)
            app.globalData.currDespage =e.currentTarget.dataset.despage;
            wx.navigateTo({
                url: '../webView/webView?view='+ encodeURIComponent(e.currentTarget.dataset.jump)+'&title='+e.currentTarget.dataset.title,
                success:function(){
                },
                fail: function(res) {
                    // fail
                    console.log(res)
                },
            })
        }else{
            return
        }

    },
    goMoment:function(e){
        var that = this;
		console.log('此时此刻',e)
		wx.request({//获取此时此刻当前播放内容
			url: util.newUrl() + 'elab-marketing-content/moment/queryMomentCurrent',
			method: 'POST',
			data: { houseId: config.houseId },
			success: function (res) {
				console.log('获取视频信息', res)
				if(res.data.single!=null){
					if(e.currentTarget.dataset.id){
						wx.setStorageSync('momentId', e.currentTarget.dataset.id);
						wx.request({
							url:util.newUrl()+'elab-marketing-content/module/modifyMomentView',
							method:'POST',
							data:{
								id:e.currentTarget.dataset.id,
								viewNumber:1
							},
							success:function(res){
                                let para = {
                                    clkDesPage:'shishishijing',//点击前往的页面名称
                                    clkName:'shishishijing',//点击前往的页面名称
                                    clkId:'clk_2cmina_8',//点击ID
                                    clkParams:{lookNum:that.data.momentModule.viewCount||'0'},//点击参数
                                    type:'CLK',//埋点类型
                                }
                                util.trackRequest(para,app)
								wx.navigateTo({
									url: '../video/video',
								})
							}
						})
					}
				}else{
					wx.showToast({
						title:'暂未直播'
					})
				}
			}
        });
        
	},
    getInitData: function() {
        // console.log(e.detail.errMsg)
        var that = this;
        wx.request({
            url:util.newUrl()+'elab-marketing-content/module/queryPositionHome',
            method:'POST',
            data:{houseId:config.houseId},
            header: {
                'content-type': 'application/json' // 默认值
            },
            success:function(res){
                if(res.data.success){
                    if(res.data.single){
                        let data = res.data.single;
                        that.setData({
                            InitFlag: "1",
                            initData:data,
                            homeBanner: data.focusModule.contentList,
                            newsModule:data.newsModule?data.newsModule:{},
                            operationModule: data.operationModule.contentList&&data.operationModule.contentList?data.operationModule.contentList:[],
                            featureModule:data.featureModule.contentList&&data.featureModule.contentList[0]?data.featureModule.contentList[0]:{},
                            parameterModule:data.parameterModule.contentList&&data.parameterModule.contentList[0]?data.parameterModule.contentList[0]:{},
                            momentModule:data.momentModule?data.momentModule:{},
                            viewModule:data.viewModule.contentList&&data.viewModule.contentList[0]?data.viewModule.contentList[0]:{},
                            valueModule:data.valueModule.contentList&&data.valueModule.contentList[0]?data.valueModule.contentList[0]:{},
                            areaModule:data.areaModule.contentList&&data.areaModule.contentList[0]?data.areaModule.contentList[0]:{},
                            layoutModule:data.layoutModule.contentList&&data.layoutModule.contentList[0]?data.layoutModule.contentList[0]:{},
                            effectModule:data.effectModule.contentList&&data.effectModule.contentList[0]?data.effectModule.contentList[0]:{},
                            sampleModule:data.sampleModule.contentList&&data.sampleModule.contentList[0]?data.sampleModule.contentList[0]:{},
                            realityModule:data.realityModule.contentList&&data.realityModule.contentList[0]?data.realityModule.contentList[0]:{},
                            watchModule:data.watchModule.contentList&&data.watchModule.contentList[0]?data.watchModule.contentList[0]:{},
                            matchModule:data.matchModule.contentList&&data.matchModule.contentList[0]?data.matchModule.contentList[0]:{},
                        })
                        if(!that.data.parameterModule.jumpUrl){
                            wx.request({
                                url:util.newUrl()+'elab-marketing-authentication/house/selectHouseParameter',
                                method:'POST',
                                data:{id:config.houseId},
                                success:function(res){
                                    if(res.statusCode==200){
                                        if(res.data.single&&(res.data.single.catalogs||res.data.single.houseImage)){
                                            that.setData({
                                                ['parameterModule.jumpUrl']:config.parameterUrl+config.houseId
                                            })
                                            // that.data.parameterModule.jumpUrl = config.parameterUrl+config.houseId;
                                            console.log(that.data.parameterModule.jumpUrl,config.parameterUrl,config.houseId)
                                        }
                                    }

                                }
                            })
                        }
                        if(!that.data.watchModule.jumpUrl){
                            let showTdviewFlag = 0
                            wx.request({
                                url:util.newUrl()+'elab-marketing-authentication/layoutVr/house',
                                method:'POST',
                                data:{houseId:config.houseId,pageNo:1,pageSize:10},
                                success:function(res){
                                    if(res.statusCode==200&&res.data.success){
                                        if(res.data.list&&res.data.list.length>0){
                                            res.data.list.forEach((item)=>{
                                                if(item.catalog==2){
                                                    showTdviewFlag++
                                                }
                                            })
                                            if(showTdviewFlag>1){
                                                that.setData({
                                                    ['watchModule.jumpUrl']:config.tdviewUrl+config.houseId
                                                })
                                            }
                                            if(showTdviewFlag==1){
                                                that.setData({
                                                    ['watchModule.jumpUrl']:res.data.list[0].url
                                                })
                                            }
                                            // that.data.parameterModule.jumpUrl = config.parameterUrl+config.houseId;
                                            console.log(that.data.watchModule.jumpUrl,'watch')
                                        }
                                    }
                                }
                            })
                        }
                    }
                    console.log(that.data.initData,'oooooooooooooo')
                }
            },
            fail:function(res){
                console.log(res,'ghghgg')
            }

        })
        // wx.request({
        //   url: util.url(),
        //   method: 'POST',
        //   data: util.reformParam(util.InitUrl, {
        //     houseId: app.globalData.houseid
        //   }),
        //   header: {
        //     'content-type': 'application/json' // 默认值
        //   },
        //   success: function(res) {
        //     that.setData({
        //       InitFlag: "1",
        //     });
        //     if (res.data.success) {
        //       if (res.data.single) {
        //         var myheight = res.data.single.homePapa.isShow == '0' ? "700": "1070";
        //         that.setData({
        //           homeLocation: res.data.single.homeLocation,
        //           home3D: res.data.single.home3D,
        //           homeMoment: res.data.single.homeMoment,
        //           homeBanner: res.data.single.homeBanner,
        //           homeCollect: res.data.single.homeCollect,
        //           homeInvest: res.data.single.homeInvest,
        //           homeLive: res.data.single.homeLive,
        //           homeFeature: res.data.single.homeFeature,
        //           homePapa: res.data.single.homePapa,
        //           Height: myheight
        //         });
        //
        //       } else {
        //         wx.showToast({
        //           title: "Sorry,数据不存在,请稍后再试",
        //           icon: 'warn',
        //           duration: 1500,
        //         })
        //       }
        //     } else {
        //       console.log("***Index-Error-getInitData***", res);
        //       wx.showToast({
        //         title: res.data.message + '[' + res.data.errorCode + ']',
        //         icon: 'warn',
        //         duration: 1500,
        //       })
        //     }
        //   }
        // })
    },
    // 用户授权
    getUserInfo: function(e) {
        var self = this;
        wx.setStorageSync('ISauthorizeInfo', true); // 是否授权过用户基本信息,
        console.log(e.detail, 'kkkkkkkkkkkkkkkkkkkk');
        this.setData({
            showInfoModel: false
        });
        if (e.detail.errMsg.includes("fail")) {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '您点击了拒绝授权,部分功能将无法向您开放',
                success: function(res) {
                    typeof self.data.infoFailFun == "function" && self.data.infoFailFun();
                }
            })

        } else {
            app.globalData.userInfo = e.detail.userInfo
            var id = this.data.userInfo.nickName;
            wx.setStorageSync('userInfo', e.detail.userInfo);
            typeof self.data.infoFun == "function" && self.data.infoFun(); // 执行回调函数
        }
    },
    // 手机号授权
    getPhoneNumber: function(e) {
        var self = this;
        // 隐藏
        this.setData({
            showPhoneModel: false
        });
        app.globalData.isPhone=true;
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
        }
    },
    authorizePhone:function(cb, failcb) {

        var that = this;
        // app.globalData.phone = wx.getStorageSync('phone');
        console.log("***authorizePhone***", app.globalData.phone, wx.getStorageSync('phone'))
        // 没有获得用户手机号
        if (!wx.getStorageSync('ISauthorizePhone')) {
            debugger
            that.setData({
                showPhoneModel: true,
                phoneFun: cb,
                phoneFailFun: failcb || null
            })
        } else {
            that.setData({
                showPhoneModel: false,
                showPhoneAuth: true
            });
            typeof cb == "function" && cb()
        }
    },
    authorizeIndexPhone:function(cb, failcb) {
        var that = this;
        // wx.getStorageSync('ISauthorizePhone');// 是否授权过手机号,
        if (!wx.getStorageSync('ISauthorizePhone')) {
            app.globalData.phone = wx.getStorageSync('phone');
            console.log("***authorizeIndexPhone***", app.globalData.phone, wx.getStorageSync('phone'));
            // 没有获得用户手机号
            if (!wx.getStorageSync('ISauthorizePhone')) {
                that.setData({
                    showPhoneModel: true,
                    phoneFun: cb || null,
                    phoneFailFun: failcb || null
                })
            } else {
                that.setData({
                    showPhoneModel: false,
                    showPhoneAuth: true
                });
                typeof cb == "function" && cb()
            }
        }
    },
    authorizeInfo(cb, failcb) {
        var that = this;
        app.globalData.userInfo = wx.getStorageSync('userInfo');
        // 获得用户信息
        wx.getSetting({
            success: (response) =>{
                console.log("getSetting", response);
                // typeof cb == "function" && cb()
                // 没有授权需要弹框
                if (!response.authSetting['scope.userInfo']) {
                    that.setData({
                        showInfoModel: true,
                        infoFun: cb,
                        infoFailFun: failcb || null
                    })
                } else {
                    // 判断用户已经授权。不需要弹框
                    that.setData({
                        showInfoModel: false
                    });
                    typeof cb == "function" && cb()
                }
            },
            fail: function() {
                wx.showToast({
                    title: '系统提示:网络错误',
                    icon: 'warn',
                    duration: 1500,
                })
            }
        })
    },
    authorizeIndexInfo:function(cb, failcb) {
        var that = this;
        if (!wx.getStorageSync('ISauthorizeInfo')) {
            app.globalData.userInfo = wx.getStorageSync('userInfo');
            // console.log("******",app.globalData.userInfo,wx.getStorageSync('userInfo'),typeof(app.globalData.userInfo))
            // 获得用户信息
            wx.getSetting({
                success: (response) =>{
                    console.log("getSetting", response)
                    // typeof cb == "function" && cb()
                    // 没有授权需要弹框
                    if (!response.authSetting['scope.userInfo']) {
                        that.setData({
                            showInfoModel: true,
                            infoFun: cb,
                            infoFailFun: failcb || null
                        })
                    } else {
                        // 判断用户已经授权。不需要弹框
                        that.setData({
                            showInfoModel: false
                        });
                        typeof cb == "function" && cb()
                    }
                },
                fail: function() {
                    // typeof cb == "function" && cb()
                    wx.showToast({
                        title: '系统提示:网络错误',
                        icon: 'warn',
                        duration: 1500,
                    })
                }
            })
        } else {
            typeof cb == "function" && cb()
        }
    },
    userPhone: function(e) {
        console.log(e, '寂静欢喜');
        this.setData({
            tel: e.detail.value
        })
    },
    verifyCode: function(e) {
        console.log(e, 'yuan');
        this.setData({
            verifyCode: e.detail.value
        })
    },
    getVerifyCode: function() { //验证码

        var that = this;
        if (that.data.isSend) {
            return
        }
        if (!/^1\d{10}$/.test(that.data.tel)) {
            wx.showToast({
                title: '输入的手机号不合法',
                icon: "none",
                duration: 2000
            });
            return;
        }
        wx.request({
            url: util.newUrl()+'elab-marketing-authentication/vcode/verifyCodeForLeavePhone/send',
            method: 'POST',
            data:  {phoneNumber: that.data.tel},
            header:{
                'content-type': 'application/json', // 默认值
                'tonken':app.globalData.tonken},
            success: function() {
                that.setData({
                    isSend: true,
                    showAdmit:true,
                    toView:'empty-box'
                });
                let time = 60;
                let time1 = setInterval(function() {
                        if (time > 0) {
                            time = time - 1;
                            that.setData({
                                verifyText: time + '秒后获取'
                            })
                            //that.data.verifyText = time +'秒后获取'
                        } else {
                            that.setData({
                                verifyText: '完成',
                                isSend: false
                            });
                            clearInterval(time1)
                        }
                    },
                    1000)
            },
            fail: function() {
                wx.showToast({
                    title: '网络连接出现问题，请稍后再试！',
                    icon: "none",
                    duration: 2000
                })
            }
        });
    },
    sendTel: function() { //点击打钩按钮
        var that = this;
        if (that.data.flag) {
            return
        }
        that.setData({
            flag: true
        });
        if (!/^1\d{10}$/.test(that.data.tel)) {
            wx.showToast({
                title: '请输入正确的手机号',
                icon: "none",
                duration: 2000
            });
            that.setData({
                flag: false
            });
            return;
        }
        console.log(that.data.verifyCode.length);
        if (that.data.verifyCode.length < 1) {
            wx.showToast({
                title: '验证码不能为空',
                icon: "none",
                duration: 2000
            });
            that.setData({
                flag: false
            });
            return;
        }

        wx.request({
            url: util.newUrl()+'elab-marketing-authentication/contact/leavephone/miniapp/insert',
            method: 'POST',
            data: {
                "houseId":config.houseId,
                leavePhoneCustomerId : app.globalData.single.id,
                shareParam : app.globalData.fromChannel,
                mobile: that.data.tel,
                code: that.data.verifyCode,
                source:"3"
            },
            header:{
                'content-type': 'application/json', // 默认值
                'tonken':app.globalData.tonken},
            success: function(res) {
                console.log(res, '//////');
                if (res.data.success) {
                    wx.setStorageSync('phone',that.data.tel)
                    wx.setStorageSync('indexLiudian', true);
                    that.setData({
                        showPhoneAuth: true,
                        showAgree: true
                    })
                    that.setData({
                        dialog: true
                    });
                    var para={
                        clkId:'clk_2cmina22',
                        clkDesPage:'zaixianliudian',//点击前往的页面名称
                        clkName:'zaixianliudian',//点击前往的页面名称
                        type:'CLK',//埋点类型
                        pvCurPageName:'zhuye',//当前页面
                        clkParams:{"mobile":this.data.tel},//点击参数
                        pvCurPageParams:pvCurPageParams,//当前页面参数
                    }
                    util.trackRequest(para,app)
                    setTimeout(function() {
                            that.setData({
                                dialog: false
                            });
                            // wx.navigateTo({
                            //     url: '../index/index'
                            // });
                        },
                        2000);
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: "none",
                        duration: 2000
                    });
                    that.setData({
                        flag: false
                    });
                }
            },
            fail: function(re) {
                wx.showToast({
                    title: res.data.message,
                    icon: "none",
                    duration: 2000
                });
                that.setData({
                    flag: false
                });
            }
        });
    },
    telData: function() { //留电接口
        var that = this;
        var houseid = app.globalData.houseid;
        var pages = getCurrentPages();
        var currentPage = pages[pages.length - 1]
        var urlhref = currentPage.route;
        console.log('当前页面链接', currentPage.route);
        wx.request({
            url: util.url(),
            method: 'POST',
            data: util.reformParam(util.savephone, {
                houseid: houseid,
                name: app.globalData.loginid,
                channel: app.globalData.fromChannel,
                mobile: that.data.tel,
                platform: '3',
                refer: urlhref
            }),
            success: function() {

                wx.setStorageSync('indexLiudian', true);
                that.setData({
                    showPhoneAuth: true,
                    showAgree: true
                })
            },
            fail: function(re) {

            }
        });
    },
})