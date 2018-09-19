  var util = require('../../utils/util.js')
var webim = require('../../utils/webim_wx.js');
var config = require('../../config.js');
var webimhandler = require('../../utils/webim_handler.js');
var tls = require('../../utils/tls.js');
var app = getApp();
var onloadTime = null;
var serverUrl="http://skyforest.static.elab-plus.com/";
var timeout =null;
// var serverUrl = '../../image/'
var Config = {
  sdkappid: config.sdkAppID
  , accountType: config.accType
  , accountMode: 0 //帐号模式，0-表示独立模式，1-表示托管模式
};
tls.init({
  sdkappid: Config.sdkappid
})
Page({
  onShow:function(){
      wx.setStorageSync('loadTime',new Date().getTime())
      wx.setNavigationBarTitle({
          title: '在线咨询'
      });
      let param = {
          type:'PV',
          pvId:'P_2cMINA_5',
          pvCurPageName:'liaotianchuangkou',//当前页面名称
          pvCurPageParams:'',//当前页面参数
          adviserId:this.data.adviserInfo.id,
          imTalkId:this.data.adviserInfo.id+'_'+app.globalData.single.id+'_'+config.houseId,
          imTalkType:'1',
          pvLastPageName:getCurrentPages()[getCurrentPages().length-2]?getCurrentPages()[getCurrentPages().length-2].data.despageForChat:'',//上一页页面名称
          pvLastPageParams:'',//上一页页面参数
          pvPageLoadTime:(new Date().getTime() - wx.getStorageSync('loadTime')),//加载时间
      }
      console.log(param,'埋点')
      util.trackRequest(param,app)
  },
  onUnload:function(){
        util.stopTrackEventTimeObj();
        clearInterval(timeout)
        console.log(timeout,'aaaaaaaaaa')
        if(this.data.videoFlag){
          // webim.logout(function(resp){
          //   console.log('已经退出');
          // })
        }
       
    },
  // 此处开始是拷贝内容
  clearInput: function () {
    this.setData({
      currentMessage: ""
    })
  },
    data: {
        serverUrl:serverUrl,
        tempMessages:[],
        loading:false,//获取消息中
        putMess:false,
        loadMsgFlag:false,
        messageNone:false,//是否已经没有历史消息可拉取
        lastMsgTime:0,
        msgKey:'',
        videoImg:`${serverUrl}im/videoImg.jpg`,
        isBusy:false,
        getFirstMsg:false,
        isFirstSend:true,
        showvideo:false,
        videoFlag:true,
        videoStatus:null,
        timeUse:null,
        adviserWx:'',
        tryAgainFlag:false,
        despage:'liaotianchuangkou',
        adviserPhone:'',
        toView:'',
        isGiveTel:false,
        pdfImg:`${serverUrl}im/pdf.png`,
        loadingImg:'../../image/wepy_pro/loading.gif',
        scrollTop:200,
        currentMessage: '',
        userInfo: {},
        imgUrl:'',
        adviserId:'',
        adviserName:'',
        backButton:`${serverUrl}im/back-button.png`,
        busyButton:`${serverUrl}im/online.png`,
        dialog:false,
        localMessages: [],
        Identifier: null,
        UserSig: null
    },
  bindConfirm: function (e) {
    var that = this;
    var content = this.data.currentMessage;
    if (!content.replace(/^\s*|\s*$/g, '')) return;
    webimhandler.onSendMsg(content,{TYPE:webim.SESSION_TYPE.C2C,myselToID:that.data.adviserId},app.globalData.identifier, function (msg) {
      that.receiveMsgs(msg,true)
      that.clearInput();
    })
  },
    goBack:function(){

    },
    deny:function(){
        var that = this;
        let data = {
            "csyzwfelab20180425hhhdfq":"secretkey",
            "type":505,
            "typedesc":"获取手机号码"
        };
        webimhandler.sendCustomMsg({text:'[用户已拒绝]',ext:JSON.stringify(data),data:''},{TYPE:webim.SESSION_TYPE.C2C,myselToID:that.data.adviserId},app.globalData.identifier,function (msg) {
        });
        wx.setStorageSync('isGiveTel',true)
        that.setData({
            isGiveTel:true
        });
      wx.showToast({
          title:'您已拒绝该请求'
      })
    },
    admit:function(){
        var that = this;
        if(!app.globalData.phone){

        }
        wx.request({
            url:util.newUrl()+'elab-marketing-authentication/adviser/text/bindCustomer',
            method:'POST',
            data:{
                houseId:config.houseId,
                customerId:app.globalData.single.id,
            // customerMobile:wx.getStorageSync('phone')||app.globalData.phone||'',
                adviserId:that.data.adviserInfo.id,
                shareParam:app.globalData.fromChannel
            },
            success:function (res) {
                wx.setStorageSync('isGiveTel',true)
                that.setData({
                    isGiveTel:true
                });
                if(res.data.success){
                    wx.showToast({
                        title:'您已同意！',
                        icon:'success',
                        duration:2000,
                    })
                    let data = {
                        "csyzwfelab20180425hhhdfq":"secretkey",
                        "type":503,
                        "typedesc":"获取手机号码"
                    };
                    webimhandler.sendCustomMsg({text:'[用户已同意]',ext:JSON.stringify(data),data:''},{TYPE:webim.SESSION_TYPE.C2C,myselToID:that.data.adviserId},app.globalData.identifier,function (msg) {
                    });
                }else{
                    if(res.data.errorCode=='CUSTOMER.HAS.BIND.ERROR'){
                        wx.showToast({
                            title:'您已被绑定',
                            icon:'success',
                        })
                    }else{
                    }
                    webimhandler.onSendMsg('客户已被其他顾问绑定',{TYPE:webim.SESSION_TYPE.C2C,myselToID:that.data.adviserId},app.globalData.identifier,function (msg) {
                    });
                }
            }
        })
    },
    previewImage: function (e) {
        var current = e.target.dataset.src;
        if(current){
            wx.previewImage({
                current: current, // 当前显示图片的http链接
                urls: [e.target.dataset.src] // 需要预览的图片http链接列表
            })
        }

    } ,
    tryAgain:function(e){
      var that =this;
      if(that.data.tryAgainFlag){
          return
      }
      that.data.tryAgainFlag=true;
      // this.setData({
      //     tryAgainFlag:true
      // })
        webimhandler.onSendMsg(e.currentTarget.dataset.msg,{TYPE:webim.SESSION_TYPE.C2C,myselToID:that.data.adviserId},app.globalData.identifier, function (msg) {
            wx.setStorageSync('isSend'+config.houseId,true);
            that.data.localMessages.splice(e.currentTarget.dataset.index,1);
            that.data.tempMessages.splice(e.currentTarget.dataset.index,1);
            console.log(that.data.localMessages)
            // let tmpMsgList = that.data.localMessages;
            // tmpMsgList.splice(index,1)
            // that.setData({
            //     localMessages:tmpMsgList
            // })
            // that.setData({
            //     tryAgainFlag:false
            // })
            that.data.tryAgainFlag=false;
            that.receiveMsgs(msg,true);
            if(that.data.isBusy){
                that.receiveMsgs({content:'您好，非常抱歉，我正在为其他用户服务，稍后回复您！',type:false},false)
            }
        },function(msg){
            // that.setData({
            //     tryAgainFlag:false
            // })
            that.data.tryAgainFlag=false;
            that.receiveMsgs(msg,true,true);

        })
    },
  receiveMsgs: function (data,isLocal,failed) {

    data.local = isLocal;
    data.time = util.formatTodayTime(new Date());
    var msgs = this.data.localMessages || [];
    var tmpMsgs = this.data.tempMessages;
      if(failed){
          data.failed = true;
      }
      tmpMsgs.push(data)
    msgs.push(data);
    this.setData({
        tempMessages:tmpMsgs,
        localMessages: msgs
    })
    console.log(this.data.localMessages,'hhhh')
      this.setData({toView:'hei'})
  },
    goVideo:function(){
        let param = {
            type:'CLK',//埋点类型
            pvPageStayTime:(new Date().getTime()-wx.getStorageSync('loadTime'))/1000,
            clkDesPage:'ekanfangjietongye',//点击前往的页面名称
            clkName:'shipin_guwentuisong',//点击前往的页面名称
            clkId:'clk_2cmina_40',//点击ID
            clkParams:'',//点击参数
        }
        util.trackRequest(param,app)
        wx.getSetting({
            success: (response) => {
                console.log("***chat.onLoad***getSetting",response)
                // 没有授权
                if (!response.authSetting['scope.record']){
                    wx.authorize({
                        scope: 'scope.record',
                        complete() {
                            if(!response.authSetting['scope.camera']){
                                wx.authorize({
                                    scope: 'scope.camera',
                                    complete() {
                                        wx.redirectTo({
                                            url:'../multiroom/aide/aide?isSuc=1'
                                        })
                                    }
                                })
                            }else{
                                wx.redirectTo({
                                    url:'../multiroom/aide/aide?isSuc=1'
                                })
                            }
                        }
                    })
                }
                else{
                    if(!response.authSetting['scope.camera']){
                        wx.authorize({
                            scope: 'scope.camera',
                            complete() {
                                wx.redirectTo({
                                    url:'../multiroom/aide/aide?isSuc=1'
                                })
                            }
                        })
                    }else{
                        wx.redirectTo({
                            url:'../multiroom/aide/aide?isSuc=1'
                        })
                    }

                }
            },
            fail: function () {
                // typeof cb == "function" && cb()
                wx.showToast({
                    title: '系统提示:网络错误',
                    icon: 'warn',
                    duration: 1500,
                })
            }
        })

    },
  initIM: function (userInfo,res) {
    var that = this;
    var avChatRoomId = '@TGS#1Q3DQEEFH';
    webimhandler.init({
      accountMode: Config.accountMode
      , accountType: Config.accountType
      , sdkAppID: Config.sdkappid
      , avChatRoomId: avChatRoomId //默认房间群ID，群类型必须是直播聊天室（AVChatRoom），这个为官方测试ID(托管模式)
      , selType: webim.SESSION_TYPE.C2C
      , selToID: that.data.adviserId
      , selSess: null //当前聊天会话
    });

    //当前用户身份
    var loginInfo = {
      'sdkAppID': Config.sdkappid, //用户所属应用id,必填
      'appIDAt3rd': Config.sdkappid, //用户所属应用id，必填
      'accountType': Config.accountType, //用户所属应用帐号类型，必填
      'identifier': app.globalData.identifier, //当前用户ID,必须是否字符串类型，选填
      'identifierNick': app.globalData.single.nickname||'小程序用户', //当前用户昵称，选填
      'userSig': app.globalData.userSig, //当前用户身份凭证，必须是字符串类型，选填
    };
    //监听（多终端同步）群系统消息方法，方法都定义在demo_group_notice.js文件中
    var onGroupSystemNotifys = {
      "5": webimhandler.onDestoryGroupNotify, //群被解散(全员接收)
      "11": webimhandler.onRevokeGroupNotify, //群已被回收(全员接收)
      "255": webimhandler.onCustomGroupNotify//用户自定义通知(默认全员接收)
    };

    //监听连接状态回调变化事件
    var onConnNotify = function (resp) {
      switch (resp.ErrorCode) {
        case webim.CONNECTION_STATUS.ON:
          //webim.Log.warn('连接状态正常...');
          break;
        case webim.CONNECTION_STATUS.OFF:
          webim.Log.warn('连接已断开，无法收到新消息，请检查下你的网络是否正常');
          break;
        default:
          webim.Log.error('未知连接状态,status=' + resp.ErrorCode);
          break;
      }
    };
    //监听事件
    var listeners = {
      "onConnNotify": webimhandler.onConnNotify, //选填
      "onBigGroupMsgNotify": function (msg) {
        webimhandler.onBigGroupMsgNotify(msg, function (msgs) {
          that.receiveMsgs(msgs);
        })
      }, //监听新消息(大群)事件，必填
      "onMsgNotify": function (msg) {
          webimhandler.onMsgNotify(msg, function (msgs) {
              wx.setStorageSync('isSend'+config.houseId,true);
              if(!that.data.getFirstMsg){
                  that.setData({
                      getFirstMsg:true
                  })
              }
              var msg = '【系统消息】该用户当前登录方式为微信小程序登录，无法使用此功能';
              var noAuth = '【系统消息】当前用户未授权手机号，暂时无法获取。请通过聊天方式索取客户手机号码！';
              if(msgs.content&&msgs.content.type==102||msgs.content.type==512){
                  webimhandler.onSendMsg(msg,{TYPE:webim.SESSION_TYPE.C2C,myselToID:msgs.fromAccountNick});
              }else if(msgs.content&&msgs.content.type==502){
                  console.log(msgs)
                  if(!(msgs.content.param.isShowInvitation)){
                      console.log('150723')
                      return
                  }
                  if(msgs.fromAccountNick==that.data.adviserId&&wx.getStorageSync('phone')){
                      wx.setStorageSync('isGiveTel',false)
                      that.setData({
                          isGiveTel:false
                      });
                      msgs.content.isover = false
                      that.receiveMsgs(msgs,false);

                  }else{
                      webimhandler.onSendMsg(noAuth,{TYPE:webim.SESSION_TYPE.C2C,myselToID:msgs.fromAccountNick});
                      return
                  }
              }else if(msgs.content&&msgs.content.type==513||msgs.content.type==504){
                  return
              }
              else if(msgs.content&&(typeof msgs.content=='string')&&msgs.content.includes('onChangePlayAudio')){
                  webimhandler.onSendMsg(msg,{TYPE:webim.SESSION_TYPE.C2C,myselToID:msgs.fromAccountNick});
              }
              else{
                  if(msgs.fromAccountNick==that.data.adviserId){
                      that.receiveMsgs(msgs,false);
                  }
              }
          })
        // app.event(msg)
      },//监听新消息(私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息)事件，必填
      "onGroupSystemNotifys": webimhandler.onGroupSystemNotifys, //监听（多终端同步）群系统消息事件，必填
      "onGroupInfoChangeNotify": webimhandler.onGroupInfoChangeNotify//监听群资料变化事件，选填
    };

    //其他对象，选填
    var options = {
      'isAccessFormalEnv': true,//是否访问正式环境，默认访问正式，选填
      'isLogOn': false//是否开启控制台打印日志,默认开启，选填
    };

    if (Config.accountMode == 1) {//托管模式
      webimhandler.sdkLogin(loginInfo, listeners, options, function () {
        that.addFriend()
      });
    } else {//独立模式
      //sdk登录
      webimhandler.sdkLogin(loginInfo, listeners, options,function(){
          console.log('登陆Im所需要的时间',new Date().getTime() - onloadTime)
              that.loadMessage();
              // that.setData({
              //     putMess:true
              // })
              // that.setData({
              //     loadMsgFlag:true
              // })

          // else{
          //     that.setData({
          //         localMessages:[]
          //     })
          //     console.log('此时msg全清空',that.data.putMess)
          //     that.setData({
          //         messageNone:true
          //     })
          //     that.setData({
          //         lastMsgTime:0
          //     })
          //     that.setData({
          //         msgKey:''
          //     })
          //     that.loadMessage();
          // }



      });
    }
  },
    scrollTop:function(){
      if(this.data.messageNone&&this.data.putMess){
          this.setData({
              putMess:false
          })
          this.loadMessage()
      }
    },
  loadMessage:function(){
      console.log('开始获取历史消息',new Date() - onloadTime)
    var that = this;
      this.setData({
          loading:true
      })
      setTimeout(()=>{
          this.setData({
              loading:false
          })
      },2000)
        webimhandler.getC2CHistoryMsgs(function(data,last,scroll){
            console.log(new Date().getTime()-onloadTime,'渲染数据时间',data.elems[0].content)
            if(last){
                that.setData({
                    localMessages:that.data.tempMessages
                })
                if(scroll){
                    that.setData({toView:'hei'})
                }
            }
            console.log(that.data.localMessages,that.data.tempMessages)
            if(data.elems[0].content.ext){
                var tempObj = JSON.parse(data.elems[0].content.ext);
                if(tempObj.type==513||tempObj.type==504||tempObj.type==512||tempObj.type==505||tempObj.type==503||tempObj.type==501||tempObj.type==500){
                    return
                }
                data.elems[0].content = tempObj;
                if(data.elems[0].content.type==515||data.elems[0].content.type==516){
                    data.elems[0].local = false
                }else{
                    data.elems[0].local = true
                }
                data.elems[0].time =util.formatTodayTime(new Date(data.time*1000));
                var tempMessages = that.data.tempMessages;
                tempMessages.unshift(data.elems[0])
                that.setData({
                    tempMessages:tempMessages
                })
                if(last){
                    that.setData({
                        localMessages:that.data.tempMessages
                    })
                    if(scroll){
                        that.setData({toView:'hei'})
                    }

                }
                return
            }
            if(data.elems[0].type&&data.elems[0].type=='TIMSoundElem'){
                return
            }
            if(data.elems[0].content.text.includes('【系统消息】')||data.elems[0].content.text.includes('顾问不存在')){
                return
            }
            if(data.elems[0].content.text.indexOf('该手机号码已被其他顾问绑定')>-1){
                return
            }
            if(data.elems[0].content.text.indexOf('csyzwfelab20180425hhhdfq')>-1){
                var tempObj = JSON.parse(data.elems[0].content.text);
                if(tempObj.type==513||tempObj.type==504||tempObj.type==512||tempObj.type==505||tempObj.type==503||tempObj.type==501||tempObj.type==500){
                    return
                }
                if(tempObj.type==502&&!wx.getStorageSync('phone')){
                   return
                }
                data.elems[0].content = tempObj;
                if(data.elems[0].content.type==515||data.elems[0].content.type==516){
                    data.elems[0].local = false
                    data.elems[0].time =util.formatTodayTime(new Date(data.time*1000));
                    var tempMessages = that.data.tempMessages;
                    tempMessages.unshift(data.elems[0]);

                    that.setData({
                        tempMessages:tempMessages
                    })
                    if(last){
                        that.setData({
                            localMessages:that.data.tempMessages
                        })
                        if(scroll){
                            that.setData({toView:'hei'})
                        }
                    }
                    return
                }
            }else{
                data.elems[0].content = data.elems[0].content.text;
            }
            if(data.fromAccount==app.globalData.identifier){
                data.elems[0].local = true
            }else{
                data.elems[0].local = false;
            }
            data.elems[0].time =util.formatTodayTime(new Date(data.time*1000));
            // console.log(data.elems[0],'开心2')
            var tempMessages = that.data.tempMessages;
            tempMessages.unshift(data.elems[0]);
            that.setData({
                tempMessages:tempMessages
            })
            if(last){
                that.setData({
                    localMessages:that.data.tempMessages
                })
                if(scroll){
                    that.setData({toView:'hei'})
                }
            }
        },that.data.msgKey,that.data.lastMsgTime,function(msgKey,lastMsgTime){
          that.setData({loading:false})
          that.setData({msgKey:msgKey})
          that.setData({lastMsgTime:lastMsgTime})
          that.setData({putMess:true})
          that.setData({messageNone:true})
        },function(){
            that.setData({loading:false})
            that.setData({messageNone:false})
        },function(val){

              if(val==1){
                  if(that.data.videoStatus==1){
                      let parm = {
                          timeUse: that.data.timeUse,
                      }
                      let data = {
                          "csyzwfelab20180425hhhdfq":"secretkey",
                          "param":parm,
                          "type":500,
                          "typedesc":"视频通讯成功"
                      };
                      webimhandler.sendCustomMsg({text:'视频通讯成功',ext:JSON.stringify(data),data:''},{TYPE:webim.SESSION_TYPE.C2C,myselToID:that.data.adviserId},app.globalData.identifier)
                  }
                  if(that.data.videoStatus==2){
                      let data = {
                          "csyzwfelab20180425hhhdfq":"secretkey",
                          "type":501,
                          "typedesc":"视频通讯失败"
                      };
                      webimhandler.sendCustomMsg({text:'视频通讯失败',ext:JSON.stringify(data),data:''},{TYPE:webim.SESSION_TYPE.C2C,myselToID:that.data.adviserId},app.globalData.identifier)
                  }
                  setTimeout(()=>{
                  // wx.request({
                  //     url:util.url(),
                  //     method:'POST',
                  //     data: util.reformParam(util.getCustomerNick, { houseid:app.globalData.houseid,
                  //         dynatownId:that.data.adviserInfo.id,
                  //         customerId:app.globalData.identifier.substring(0,app.globalData.identifier.indexOf('_'))
                  //     }),
                  // })
                  //
                  // let result =await imService.getNickname({houseid:app.globalData.houseid,dynatownId:that.adviserInfo.id,customerId:that.localCustomerId.substring(0,that.localCustomerId.indexOf('_'))})
                  // let nickname = result.data.single.customerName||that.userInfo.nickName||'web用户';
                  let text='您好，我是您的专属置业顾问，请问有什么可以帮您的吗？'
                  let data = {
                      "csyzwfelab20180425hhhdfq":"secretkey",
                      "param":{text:text},
                      "type":515,
                      "typedesc":"您好，我是您的专属置业顾问，请问有什么可以帮您的吗？"
                  };
                      // that.setData({toView:'hei'})
                      let duringTime = new Date().getTime() - wx.getStorageSync('needRepeatTo'+that.data.adviserId)
                      if(duringTime/1000/60/60>23){
                          // webimhandler.onSendMsg(JSON.stringify(data),{TYPE:webim.SESSION_TYPE.C2C,myselToID:that.data.adviserId},app.globalData.identifier,function (msg) {
                          //     console.log(msg,'chenggong')
                          //     that.receiveMsgs({content:text,type:false},false);
                          //     wx.setStorageSync('needRepeatTo'+that.data.adviserId,new Date().getTime())
                          // });

                          webimhandler.sendCustomMsg({text:'您好，我是您的专属置业顾问，请问有什么可以帮您的吗？',ext:JSON.stringify(data),data:''},{TYPE:webim.SESSION_TYPE.C2C,myselToID:that.data.adviserId},app.globalData.identifier,function(msg){
                                  that.receiveMsgs({content:text,type:false},false);
                                  wx.setStorageSync('needRepeatTo'+that.data.adviserId,new Date().getTime())
                              wx.request({
                                  url:util.newUrl()+'elab-marketing-notify/message/push',
                                  method:'POST',
                                  header:{
                                      token:app.globalData.tonken
                                  },
                                  data:{
                                          houseId:config.houseId,
                                          receiver:that.data.adviserInfo.id,
                                          businessType:1,
                                          workId:app.globalData.single.id,
                                          title:'消息通知顾问',
                                          code:'PUSH_003',
                                          pushContent:'已有客户发起在线咨询，请及时回复',
                                          receiverType:"adviser",},
                                  success:function(res){
                                      console.log(res)
                                  }
                              })
                              wx.request({
                                  url:util.newUrl()+'elab-marketing-authentication/adviser/text/getCustomerDetail',
                                  method:'POST',
                                  data:{
                                      adviserId:that.data.adviserInfo.id,
                                      customerId:app.globalData.single.id,
                                      houseId:config.houseId,
                                  },
                                  success:function (res) {
                                      if(res.data.success){
                                          console.log(res.data,'ffff')
                                          if(res.data.single.nameRemark=='小程序用户'){
                                              res.data.single.nameRemark = false;
                                          }
                                          wx.request({
                                              url:util.newUrl()+'elab-marketing-authentication/vcode/send/chatSms',
                                              method:'POST',
                                              data:{
                                                  param:{name:res.data.single.nameRemark||app.globalData.single.nickname||res.data.single.mobileRemark||app.globalData.phone||'小程序客户'},
                                                  phoneNumber:that.data.adviserInfo.mobile
                                              },
                                              success:function(res){
                                                  console.log(res)
                                              }
                                          })
                                      }

                                  }
                              })

                          })
                      }else{
                          wx.setStorageSync('needRepeatTo'+that.data.adviserId,new Date().getTime())
                      }
              },2000)
              }
                  // that.setData({toView:'hei'})
        },function(err){
            setTimeout(()=>{
                that.loadMessage()
            },1000)
            console.log(err)
        })
    },
    showDialog:function (e) {
        if(e.currentTarget.dataset.url){
            this.setData({
                imgUrl:encodeURI(decodeURI(e.currentTarget.dataset.url))
            })
        }
        if(e.currentTarget.dataset.showvideo){
            this.setData({
                showvideo:e.currentTarget.dataset.showvideo
            })
        }
        this.setData({
            dialog:e.currentTarget.dataset.dialog
        })
    },
    fun:function (msg) {
      var that = this;
      console.log(msg,'fun')
    },
  onLoad: function (params) {
      // app.gloabalFun.a=this.fun;
      onloadTime = new Date().getTime()
      console.log(params,'yuu',onloadTime)
      if(params.videoStatus&&params.videoStatus==1){
          this.setData({
              videoStatus:1
          })
          this.setData({
              timeUse:params.videoTime
          })
      }
      if(params.videoStatus&&params.videoStatus==2){
          this.setData({
              videoStatus:2
          })
      }
      var that = this;
      var adviserInfo = JSON.parse(wx.getStorageSync('adviserInfo'));
      console.log(adviserInfo,'顾问信息')
      that.setData({
          adviserInfo:adviserInfo
      })
      that.setData({
          adviserName:adviserInfo.name||'顾问'
      })
      var adviserId = `${adviserInfo.id}_${adviserInfo.houseId}`;
      // var adviserId = "2758_83";
      if(wx.getStorageSync('isGiveTel')){
          this.setData({
              isGiveTel:true
          })
      }
      this.setData({
          adviserId:adviserId
      })
      wx.request({
          url:util.newUrl()+'elab-marketing-authentication/adviser/text/connect',
          method:'POST',
          data:{adviserId:adviserInfo.id,customerId:app.globalData.single.id,houseId:config.houseId},
          success:function(res){
      }
      })
      wx.request({
          header:{
              token:app.globalData.tonken
          },
          url: util.newUrl()+'elab-marketing-authentication/worker/account/selfInfo',
          method: 'POST',
          data:{
              adviserId:adviserInfo.id
          },
          success: function (res) {
              that.setData({
                  isBusy:res.data.single.onlineStatus||false
              })
              that.setData({
                  adviserWx:res.data.single.wxno||''
              })
              that.setData({
                  adviserPhone:res.data.single.mobile||''
              })
              that.setData({
                  busyButton:that.data.isBusy?`${serverUrl}im/offline.png`:`${serverUrl}im/online.png`
              })
          },
          fail: function (err) {
              console.log(err)
          }
      })
      console.log('开始调用IM接口',new Date() - onloadTime)
      that.initIM();
    //调用应用实例的方法获取全局数据

    // // 将转发者信息保存至global，如果报备，则将改推荐人信息发送至后台
    // console.log('转发来源id是',params)
    // app.globalData.shareAppId = params;
    // console.log(app.globalData.shareAppId,'ghhh')
    // app.getUserInfo((userInfo)=> {
    //   //更新数据
    //   this.setData({
    //     userInfo: userInfo
    //   })
    // })
    // wx.connectSocket({
    //   url: 'wss://example.qq.com',
    //   data: {
    //     message: this.data.currentMessage,
    //   },
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   protocols: ['protocol1'],
    //   method: "GET"
    // });
  },
    goH5:function(e){
        wx.setStorageSync('h5page', e.currentTarget.dataset.url);
        console.log(e.currentTarget.dataset.url,'uuuuu')
        console.log(decodeURI(e.currentTarget.dataset.url))
        console.log(encodeURIComponent(e.currentTarget.dataset.url))
        wx.navigateTo({
            url: '../webView/webView?view='+ encodeURIComponent(e.currentTarget.dataset.url),
            success:function(){
            },
            fail: function(res) {
                // fail
                console.log(res)
            },

        })
    },
    goVideoPage:function(e){
      this.setData({
        videoFlag:false
      })

        wx.navigateTo({
            url: '../video/video?source='+e.currentTarget.dataset.url
        })
    },
    goPDF:function(e){
        wx.downloadFile({  url:  e.currentTarget.dataset.url,
            success: function (res) {
                var filePath = res.tempFilePath
                wx.openDocument({
                    filePath: filePath,
                    success: function (res) {
                        console.log('打开文档成功')
                    }
                })
            }
        })
  },
  bindButtonTap: function(){
      var that = this;
      if(this.data.isFirstSend){
          this.setData({
              isFirstSend:false
          })
          let second = 300
           timeout = setInterval(()=>{
              second--;
              if(this.data.getFirstMsg){
                  clearInterval(timeout)
                  return
              }
              if(second<1){
                  let text = '您好，我现在在忙，请您留下电话号码，我会尽快联系您；\n' +
                  '您也可以通过以下方式联系我：\n' +
                  '我的电话号码：'+that.data.adviserPhone+'\n' +
                  '我的微信号：'+that.data.adviserWx;
                  let parm={
                      text:text,
                      conSultantWeichat:that.data.adviserWx,
                      conSultantphone:that.data.adviserPhone,
                  }
                  let data = {
                      "csyzwfelab20180425hhhdfq":"secretkey",
                      "param":parm,
                      "type":516,
                      "typedesc":"您好，我现在在忙，请您留下电话号码，我会尽快联系您"
                  };
                  webimhandler.sendCustomMsg({text:'您好，我现在在忙，请您留下电话号码，我会尽快联系您',ext:JSON.stringify(data),data:''},{TYPE:webim.SESSION_TYPE.C2C,myselToID:that.data.adviserId},app.globalData.identifier,function (msg) {
                      that.receiveMsgs({content:parm.text,type:false},false);

                  });
                  clearInterval(timeout)
              }
          },1000)
      }
      var that = this;
      var content = this.data.currentMessage;
      if (!content.replace(/^\s*|\s*$/g, '')) return;
      webimhandler.onSendMsg(this.data.currentMessage,{TYPE:webim.SESSION_TYPE.C2C,myselToID:that.data.adviserId},app.globalData.identifier, function (msg) {
          wx.setStorageSync('isSend'+config.houseId,true);
          let para={
              type:'CLK',//埋点类型
              adviserId:that.data.adviserInfo.id,
              imTalkId:that.data.adviserInfo.id+'_'+app.globalData.single.id+'_'+config.houseId,
              imTalkType:'1',
              clkName:'dianjifasong',//点击前往的页面名称
              pvCurPageName:'liaotianchuangkou',//当前页面名称
              pvCurPageParams:'',//当前页面参数
              pvLastPageName:getCurrentPages()[getCurrentPages().length-2]?getCurrentPages()[getCurrentPages().length-2].data.despageForChat:'',//上一页页面名称
              clkId:'clk_2cmina_27',//点击ID
              clkParams:'',//点击参数
          }
          util.trackRequest(para,app)
          that.receiveMsgs(msg,true);
          if(that.data.isBusy){
              that.receiveMsgs({content:'您好，非常抱歉，我正在为其他用户服务，稍后回复您！',type:false},false)
          }
      },function(msg){
          that.receiveMsgs(msg,true,true);

      })
    this.setData({ currentMessage: '' })
  },
  bindKeyInput:function(e){
    this.setData({
      currentMessage: e.detail.value
    })
  },


})