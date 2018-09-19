/**
 * 获取登录信息
 */
var rtcroom = require('./utils/rtcroom.js');
var liveroom = require('./utils/liveroom.js');
var config = require('./config.js');
var util = require('./utils/util.js');
var app = getApp();

// 获取微信登录信息，用于获取openid
function getLoginInfo(options) {
  // var that = this;
  // app.globalData.userInfo
  if(!app.globalData.userInfo){
    app.globalData.userInfo = wx.getStorageSync('userInfo');
  }
  options.userName = app.globalData.userInfo.nickName;
  options.gender = app.globalData.userInfo.gender;
  options.userAvatar = app.globalData.userInfo.avatarUrl;
  options.code= app.globalData.code;
  options.openId= app.globalData.openid;
  proto_getLoginInfo(options);
  // app.getUserInfo(function (userInfo) {
  //     //更新数据
  //     console.debug(userInfo);
  //     // that.setData({
  //     //   userInfo: userInfo
  //     // })
  //     options.userName = userInfo.nickName;
  //     options.gender = userInfo.gender;
  //     options.userAvatar = userInfo.avatarUrl;
  //     options.code= app.globalData.code;
  //     options.openId= app.globalData.openid;
  //     // proto_getInfo(options);
  //     proto_getLoginInfo(options);
  // });
  
}
// function mse(msg){
//   if()
// }
// 调用后台获取登录信息接口
function proto_getLoginInfo(options) {
      console.log('获取IM登录信息成功');

      var data={};
      data.userSig = app.globalData.userSig;
      data.userID = app.globalData.identifier;
      data.loginid = app.globalData.loginid;
      data.userSplitID = app.globalData.single.id;
      data.sdkAppID = config.sdkAppID;
      data.accType = config.accType;
      data.serverDomain = config.roomServiceUrl + '/weapp/' + options.type + '/';
      data.userName = options.name;
      // data.userName = options.userName;
      // data.userAvatar = options.userAvatar;
      data.userAvatar = options.head;
      // data.gender = options.gender;
      data.gender = options.sex;
      data.selToID = options.opt.id + "_" + config.houseId; // 单独聊天的对方ID，看房小助手（视频顾问）的id
      // data.selToID = options.opt.id + "_" + options.opt.mobile + "_109"; // 单独聊天的对方ID
      data.opt = options.opt; // 
      switch (options.type) {
        case 'multi_room': {
          rtcroom.login({
            data: data,
            success: options.success,
            fail: options.fail
          });
          break;
        }
        case 'double_room': {
          rtcroom.login({
            data: data,
            success: options.success,
            fail: options.fail
          });
          break;
        }
        case 'live_room': {
          liveroom.login({
            data: ret.data,
            success: options.success,
            fail: options.fail
          });
          break;
        }
      }
}
function authorizeInfo(cb,failcb){
    var that = this;
    app.globalData.userInfo = wx.getStorageSync('userInfo');
    // 获得用户信息
    wx.getSetting({
      success: (response) => {
        console.log("getSetting",response)
        // typeof cb == "function" && cb()
        // 没有授权需要弹框
          console.log(response.authSetting['scope.userInfo'],1324657894313213213)
          console.log(app.globalData.userInfo,1324657894313213213)

          if ((!response.authSetting['scope.userInfo'])&&(!app.globalData.isUserInfo)) {
            app.globalData.isUserInfo=true;
          that.setData({
            showInfoModel: true,
            infoFun:cb,
            infoFailFun:failcb||null
          })
        }
        else{ 
          // 判断用户已经授权。不需要弹框
          that.setData({
            showInfoModel: false
          })
          typeof cb == "function" && cb()
        }
      },
      fail: function () {
        wx.showToast({
          title: '系统提示:网络错误',
          icon: 'warn',
          duration: 1500,
        })
      }
    })
}

function getUserInfo(e){
    var self =this;
        wx.setStorageSync('ISauthorizeInfo',true);// 是否授权过用户基本信息,
        console.log(e.detail,'***getUserInfo***');
        this.setData({
            showInfoModel: false
        })
        if (e.detail.errMsg.includes("fail")){
            app.globalData.globalUserInfoFlag = true;
            typeof self.data.infoFailFun == "function" && self.data.infoFailFun();
        }
        else{
            wx.request({
                url:util.newUrl()+'elab-marketing-authentication/customer/modify',
                method:'POST',
                header:{
                    token: app.globalData.tonken
                },
                data:{houseId:config.houseId,
                    id:app.globalData.single.id,
                    headPortrait:e.detail.userInfo.avatarUrl,
                    nickname:e.detail.userInfo.nickName
                },
                success:function(res){
                  console.log(res,'提交用户信息成功')
                }
            })
          app.globalData.userInfo=e.detail.userInfo;
            app.globalData.globalUserInfoFlag = true;
          wx.setStorageSync('userInfo', e.detail.userInfo);
          typeof self.data.infoFun == "function" && self.data.infoFun(); // 执行回调函数
        }
}
module.exports = {
  getLoginInfo: getLoginInfo,
  getUserInfo: getUserInfo,
  authorizeInfo: authorizeInfo
};