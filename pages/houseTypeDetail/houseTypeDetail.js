var pvCurPageParams = '';
var util = require('../../utils/util.js')
var app = getApp()
var config = require('../../config.js')
var serverUrl = 'http://skyforest.static.elab-plus.com/wepy_pro/v1-2/'
Page({
    data: {
        serverUrl: serverUrl,
        jbColor1: " #6294A6", //渐变色
        jbColor2: "#3B4B81", //渐变色
        dataList: [],
        list: ['123', '123', '123', '123', '123'], //面积列表
        picList: [], //设计图列表
        houseType: "",
        positionImg: "", //区域图
        despage: 'huxingtupian',
        previewFlag: false,
        houseDetail: "",
        active: 0, //选中的
        current: 0, //轮播索引
        detail: '',
        currentIndex: 0,
        defaultImagePath: '../../image/wepy_pro/loading1.gif',
        //所有图片的高度
        imgheights: [],
        //图片宽度
        imgwidth: 690,
    },
    onShareAppMessage(options) {
        let param = {
            clkId: 'clk_2cmina_31',
            clkDesPage: 'huxingfenxiang', //点击前往的页面名称
            clkName: 'huxingfenxiang', //点击前往的页面名称
            type: 'CLK', //埋点类型
            pvCurPageName: 'huxingtupian', //当前页面
            clkParams: {
                houseType: this.data.active
            }, //点击参数
            expand: '',
            pvCurPageParams: pvCurPageParams, //当前页面参数
        }
        util.trackRequest(param, app);
        console.log("***houseTypeDetail-onShareAppMessage***", app.globalData.shareToken)
        return {
            imageUrl: app.globalData.shareImage || '',
            title: this.data.title || app.globalData.projectName,
            path: '/pages/houseTypeDetail/houseTypeDetail?shareToken=' + app.globalData.shareToken + '&detail=' + JSON.stringify(this.data.detail)
        }
    },
    pre: function() {
        this.setData({
            "current": this.data.current - 1
        })
    },
    next: function() {
        this.setData({
            "current": this.data.current + 1
        })
    },
    checkOutHouse(e) {
        var id = e.currentTarget.dataset.id; //点击的索引
        var para = {
            clkId: 'clk_2cmina_30',
            clkName: 'huxingxuanze',
            clkDesPage: 'huxingtupian', //点击前往的页面名称
            type: 'CLK', //埋点类型
            clkParams: {
                houseType: id
            }, //点击参数
            pvCurPageName: 'huxingye', //当前页面
            pvCurPageParams: pvCurPageParams, //当前页面参数
        }
        util.trackRequest(para, app)
        var index = e.target.dataset.index,
            houseList = this.data.dataList;
        this.data.currentIndex = index;
        for (var i = 0; i < houseList[index].layoutImageResponseList.length; i++) {
            if (houseList[index].layoutImageResponseList[i].loadComplete === null || houseList[index].layoutImageResponseList[i].loadComplete === undefined) {
                houseList[index].layoutImageResponseList[i].loadComplete = false;
            }
        }
        this.setData({
            'active': e.target.dataset.id,
            'current': 0,
            'imgheights': [],
            'positionImg': houseList[index].positionImg,
            'houseType': houseList[index].unitDes,
            'houseDetail': houseList[index].remark,
            'picList': houseList[index].layoutImageResponseList
        })
    },
    bindchange: function(e) {
        this.setData({
            'current': e.detail.current
        })
    },
    priviewPic1: function(event) {
        // //图片预览
        var src = this.data.picList[event.currentTarget.dataset.index].imageUrl;
        var urls = this.data.picList.map(function(v) {
            return v.imageUrl
        })
        // urls.push(src)
        this.data.previewFlag = true;
        console.log(urls);
        wx.previewImage({
            current: src, // 当前显示图片的http链接
            urls: urls // 需要预览的图片http链接列表
        })
    },
    goChatList: function(e) {
        var isSend = wx.getStorageSync('isSend' + config.houseId);
        if (!isSend) { //没聊天
            var para = {
                clkId: 'clk_2cmina_32',
                clkDesPage: 'xuanzeguwenliebiao', //点击前往的页面名称
                clkName: 'huxingzaixianzixun', //点击前往的页面名称
                type: 'CLK', //埋点类型
                pvCurPageName: 'huxingtupian', //当前页面
                pvCurPageParams: pvCurPageParams, //当前页面参数
            }
            util.trackRequest(para, app)
            wx.navigateTo({
                url: '../counselorList/counselorList'
            })
        } else {
            var para = {
                clkId: 'clk_2cmina_32',
                clkDesPage: 'xiaoxiliebiao', //点击前往的页面名称
                clkName: 'huxingzaixianzixun', //点击前往的页面名称
                type: 'CLK', //埋点类型
                pvCurPageName: 'huxingtupian', //当前页面
                pvCurPageParams: pvCurPageParams, //当前页面参数
            }
            util.trackRequest(para, app)
            wx.navigateTo({
                url: '../messagesList/messagesList'
            })
        }
    },
    load(e) {
        console.log("houseTypeDetail", e);
        this.data.picList[e.currentTarget.dataset.index || 0].loadComplete = true;
        this.data.dataList[this.data.currentIndex].layoutImageResponseList[e.currentTarget.dataset.index || 0].loadComplete = true;
        this.setData({
            'picList': this.data.picList
        })
        //获取图片真实宽度
        var imgwidth = e.detail.width,
            imgheight = e.detail.height,
            //宽高比
            ratio = imgwidth / imgheight;
        console.log(imgwidth, imgheight)
        //计算的高度值
        var viewHeight = 690 / ratio;
        var imgheight = viewHeight
        var imgheights = this.data.imgheights
        //把每一张图片的高度记录到数组里
        // imgheights.push(imgheight)
        // 必须这么写，为了防止图片完成事件的随机顺序导致 数组排序错误
        imgheights[e.currentTarget.dataset.index] = imgheight;
        this.setData({
            imgheights: imgheights,
        })
        console.log(this.data.imgheights)
    },
    error(e) {
        console.log("houseTypeDetail", e);
    },
    onShow: function(e) {
        console.log('onshow')
        var that = this;
        wx.setStorageSync('loadTime', new Date().getTime())
        app.login(function() {
            if (that.data.previewFlag) {
                that.data.previewFlag = false
                return
            }
            var para = {
                pvId: 'P_2cMINA_10',
                type: 'PV', //埋点类型
                clkParams: {
                    houseType: that.data.active
                },
                pvCurPageParams: pvCurPageParams, //点击参数
                pvCurPageName: 'huxingtupian', //当前页面
                pvLastPageName: 'huxingye', //上-页面
                pvPageLoadTime: (new Date().getTime() - wx.getStorageSync('loadTime')), //加载时间
            }
            util.trackRequest(para, app);
            console.log('已发送埋点')
        })
    },
    onReady() {
        wx.hideLoading();
    },
    onUnload() {
        util.stopTrackEventTimeObj();
        let param = {
            pvPageStayTime: (new Date().getTime() - wx.getStorageSync('loadTime')) / 1000,
            pvCurPageName: this.data.despage || '', //当前页面名称
            clkDesPage: 'huxingtupian', //点击前往的页面名称
            clkName: 'fanhui', //点击前往的页面名称
            clkId: 'clk_2cmina_36', //点击ID
            type: 'CLK', //埋点类型
        };
        util.trackRequest(param, app);
    },
    onHide() {
        util.stopTrackEventTimeObj();
    },
    onLoad: function(options) {
        wx.showLoading({
            title: '正在加载',
        })
        pvCurPageParams = JSON.stringify(options);
        console.log("****houseTypeDetail-onload**", pvCurPageParams, options.detail, )
        var detail = app.globalData.houseTypeDetail || JSON.parse(options.detail);
        var houseList = detail.houseList;
        var index = detail.index;
        this.data.currentIndex = index;
        // app.globalData.fromChannel = options.shareToken||'';
        if (options && options.shareToken && options.shareToken != "null" && options.shareToken != "undefined") {
            app.globalData.fromChannel = options.shareToken
        }
        for (var i = 0; i < houseList[index].layoutImageResponseList.length; i++) {
            houseList[index].layoutImageResponseList[i].loadComplete = false;
        }
        wx.setNavigationBarTitle({
            title: detail.currentName
        })
        this.setData({
            'dataList': houseList,
            'detail': detail,
            'active': detail.id,
            'positionImg': houseList[index].positionImg,
            'houseType': houseList[index].unitDes,
            'houseDetail': houseList[index].remark,
            'picList': houseList[index].layoutImageResponseList
        })
        app.globalData.pageDesc = "huxingtupian";
    }
})