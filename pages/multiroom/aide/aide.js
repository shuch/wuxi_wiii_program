var app  = getApp();
var util = require('../../../utils/util.js')
var rtcroom = require('../../../utils/rtcroom.js');
var getlogininfo = require('../../../getlogininfo.js');
var config = require('../../../config.js');

Page({
  // onShareAppMessage: function () {
  //   return {
  //     title: '分类',
  //     path: '/pages/classify/classify'
  //   }
  // },
  data:{
    adviserList:[
      // { name:'顾问1号', data: '123' },
      // { name:'顾问2号', data: '7' },
      // { name:'顾问3号', data: '9' },
    ],
    aideData:{},
    isSuc:null,
  },
  go:function(e){
    // wx.navigateTo({
    //   url: '../chat/chat?data=' + e.target.dataset.index,
    // })
    console.log(e.target.dataset);
    this.login(e.target.dataset.item.name);
    console.log(e.target.dataset.index,'uu');
  },
  login:function (opt) {
    wx.showLoading({
      title: '登录信息获取中',
    }) 
    // rtcroom初始化
    var self = this;
    getlogininfo.getLoginInfo({
      type: 'multi_room',
      opt: opt,
      success: function (ret) {
          console.log("success")
          self.data.firstshow = false;
          self.data.isGetLoginInfo = true;
          // self.getRoomList(function () { });
          console.log('我的昵称：',ret.userName,ret);
          self.setData({
            userName: ret.userName
          });
          wx.hideLoading();
          self.creatroom(ret.userName);
      },
      fail: function (ret) {
            self.data.isGetLoginInfo = false;
            console.log("***获取登录信息失败&&&getlogininfo***",ret)
            wx.hideLoading();
            wx.showModal({
              title: '获取登录信息失败',
              content: ret.errMsg,
              showCancel: false,
              complete: function() {
                wx.navigateBack({});
              }
            });
      }
    });
  },
  creatroom:function (userName) {
    let roomName = "视频看房";
    let roomID = "web_" + Date.now();
    var url = '../room/room?type=create&roomName=' + roomName + '&userName=' + userName + '&roomID=' + roomID + '&isSuc=' + this.data.isSuc;
    wx.redirectTo({
      url: url
    });
    wx.showToast({
      title: '进入房间',
      icon: 'success',
      duration: 1000
    })
  },
  onLoad:function(options){
    var that = this;
    console.log("------********",options)
    that.setData({
      isSuc:options.isSuc || ""
    })
    // 获取看房小助手接口
    wx.request({
      url: util.newUrl()+'elab-marketing-authentication/worker/account/randomAdviser',
      method: 'POST',
      data:{
        "houseId": config.houseId,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (ret) {
        console.log('看房小助手接口:',ret);
        if(!ret.data.single){
          wx.showModal({
            title: '提示',
            content: "当前没有空闲的看房小助手",
            showCancel: false,
            success: function(res) {
              // wx.navigateTo({ url: "../index/index" });
              if(options.isSuc){
                wx.redirectTo({
                  url:'../../chat/chat'
                })
              }
              else{
                wx.navigateBack({ changed: true });
              }
            }
          });
        }
        else {
          app.globalData.videoCustomer=that.aideData=ret.data.single;
          that.login(that.aideData);
        }
      },
      fail: function (ret) {
        console.log('获取看房小助手接口失败: ', ret);
        if (ret.errMsg == 'request:fail timeout') {
          var errCode = -1;
          var errMsg = '网络请求超时，请检查网络状态';
        }
        options.fail && options.fail({
          errCode: errCode || -1,
          errMsg: errMsg || '获取看房小助手接口失败，调试期间请点击右上角三个点按钮，选择打开调试'
        });
      }
    });
    
  },

})