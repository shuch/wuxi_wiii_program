var app  = getApp();
var util = require('../../../utils/util.js')
var rtcroom = require('../../../utils/rtcroom.js');
var getlogininfo = require('../../../getlogininfo.js');

Page({
  onShareAppMessage: function () {
    return {
      title: '分类',
      path: '/pages/classify/classify'
    }
  },
  data:{
    adviserList:[
      // { name:'顾问1号', data: '123' },
      // { name:'顾问2号', data: '7' },
      // { name:'顾问3号', data: '9' },
    ]
  },
  go:function(e){
    // wx.navigateTo({
    //   url: '../chat/chat?data=' + e.target.dataset.index,
    // })
    console.log(e.target.dataset);
    this.login(e.target.dataset.item.name);
    console.log(e.target.dataset.index,'uu');
  },
  login:function (consultantName) {
    wx.showLoading({
        title: '登录信息获取中',
    }) 
    // rtcroom初始化
    var self = this;
    console.log(this.data);
    getlogininfo.getLoginInfo({
      type: 'multi_room',
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
          self.creatroom(ret.userName,consultantName);
      },
      fail: function (ret) {
            self.data.isGetLoginInfo = false;
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
  creatroom:function (userName,consultantName) {
    let roomName = userName + "多人音视频";
    let roomID = "web_" + Date.now();
    var url = '../room/room?type=create&roomName=' + roomName + '&userName=' + userName + '&roomID=' + roomID+ '&consultantName=' + consultantName;
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
    app.getToken(function (tonken) {
      //更新数据
      console.log(tonken,'tonken')
      var time = util.formatTime(new Date())
      console.log(time,'time')
      wx.request({
        header:{
          auth_token: tonken
        },
        // url: util.url(),
        url: util.url() ,
        method:'POST',
        data: util.reformParam(util.adviserList,{ houseid: app.globalData.houseid, time: time,pageNo:'1',pageSize:'100' }),
        success:function(res){
          // console.log(res,'列表返回')
          // that.adviserList = res.data.pageModel.resultSet;
          that.setData({
            adviserList: res.data.pageModel.resultSet
          })
          // console.log(that,that.adviserList)
          // that.$apply();
        }
      })
    });
    
  },

})