var util = require('../../utils/util.js')
var app = getApp();
var config = require('../../config.js');
var serverUrl = 'http://skyforest.static.elab-plus.com/wepy_pro/'
var {authorizeInfo,getUserInfo} = require('../../getlogininfo.js')
Page({
    data:{
        serverUrl:serverUrl,
        list:[],
        note:'',
        showInfoModel:false,
        showImgModel:false,
        showPhoneModel:false,
        reloadModel:false,
        showImgBtn:false,
        shareImg:"",
        phoneFailFun:null,
        loadComplete:false,
        defaultImagePath:'../../image/wepy_pro/loading3.gif',
        phoneFun:null
    },
    load(){
      this.setData({
          loadComplete:true
      })
    },
    reload(){
        this.loadImg()
        this.setData({
            reloadModel:false
        })
    },
    onShow: function(e){
        let that = this;
        wx.setStorageSync('loadTime',new Date().getTime())
        let param = {
            type:'PV',
            pvId:'P_2cMINA_18',
            pvCurPageName:'baocunzhaopiananniu',//当前页面名称
            pvCurPageParams:'',//当前页面参数
            pvLastPageName:getCurrentPages()[getCurrentPages().length-2]?getCurrentPages()[getCurrentPages().length-2].data.despage:'',//上一页页面名称
            pvLastPageParams:'',//上一页页面参数
            pvPageLoadTime:(new Date().getTime() - wx.getStorageSync('loadTime')),//加载时间
        }
        util.trackRequest(param,app);
        wx.getSetting({
            success: (response) => {
                console.log("***rtcroomCom.onLoad***getSetting",response,response.authSetting['scope.writePhotosAlbum']===false)
                // 没有授权
                if (response.authSetting['scope.writePhotosAlbum']===false){
                    that.setData({
                        showImgBtn:true
                    })
                    console.log(that.data.showImgBtn)
                }else{
                }
            }
        })

        wx.hideShareMenu() //隐藏转发按钮
    },
    onUnload(){
    },
    onHide(){
    },
    loadImg(){
        let that = this;
        if(wx.getStorageSync('shareImgFlag')){
            that.setData({
                shareImg:wx.getStorageSync('shareProgram')
            })
            return false
        }
        wx.getSetting({
            success:response=>{
                if(response.authSetting['scope.userInfo']&&!app.globalData.userInfo){
                    wx.getUserInfo({
                        success:function(res){
                            if(res.userInfo){
                                app.globalData.userInfo = res.userInfo;
                                console.log('已获取user信息',res)
                               that.startLoad()
                            }
                        },
                        fail:function(err){
                            that.startLoad()
                        }
                    })
                }else{
                    that.startLoad()
                }
            }
        })

    },
    startLoad(){
        let that = this;
        setTimeout(()=>{
            wx.request({
                url: util.newUrl()+'elab-marketing-authentication/image/create',
                method: 'POST',
                data:{
                    appId:app.globalData.appid,
                    houseId: config.houseId,
                    name:app.globalData.userInfo ? app.globalData.userInfo.nickName: "",
                    head:app.globalData.userInfo ? app.globalData.userInfo.avatarUrl: "",
                    path:'/pages/index/index',
                    secret:app.globalData.secret,
                    xcxName:app.globalData.projectName,
                    scene:app.globalData.shareToken
                },
                success:function(res){
                    if(res.statusCode==200&&res.data.success){
                        if(res.data.single){
                            wx.hideLoading();
                            if(app.globalData.userInfo&&app.globalData.userInfo.nickName){
                                wx.setStorageSync('shareImgFlag',true)
                            }
                            wx.setStorageSync('shareProgram',res.data.single)
                            that.setData({
                                shareImg:res.data.single
                            })
                        }
                    }else{
                       that.setData({
                           reloadModel:true
                       })
                    }
                },
                fail:function(res){
                    that.setData({
                        reloadModel:true
                    })
                }
            })
        },200)
    },
    cancel(){
        this.setData({
            reloadModel:false
        })
    },
    onReady(){
        // wx.hideLoading();
        wx.setNavigationBarTitle({
            title: '我要分享'
        })
    },
    onLoad(options){
        // wx.showLoading({
        //     title: '正在加载',
        // })
        var that=this;
        // this.setData({
        //     shareImg:wx.getStorageSync('shareProgram')
        // })
        that.loadImg()

    },//手机号授权
    getShareProgram:function(){
        this.setData({
            showImgModel:false,
            showImgBtn:false
        })
    },
    save(){
        let that = this;
        var para={
            clkId:'clk_2cmina_56',
            clkDesPage:'',//点击前往的页面名称
            clkName:'baocunzhaopianye',//点击前往的页面名称
            type:'CLK',//埋点类型
            pvCurPageName:'baocunzhaopiananniu',//当前页面
            pvCurPageParams:'',//当前页面参数
        }
        util.trackRequest(para,app)
        // wx.showLoading()
        if(!this.data.shareImg){
            return
        }
        if(wx.getStorageSync('shareProgram')){
            wx.getSetting({
                success: (response) => {
                    console.log("***rtcroomCom.onLoad***getSetting",response)
                    // 没有授权
                    if (!response.authSetting['scope.writePhotosAlbum']){
                        wx.authorize({
                            scope: 'scope.writePhotosAlbum',
                            success() {
                                wx.showLoading({
                                    title:'正在保存...'
                                })
                                wx.getImageInfo({
                                    src: that.data.shareImg,
                                    success: function (res) {
                                        var path = res.path;
                                        wx.saveImageToPhotosAlbum({
                                            filePath: path,
                                            success(result) {
                                                wx.hideLoading();
                                                wx.showToast({
                                                    title: "保存成功！",
                                                    icon: 'success',
                                                    duration: 1500,
                                                })
                                            },
                                            fail(err){
                                                wx.hideLoading();
                                            }
                                        })
                                    }
                                })
                            },
                            fail(res){
                                wx.hideLoading()
                                that.setData({
                                    showImgBtn:true
                                })
                            }
                        })
                    }else{
                        wx.showLoading({
                            title:'正在保存...'
                        })
                        wx.getImageInfo({
                            src: that.data.shareImg,
                            success: function (res) {
                                var path = res.path;
                                wx.saveImageToPhotosAlbum({
                                    filePath: path,
                                    success(result) {
                                        wx.hideLoading();
                                        wx.showToast({
                                            title: "保存成功！",
                                            icon: 'success',
                                            duration: 1500,
                                        })
                                    },
                                    fail(err){
                                        wx.hideLoading();
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }
        else{
            wx.showToast({
                title: "生成图片中，请稍等片刻",
                icon: 'none',
                duration: 1500,
            })
        }

    },

})
