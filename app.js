// var rtcroom = require('./utils/rtcroom.js');
// var liveroom = require('./utils/liveroom.js');
var config = require('./config.js');
var util = require('./utils/util.js')

//app.js
App({
  onLaunch: function (options) {
    var self=this;
    // 获取转发者的appid
    if(options.referrerInfo){
      this.globalData.shareAppId = options.referrerInfo.appId
    }
    if (options.shareTickets) {
      // 获取转发详细信息
      wx.getShareInfo({
        shareTicket: options.shareTickets[0],
        success:function(res) {
          res.errMsg; // 错误信息
          res.encryptedData;  //  解密后为一个 JSON 结构（openGId    群对当前小程序的唯一 ID）
          res.iv; // 加密算法的初始向量
        },
        fail() {},
        complete() {}
      });
    }
    wx.getSystemInfo({
        success(res){
          console.log(res)
          self.systemInfo=res;
        }
      })
      wx.request({
          url: config.newUrl+'elab-marketing-authentication/ipAddr/getIpAddr',
          method:'post',
          success:function(e){
              // console.log(e.data.single);
              self.globalData.ip = e.data.single;
          },
          fail:function(err){
              console.log('获取ip失败')
          }
      })
    // console.log("***shareTicket***",options.shareTickets);
    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
      // this.login(function(obj){
      //     var param={
      //         "nickname":self.globalData.userInfo?self.globalData.userInfo.nickName:"",
      //         "mobile":"",
      //         "source":"3",
      //         "customerHead":self.globalData.userInfo?self.globalData.userInfo.avatarUrl:"",
      //         "module":options.shareToken||"小程序",
      //         "houseid":self.globalData.houseid,
      //         "appVersion":"1.0",
      //         "openId":self.globalData.openid,
      //         "code":obj.code||"",
      //         "appId":obj.appid||"",
      //         "secret":obj.secret||"",
      //     }
      //     console.log(param,'param')
      //     wx.request({
      //         url: util.url(),
      //         method: 'POST',
      //         data: util.reformParam(util.mineLogin, param),
      //         header: {
      //             'content-type': 'application/json' // 默认值
      //         },
      //         success:function(res){
      //             console.log("***app.login***",res);
      //             if(res.data.success){
      //                 if(res.data.single){ // 获取信息成功
      //                     var data = res.data.single;
      //                     self.globalData.qrpictureurl = data.qrpictureurl;
      //                     self.globalData.tonken = data.tonken;
      //                     self.globalData.single = data;
      //                     self.globalData.loginid = data.loginid;
      //                     self.globalData.sessionKey=data.sessionKey;
      //                     self.globalData.openid = data.openId||"";
      //                     self.globalData.phone = wx.getStorageSync('phone');
      //                     self.globalData.identifier = data.id+"_"+data.loginid+"_"+data.houseid;

      //                     self.proto_getLoginInfo(self);
      //                 }
      //                 else{
      //                     wx.showToast({
      //                         title: "数据不存在,请稍后再试",
      //                         icon: 'warn',
      //                         duration: 1500,
      //                     })
      //                 }
      //             }
      //             else{
      //                 wx.showToast({
      //                     title: res.data.message,
      //                     icon: 'warn',
      //                     duration: 1500,
      //                 })
      //             }
      //         },
      //         fail: function (ret) {
      //             console.log('获取信息失败: ', ret);
      //             if (ret.errMsg == 'request:fail timeout') {
      //                 wx.showToast({
      //                     title: "网络请求超时，请检查网络状态",
      //                     icon: 'warn',
      //                     duration: 1500,
      //                 })
      //             }
      //             else{
      //                 wx.showToast({
      //                     title: ret.errMsg,
      //                     icon: 'warn',
      //                     duration: 1500,
      //                 })
      //             }
      //         }
      //     });
      // })
  },
    onHide:function(e){
        var para={
            clkId:'clk_2cmina_2',
            clkDesPage:'',//点击前往的页面名称
            clkName:'close',//点击前往的页面名称
            type:'CLK',//埋点类型e
            pvCurPageName:getCurrentPages()[getCurrentPages().length-1].data.despage||'',//当前页面
            pvCurPageParams:'',//当前页面参数
        }
        util.trackRequest(para,this)
    },
  // proto_getLoginInfo: function (app) {
  //   wx.request({
  //     url: util.url(),
  //     method: 'POST',
  //     data: util.reformParam(util.tencentSignature, { identifier: this.globalData.identifier, appId: '1400091043' }),
  //     header: {
  //       'content-type': 'application/json' // 默认值
  //     },
  //     success: function (ret) {
  //       if (ret.data.code) {
  //         console.log('获取登录信息失败，调试期间请点击右上角三个点按钮，选择打开调试');
  //         wx.showToast({
  //           title: ret.data.message + '[' + ret.data.code + ']',
  //           icon: 'warn',
  //           duration: 1500,
  //         })
  //         return;
  //       }
  //       console.log('获取usersig登录信息成功',app,ret.data.single.signature);
  //       app.globalData.userSig = ret.data.single.signature;
  //     },
  //     fail: function (ret) {
  //         console.log('获取IM信息失败: ', ret);
  //         if (ret.errMsg == 'request:fail timeout') {
  //           wx.showToast({
  //             title: "网络请求超时，请检查网络状态",
  //             icon: 'warn',
  //             duration: 1500,
  //           })
  //         }
  //         else{
  //           wx.showToast({
  //             title: ret.errMsg,
  //             icon: 'warn',
  //             duration: 1500,
  //           })
  //         }
  //     }
  //   });
  // },
  getToken: function (cb) {
    var that = this;
    // console.log("getToken:",this.globalData)
    if(this.globalData.tonken){
      typeof cb == "function" && cb(this.globalData.tonken)
    } else {
      var data = util.reformParam(util.tokenUrl,{
          "nickname":"",
          "mobile":"",
          "verifycode":"",
          "invitation_code":"",
          "password":"",
          "source":"3",
          "new_guested":"1",
          "module":"",
          "houseid":"109",
          "anonymous":"1",
          "appVersion":"150"
      });
      wx.request({
        url: util.url(),
        // url: "http://139.196.5.59:9005/skyforest/dynatown/list",
        method:'POST',
        data: data,
        success:function(res){
          console.log(res,'app.js *** getToken')
          that.globalData.tonken = res.data.single.tonken;
          typeof cb == "function" && cb(that.globalData.tonken)
        }
      })
    }
  },
  getUserInfo:function(cb){
    var that = this;
    //取出本地存储用户信息，解决需要每次进入小程序弹框获取用户信息
    that.globalData.userInfo = wx.getStorageSync('userInfo');
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      // wx.login({
      //   success: function (res) {
      //     debugger
      //     if(res.code){
      //       var secret = that.globalData.secret;//"4c75d6c6ace1e8d6aa747113ee2125c8";
      //       var code = res.code;
      //       that.globalData.code =res.code;
      //       var appid = that.globalData.appid;//"wxa6aef323462b8b14";
      //       wx.request({
      //         url:'https://api.weixin.qq.com/sns/jscode2session?appid='+appid+'&secret='+secret+'&js_code='+code+'&grant_type=authorization_code',
      //         data:{code:res.code},
      //         success:function(res){
      //           console.log(res)
      //          that.globalData.openid = res.data.openid;
      //          that.globalData.sessionKey = res.data.session_key;
      //         }
      //       })
      //     }
      //   }
      // })
    }
  },
    event:function(res){
      console.log('app.js执行event')
      if(this.gloabalFun.a){
          typeof this.gloabalFun.a === 'function' && this.gloabalFun.a(res)
      }
},
  login:function(cb){
      var that = this;
      var app = this;
      //取出本地存储用户信息，解决需要每次进入小程序弹框获取用户信息
      that.globalData.userInfo = wx.getStorageSync('userInfo');
      //调用登录接口
      if(!app.globalData.single){wx.login({
          success: function (res) {
              if(res.code){
                  var secret = that.globalData.secret;//"bda6d7952104872c35239fb6ce751ce1";
                  var code = res.code;
                  that.globalData.code =res.code;
                  var appid = that.globalData.appid;//"wx393fa65352d1b735";
                  var obj={
                      code:code,
                      appid:appid,
                      secret:secret,
                  }
                  console.log("=========login-code======",obj)
                  var param = {
                      "nickname": app.globalData.userInfo ? app.globalData.userInfo.nickName: "",
                      "mobile": "",
                      "source": "3",
                      // 小程序
                      "customerHead": app.globalData.userInfo ? app.globalData.userInfo.avatarUrl: "",
                      "registChannel": app.globalData.fromChannel || "",
                      "houseId": config.houseId,
                      "appVersion": "1.0",
                      // "openId":app.globalData.openid||"",
                      "code": obj.code || "",
                      "appId": obj.appid || "",
                      "secret": obj.secret || "",
                  }
                  console.log(param, 'param');
                  wx.request({
                      url: util.newUrl()+'elab-marketing-authentication/customer/miniapp/login',
                      method: 'POST',
                      data: param,
                      header: {
                          'content-type': 'application/json' // 默认值
                      },
                      success: function(res) {
                          console.log("***app.login***", res);
                          if (res.data.success) {
                              if (res.data.single) { // 获取信息成功
                                  var data = res.data.single;
                                  app.globalData.qrpictureurl = data.qrpictureurl;
                                  app.globalData.tonken = data.token;
                                  app.globalData.single = data;
                                  app.globalData.loginid = data.loginNo;
                                  app.globalData.sessionKey = data.sessionKey;
                                  app.globalData.openid = data.openId || "";
                                  app.globalData.phone = wx.getStorageSync('phone');
                                  app.globalData.identifier = data.id + "_"  + data.houseId;
                                  console.log(app.globalData)
                                  // wx.setStorageSync('globalData', app.globalData);
                                  typeof cb == "function" && cb()
                                  app.proto_getLoginInfo(app);
                                  wx.request({
                                      url:util.newUrl()+'elab-marketing-authentication/share/sign',
                                      method:'POST',
                                      data:{customerId:app.globalData.single.id,houseId:config.houseId,userRole:0},
                                      success:function(res){
                                          app.globalData.shareToken = res.data.single||"";
                                      }
                                  })
                              } else {
                                  wx.showToast({
                                      title: "数据不存在,请稍后再试",
                                      icon: 'warn',
                                      duration: 1500,
                                  })
                              }
                          } else {
                              wx.showToast({
                                  title: res.data.message,
                                  icon: 'warn',
                                  duration: 1500,
                              })
                          }
                      },
                      fail: function(ret) {
                          console.log('获取信息失败: ', ret);
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

              }
          }
      })}else{
          console.log("******app.login2-app.globalData.single***",app.globalData.single)
          typeof cb == "function" && cb()
      }

  },
     proto_getLoginInfo(app) {
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
  systemInfo:{},
    gloabalFun:{
      a:null,
    },
  globalData:{
    appid:"wx5e18485e35c5f1f6",
    secret:"6ac2abb378f4d5a5d16b7c6ba2850807",  // 新版测试小程序 bda6d7952104872c35239fb6ce751ce1
    shareToken:null,
    videoCustomer:null, // 看房小助手信息
    openid:null,
    sessionKey:null,
    shareAppId:null,
    tonken:null,
    houseid:config.houseId,
    code:null,
    currDespage:null,//记录当前跳转至webview的埋点名称
    ip:'',
    fromChannel:'',
    qrpictureurl:null,
    identifier:null,
    single:null,  //当前登录用户的用户信息
    tmpPhone:false,
    globalUserInfoFlag:false,
    phone:null,
    userSig:null,
    like:null,
    isShowVideoButton:false,
    view:null,
    parm:null,
    loginid:null,
    userInfo:null,
    sessionTime:new Date().getTime(),
    isPhone:false,//是否手机授权过
    isUserInfo:false,//是否身份授权过
    houseTypeDetail:null,
    endTime:'',
    dataJson:"",  //视频通话监控日志记录字段
    pullLog:"",  //视频通话监控日志-拉流日志
    pushLog:"",  //视频通话监控日志-推流日志
  }
})