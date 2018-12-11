var pvCurPageParams = ''
var util = require('../../utils/util.js')
var app = getApp()
var config = require('../../config.js')
var serverUrl = 'http://skyforest.static.elab-plus.com/wepy_pro/v1-2/'
Page({
    data: {
        serverUrl: serverUrl,
        jbColor1: " #6294A6", //渐变色
        jbColor2: "#3B4B81", //渐变色
        shade1: "rgba(39,42,52,0.00)", //蒙层
        despage: 'huxingye',
        shade2: "#272A34", //蒙层
        list: [], //楼栋列表
        // list:['2号楼','3号楼','4号楼'],//楼栋列表
        // list:['2号楼','3号楼'],//楼栋列表
        // list:['2号楼'],//楼栋列表
        active: 0, //选中的
        houseList: [], //楼栋下面户型列表
        currentName: '', //当前楼栋名
        // loading:true,
    },
    // onShareAppMessage(options) {
    //     return {
    //         title: '宁波WIII',
    //         imageUrl: serverUrl+"touzhikandian.png",
    //         path: '/pages/houseType/houseType?shareToken='+app.globalData.shareToken
    //     }
    // },
    getList: function() { //获取楼栋列表
        // console.log(e.detail.errMsg)
        var that = this;
        wx.request({
            url: util.newUrl() + 'elab-marketing-content/layout/listBuilding',
            method: 'POST',
            data: {
                "houseId": config.houseId
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
                console.log('楼栋数据', res);
                if (res.statusCode == 200) {
                    if (res.data.success) {
                        if (res.data.list && res.data.list.length > 0) {
                            that.setData({
                                list: res.data.list || []
                            })
                            that.getHouseList(res.data.list[0].id, res.data.list[0].name)
                        }
                    } else {
                        wx.showToast({
                            title: res.data.message + '[' + res.data.errorCode + ']',
                            icon: 'warn',
                            duration: 1500,
                        })
                    }
                }
                wx.hideLoading();
            },
            fail: function(res) {
                wx.showToast({
                    title: res.errMsg,
                    icon: 'warn',
                    duration: 1500,
                });
                wx.hideLoading();
            }

        })
    },
    getHouseList: function(id, name) { //获取楼栋列表
        this.setData({
            'currentName': name
        }); //记录当前楼栋
        // console.log(e.detail.errMsg)
        var that = this;
        wx.request({
            url: util.newUrl() + 'elab-marketing-content/layout/pageListLayoutByBuilding',
            method: 'POST',
            data: {
                "houseId": config.houseId,
                buildingId: id
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
                console.log('楼栋户型数据', res);
                if (res.data.success && res.data.pageModel.resultSet.length > 0) {
                    that.setData({
                        houseList: res.data.pageModel.resultSet
                    })
                } else {
                    that.setData({
                        houseList: []
                    })
                    wx.showToast({
                        title: res.data.message + '[' + res.data.errorCode + ']',
                        icon: 'warn',
                        duration: 1500,
                    })
                }
            },
            fail: function(res) {
                wx.showToast({
                    title: res.errMsg,
                    icon: 'warn',
                    duration: 1500,
                })
            }

        })
    },
    checkOutHouse(e) {
        var para = {
            clkId: 'clk_2cmina_29',
            clkDesPage: '', //点击前往的页面名称
            clkName: 'loudongxuanze', //点击前往的页面名称
            type: 'CLK', //埋点类型
            clkParams: {
                buildingId: e.currentTarget.dataset.name
            }, //点击参数
            pvCurPageName: 'huxingye', //当前页面
            pvCurPageParams: pvCurPageParams, //当前页面参数
        }
        util.trackRequest(para, app)
        this.setData({
            'active': e.target.id
        })
        this.getHouseList(e.currentTarget.dataset.id, e.currentTarget.dataset.name)
    },
    goDetail(e) {
        var id = e.currentTarget.dataset.id; //点击的索引
        var index = e.currentTarget.dataset.index; //点击的索引
        var detail = {
            houseList: this.data.houseList,
            currentName: this.data.currentName,
            id: id,
            index: index
        };
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
        console.log(detail, 'detail')
        util.trackRequest(para, app)
        app.globalData.houseTypeDetail = detail;
        wx.navigateTo({
            url: '../houseTypeDetail/houseTypeDetail'
        })
    },
    goChatList: function(e) {
        var isSend = wx.getStorageSync('isSend' + config.houseId);
        if (!isSend) { //没聊天
            wx.navigateTo({
                url: '../counselorList/counselorList'
            })
        } else {
            wx.navigateTo({
                url: '../messagesList/messagesList'
            })
        }
    },
    onShow: function(e) {
        // wx.showLoading({
        //     title: '正在加载',
        // })
        console.log(JSON.stringify("onShow:"+e));
        wx.setStorageSync('loadTime', new Date().getTime())
        var para = {
            pvId: 'P_2cMINA_9',
            type: 'PV', //埋点类型
            pvCurPageName: 'huxingye', //当前页面
            pvLastPageName: app.globalData.pageDesc||'', //上-页面
            pvCurPageParams: pvCurPageParams, //当前页面参数
            pvPageLoadTime: (new Date().getTime() - wx.getStorageSync('loadTime')), //加载时间
        }
        util.trackRequest(para, app)
    },
    // 注意：对界面内容进行设置的 API 如wx.setNavigationBarTitle，请在onReady之后进行。
    onReady() {
        // this.setData({
        //   loading:false
        // })
        // wx.hideLoading();
        wx.setNavigationBarTitle({
            title: '户型'
        })
    },
    onUnload() {
        util.stopTrackEventTimeObj();
        let param = {
            pvPageStayTime: (new Date().getTime() - wx.getStorageSync('loadTime')) / 1000,
            pvCurPageName: this.data.despage || '', //当前页面名称
            clkDesPage: 'zhuye', //点击前往的页面名称
            clkName: 'fanhui', //点击前往的页面名称
            clkId: 'clk_2cmina_36', //点击ID
            clkParams: {
            },
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
        // app.globalData.fromChannel = options.shareToken||'';
        if (options && options.shareToken && options.shareToken != "null" && options.shareToken != "undefined") {
            app.globalData.fromChannel = options.shareToken
        }
        pvCurPageParams = JSON.stringify(options)
        console.log("pvCurPageParams数据:" + pvCurPageParams);
        this.getList()
    }
})