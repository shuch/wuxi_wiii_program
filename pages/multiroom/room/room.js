var rtcroom = require('../../../utils/rtcroom.js');
var util = require('../../../utils/util.js')
var app  = getApp();
var config = require('../../../config.js');
var webim = require('../../../utils/webim_wx.js');// 为了退出登录状态所引入的
var videoTime;
var pvCurPageParams=null;
Page({
    /**
     * 页面的初始数据
     */
    data: {
      roomID: '',         // 房间id
      roomname: '',       // 房间名称
      beauty: 5,
      muted: false,
      debug: false,
      frontCamera: true,
      assistant:{},
      startTime:null,
      endTime:null,
      flagStatus:1, // 1 初始状态，2视频接通状态，3对方关闭，4房间关闭 5发生错误
      selToID:null,
      dynatownId:null,
      hideBg:false,
      flag:false,
      status:"正在呼叫对方",
      color1:config.color1,
      color2:config.color2,
      backColor:config.backColor,
      hzdlFlag:false, //画质低劣 标志
      ysglFlag:false, //隐私顾虑 标志
      hqcsFlag:false, //好奇尝试 标志
      wlkdFlag:false, //网络卡顿 标志
      fwbjFlag:false, //服务不佳 标志
      bmsyFlag:false, //不明所以 标志
      qtyyFlag:false, //其他原因 标志
      goodIndex:"", // 标志
      evaluateFlag:"", //进入哪个评价页标志
      TextArea:"", //文本输入框的值
      selectTags:[], //标签
    },
    handlehzdl:function(e){
      // var obj = e.currentTarget.dataset.obj;
      // var content = e.currentTarget.dataset.content;
      this.setData({
        hzdlFlag:!this.data.hzdlFlag,
      });
      var item="画质低劣";
      if(this.data.selectTags.includes(item)){
        this.data.selectTags.splice(this.data.selectTags.findIndex(v => v === item),1);
        console.log(this.data.selectTags.join(","))
      } else{
        // this.prizeSelect.push(item);
        this.data.selectTags.push(item);
        console.log(this.data.selectTags.join(","))
      }
    },
    handleysgl:function(e){
      this.setData({
        ysglFlag:!this.data.ysglFlag,
      });
      var item="隐私顾虑";
      if(this.data.selectTags.includes(item)){
        this.data.selectTags.splice(this.data.selectTags.findIndex(v => v === item),1);
      } else{
        this.data.selectTags.push(item);
      }
    },
    handlehqcs:function(e){
      this.setData({
        hqcsFlag:!this.data.hqcsFlag,
      });
      var item="好奇尝试";
      if(this.data.selectTags.includes(item)){
        this.data.selectTags.splice(this.data.selectTags.findIndex(v => v === item),1);
      } else{
        this.data.selectTags.push(item);
      }
    },
    handlewlkd:function(e){
      this.setData({
        wlkdFlag:!this.data.wlkdFlag,
      });
      var item="网络卡顿";
      if(this.data.selectTags.includes(item)){
        this.data.selectTags.splice(this.data.selectTags.findIndex(v => v === item),1);
      } else{
        this.data.selectTags.push(item);
      }
    },
    handlefwbj:function(e){
      this.setData({
        fwbjFlag:!this.data.fwbjFlag,
      });
      var item="服务不佳";
      if(this.data.selectTags.includes(item)){
        this.data.selectTags.splice(this.data.selectTags.findIndex(v => v === item),1);
      } else{
        this.data.selectTags.push(item);
      }
    },
    handlebmsy:function(e){
      this.setData({
        bmsyFlag:!this.data.bmsyFlag,
      });
      var item="不明所以";
      if(this.data.selectTags.includes(item)){
        this.data.selectTags.splice(this.data.selectTags.findIndex(v => v === item),1);
      } else{
        this.data.selectTags.push(item);
      }
    },
    handleqtyy:function(e){
      this.setData({
        qtyyFlag:!this.data.qtyyFlag,
      });
      var item="其他原因";
      if(this.data.selectTags.includes(item)){
        this.data.selectTags.splice(this.data.selectTags.findIndex(v => v === item),1);
      } else{
        this.data.selectTags.push(item);
      }
    },
    handleIndex:function(e){
      var index = e.currentTarget.dataset.index;
      this.setData({
        goodIndex:index,
      })
    },
    onRoomEvent: function (e) {
      var self = this;
      console.log('收到消息:', e);
      switch (e.detail.tag) {
        case 'recvTextMsg': {
          var obj=JSON.parse(e.detail.detail);
          console.log('收到消息recvTextMsg:', e.detail.detail,obj.textMsg);
          if(obj.textMsg.indexOf(self.data.selToID+"离开房间")>0){
            wx.showToast({
              title: '对方已挂断',
              icon: 'none',
              duration: 1500,
            })
            self.setData({
              flagStatus: 3, // 视频结束
              hideBg: false,
              endTime:Date.now()
            });
            self.videoInsert(30,10);//正常退出
            // self.updateDynatown("0"); //修改置业顾问当前忙碌状态 videoTime
            app.globalData.dataJson+=JSON.stringify({"getMessage":self.data.selToID,"text":"对方已挂断"});
            self.exit();
          }
          if(obj.textMsg.indexOf(self.data.selToID+"进入房间")>0){
            // self.setData({
            //   startTime: Date.now()
            // });
            // self.videoInsert(20,10);//对方进入房间
            app.globalData.dataJson+=JSON.stringify({"getMessage":self.data.selToID,"text":"对方接收到视频请求并进入房间"});
            console.log("***对方接收到视频请求并进入房间***",self.data.hideBg)
            // startTime=Date.now()
          }
          if(obj.textMsg.indexOf("108")>0){
            try{
              var obt=JSON.parse(obj.textMsg);
              console.log("==========",obt)
              if(obt.type==="108"||obt.type===108){
                self.setData({
                  hideBg: true,
                });
                app.globalData.dataJson+=JSON.stringify({"getMessage":obj.textMsg,"text":"对方接通视频"});
                console.log("***对方接通视频***",self.data.hideBg)
              }
            }catch(e){
            }
          }
          if(obj.textMsg.indexOf("109")>0){
            try{
              var obt=JSON.parse(obj.textMsg);
               console.log("==========",obt)
              if(obt.type==="109"||obt.type===109){
                self.setData({
                  hideBg: false,
                });
                console.log("***对方隐藏视频***",self.data.hideBg)
              }
            }catch(e){

            }
          }
          break;
        }
        case 'roomClosed': {
          /*
            房间关闭时会收到此通知，客户可以提示用户房间已经关闭，做清理操作
          */
          // 在房间内部才显示提示
          console.log("roomClose:", e.detail.detail);
          this.setData({
              flagStatus: 4,  // 标识房间关闭
              endTime: Date.now()
          });

          var pages = getCurrentPages();
          console.log(pages, pages.length, pages[pages.length - 1].__route__);
          if (pages.length > 1 && (pages[pages.length - 1].__route__ == 'pages/multiroom/room/room')) {
            wx.showToast({
              title: '对方已挂断',
              icon: 'none',
              duration: 1500,
            })
            pages = getCurrentPages();
            console.log(pages, pages.length, pages[pages.length - 1].__route__);
            if (pages.length > 1 && (pages[pages.length - 1].__route__ == 'pages/multiroom/room/room')) {
              // wx.navigateBack({ delta: 1 });
              self.exit();
            }
            // wx.showModal({
            //   title: '提示',
            //   content: e.detail.detail || '对方已挂断',
            //   showCancel: false,
            //   complete: function () {
            //     pages = getCurrentPages();
            //     console.log(pages, pages.length, pages[pages.length - 1].__route__);
            //     if (pages.length > 1 && (pages[pages.length - 1].__route__ == 'pages/multiroom/room/room')) {
            //       // wx.navigateBack({ delta: 1 });
            //       self.exit();
            //     }
            //   }
            // });
          }
          break;
        }
        case 'error': {
          // 在房间内部才显示提示
          // var rtcroomCom = this.selectComponent('#rtcroom');
          console.error("error:", e.detail.detail);
          console.log("error:", e.detail.detail);
          app.globalData.dataJson+=JSON.stringify(e);
          this.setData({
              flagStatus: 5,  // 发生错误
              endTime: Date.now()
          });
          this.videoInsert(99,40);//发生错误
          // console.log("error:", e.detail.detail);
          // if(e.detail.detail.indexOf("未获取到录音功能权限")>=0){
          //   console.log("***error***",e.detail.detail)
          //   rtcroomCom.exitRoom()
          //   wx.navigateBack({ delta: 1 });
          // }
          // if(e.detail.detail.indexOf("未获取到摄像头功能权限")>=0){
          //   console.log("***error***",e.detail.detail)
          //   rtcroomCom.exitRoom()
          //   wx.navigateBack({ delta: 1 });
          // }
          var pages = getCurrentPages();
          console.log(pages, pages.length, pages[pages.length - 1].__route__);
          if (pages.length > 1 && (pages[pages.length - 1].__route__ == 'pages/multiroom/room/room')) {
            wx.showModal({
              title: '提示',
              content: e.detail.detail,
              showCancel: false,
              complete: function () {
                pages = getCurrentPages();
                if (pages.length > 1 && (pages[pages.length - 1].__route__ == 'pages/multiroom/room/room')) {
                  self.exit();
                }
              }
            });
          }
          break;
        }
      }
    },
    exit:function(){
      var self = this;
      var second=0;
      var mini=0;
      // if(self.data.flagStatus!=3){  // 1 初始状态，2视频接通状态，3对方关闭，4房间关闭 5发生错误
      //   console.log("&&&&&self.data.flagStatus&&&&&",self.data.flagStatus);
      // }
      //配置结束时间
      self.data.endTime=self.data.endTime?self.data.endTime:Date.now();
      console.log("&&&&&exit-self.data.flagStatus&&&&&",self.data.flagStatus,self.data.startTime,self.data.endTime);
      if(self.data.endTime&&self.data.startTime){
        var st = Math.floor((self.data.endTime - self.data.startTime)/1000);
        mini=Math.floor(st/60);
        second=st%60;
        videoTime = (mini>9?mini:("0"+mini)) +":"+(second>9?second:("0"+second))
        console.log("***exit***",mini,second,videoTime);
      }
      // 没有接通 或者通话时间小于一分钟，则进入对应评价页面
      if(this.data.flagStatus==1||mini<1){
        this.setData({
          evaluateFlag:"0",
        })
        var para={
          clkId:'clk_2cmina_28',
          clkDesPage:'fankuiyemian',//点击前往的页面名称
          type:'CLK',//埋点类型
          adviserId:app.globalData.videoCustomer.id,//顾问id
          // imTalkId:app.globalData.single.id+'_'+app.globalData.videoCustomer.id+'_'+config.houseId,//对话编号
          imTalkType:'2',//对话类型
          pvCurPageName:'ekanfangjietongye',//当前页面名称
          clkName:'bodaguaduan',//当前页面
          // clkParams:this.data.tel,//点击参数
          pvCurPageParams:'',//当前页面参数
        }
        console.log(para,'视频通话挂断点击埋点pv');
        util.trackRequest(para,app)
        let param = {
          ip:app.globalData.ip,
          type:'PV',
          adviserId:app.globalData.videoCustomer.id,//顾问id
          // imTalkId:app.globalData.single.id+'_'+app.globalData.videoCustomer.id+'_'+config.houseId,//对话编号
          imTalkType:'2',//对话类型
          pvId:'P_2cMINA_7',
          pvCurPageName:'fankuiyemian',//当前页面名称
          pvCurPageParams:'',//当前页面参数
          pvLastPageName:getCurrentPages()[getCurrentPages().length-2]?getCurrentPages()[getCurrentPages().length-2].data.despage:'ekanfangjietongye',//上一页页面名称
          pvLastPageParams:'',//上一页页面参数
          pvPageLoadTime:(new Date().getTime() - wx.getStorageSync('loadTime')),//加载时间
        }
        console.log(param,'视频通话反馈埋点pv');
        util.trackRequest(param,app);
      }
      else{
        this.setData({
          evaluateFlag:"1",
        })
        var para={
          clkId:'clk_2cmina_28',
          clkDesPage:'pingjiayemian',//点击前往的页面名称
          type:'CLK',//埋点类型
          adviserId:app.globalData.videoCustomer.id,//顾问id
          // imTalkId:app.globalData.single.id+'_'+app.globalData.videoCustomer.id+'_'+config.houseId,//对话编号
          imTalkType:'2',//对话类型
          pvCurPageName:'ekanfangjietongye',//当前页面名称
          clkName:'bodaguaduan',//当前页面
          // clkParams:this.data.tel,//点击参数
          pvCurPageParams:'',//当前页面参数
        }
        console.log(para,'视频通话挂断点击埋点pv');
        util.trackRequest(para,app)
        let param = {
          ip:app.globalData.ip,
          type:'PV',
          adviserId:app.globalData.videoCustomer.id,//顾问id
          // imTalkId:app.globalData.single.id+'_'+app.globalData.videoCustomer.id+'_'+config.houseId,//对话编号
          imTalkType:'2',//对话类型
          pvId:'P_2cMINA_8',
          pvCurPageName:'pingjiayemian',//当前页面名称
          pvCurPageParams:'',//当前页面参数
          pvLastPageName:getCurrentPages()[getCurrentPages().length-2]?getCurrentPages()[getCurrentPages().length-2].data.despage:'ekanfangjietongye',//上一页页面名称
          pvLastPageParams:'',//上一页页面参数
          pvPageLoadTime:(new Date().getTime() - wx.getStorageSync('loadTime')),//加载时间
        }
        console.log(param,'视频通话评价埋点pv');
        util.trackRequest(param,app);
      }
      console.log("*******evaluateFlag******",this.data.evaluateFlag,self.data.endTime,self.data.startTime)
    },
    // 真实退出该页面组件
    realExit:function(){
      var self = this;
      if(self.data.flag){
        if(self.data.endTime&&self.data.startTime){
          wx.redirectTo({
            url:'../../chat/chat?videoStatus=1&videoTime='+videoTime
          })
        }
        else{
          wx.redirectTo({
            url:'../../chat/chat?videoStatus=2'
          })
        }
      }
      else{
        wx.navigateBack({ delta: 1 });
      }
      console.log("***真实退出该页面组件***",self.data.flag,self.data.endTime,self.data.startTime);
      // webim.logout(function(resp){
      //   console.log('room.js-已经退出');
      // })
    },
    // 挂断视频
    sendText: function() {
      var rtcroomCom = this.selectComponent('#rtcroom');
      if (rtcroomCom) {
          // console.log(accountInfo)
      //     data: {
      //   text:'客户'+accountInfo.userName+'发起视频看房请求',
      //     ext: JSON.stringify(data),
      //     data:''
      // },
      // typedata: {
      //     TYPE: webim.SESSION_TYPE.C2C,
      //     myselToID: tp.myselToID || "",
      //     flag: tp.flag
      // }
          // let data = {
          //   "csyzwfelab20180425hhhdfq":"secretkey",
          //   "type":514,
          //   "typedesc":"视频挂断"
          // };
          // console.log("*****sendComment*****",JSON.stringify(data))
          // rtcroomCom.sendTextMsg("123456zjs");
          let tp={
            flag:"3", // 发送视频邀请消息
            myselToID:"2758_83"//accountInfo.selToID
          }
          rtcroomCom.sendTextMsg("asdjgklasjdgklasdgk",tp);
      }
    },
    // 顾问接通视频，有拉流信息
    onliveplay: function() {
      if(!this.data.startTime){
        console.log("***onliveplay***",this.data.startTime)
        this.setData({
          flagStatus: 2,
          startTime: Date.now()
        });
      }
    },
    // 自动发送日志，当日志记录超过1500个字符，系统自动发送日志
    trigVideo:function(){
      this.videoInsert(1,1);//
    },
    decline:function(){
      // this.sendText();
      var self = this;
      console.log("***room.js-decline***",self.data.flag,self.data.flagStatus);
      var rtcroomCom = this.selectComponent('#rtcroom');
      let roomInfo = rtcroom.getRoomInfo();
      console.log("***roomInfo***",roomInfo.isPush);// 还没有接通不允许退出
      if(!roomInfo.isPush){
        return false;
      }
      self.videoInsert(30,10);//正常退出
      // 不是对方挂断的
      if(self.data.flagStatus!=3){ // 1 初始状态，2视频接通状态，3对方关闭，4房间关闭 5发生错误
        self.setData({
          hideBg: false,
          endTime:Date.now()
        });
      }
      this.exit();
      console.log("***rtcroomCom.exitRoom()***");
      rtcroomCom.exitRoom();// 底层退出接口
    },
    // 输入框失去焦点时触发
    bindTextAreaBlur: function(e) {
      console.log("**bindTextAreaBlur***",e.detail.value);
      this.setData({
        TextArea:e.detail.value,//文本输入框的值
      })
    },
    //视频监控日志
    videoInsert:function(reqType,reqStatus){
      var self = this;
      var id = app.globalData.single.id;//客户id
      var houseId = config.houseId;
      console.log("***videoInsert***",id,houseId,reqType,reqStatus,util.newUrl()+'elab-marketing-system/imlog/insert');
      wx.request({
        url:util.newUrl()+'elab-marketing-system/imlog/insert',
        method:'POST',
        data:{
            "userId":id,
            // "houseId":houseId,
            "dataJson":app.globalData.dataJson, //冗余JSON
            "pullLog":app.globalData.pullLog,   //拉流日志
            "pushLog":app.globalData.pushLog,   //推流日志
            "mobile":app.globalData.phone,      //手机号码
            "reqStatus":reqStatus,              //10 正常 20 推流异常 30 拉流异常
            "reqType":reqType,          //10 创建房间 20 进入房间 30退出房间
            "system":3,                 //操作系统 1安卓2ios3小程序
            "roomNo":self.data.roomID,  //房间号
            "roleType":0,               //角色类型 0 发起者 1接受者
            "created":Date.now(),
            "creator":id+"_"+houseId,
        },
        success:function(res){
          console.log("&&&success-videoInsert***",res)
        },
        fail:function(res){
          console.log("&&&fail-videoInsert***",res)
        },
        complete:function(res){
          app.globalData.dataJso=app.globalData.pullLog=app.globalData.pushLog="";
        }
      });
    },
    //提交用户评价 一分钟一下以及主动挂断
    submitEvaluate:function(){
      var self = this;
      var id = app.globalData.single.id;//客户id
      var houseId = config.houseId;
      console.log("***submitEvaluate***",id,houseId);
      wx.request({
        url:util.newUrl()+'elab-marketing-authentication/feedback/insertFeedback',
        method:'POST',
        data:{
            "userId":id,
            "houseId":houseId,
            "mobile":app.globalData.phone,
            "remark":self.data.TextArea,
            "tags":self.data.selectTags.join(","),
        },
        success:function(res){
          console.log("&&&success-submitEvaluate***",res)
          self.realExit();//真正退出
        },
        fail:function(res){
          console.log("&&&fail-submitEvaluate***",res)
          self.realExit();//真正退出
        }
      });
    },
    //提交用户评价 通话时间超过一分钟
    submitEvaluate2:function(){
      var self = this;
      var id = app.globalData.single.id;//客户id
      var houseId = config.houseId;
      var totalEvaluate=this.data.goodIndex =="1" ? "10":(this.data.goodIndex =="2" ? "5" : "0");
      console.log("***submitEvaluate***",id,houseId,totalEvaluate);
      wx.request({
        url:util.newUrl()+'elab-marketing-authentication/evalute/adviser/insert',
        method:'POST',
        data:{
            "evaluateCustomerId":id,  //客户id
            "adviserId":this.data.dynatownId, //顾问id
            "houseId":houseId,
            "evaluateMobile":app.globalData.phone,
            "remark":self.data.TextArea,
            "totalEvaluate":totalEvaluate,
        },
        success:function(res){
          console.log("&&&success-submitEvaluate***",res)
          self.realExit();//真正退出
        },
        fail:function(res){
          console.log("&&&fail-submitEvaluate***",res)
          self.realExit();//真正退出
        }
      });
    },
    changeCamera: function () {
      // this.sendComment()
      // var rtcroomCom = this.selectComponent('#rtcroom');
      // if (rtcroomCom) {
      //   rtcroomCom.switchCamera();
      // }
      // this.setData({
      //   frontCamera: !this.data.frontCamera
      // })
    },
    setBeauty: function () {
      var rtcroomCom = this.selectComponent('#rtcroom');
      if (rtcroomCom) {
        let accountInfo = rtcroom.getAccountInfo();
        let data = {
          "type":106,
          "time":Date.now(),
          "param":{
            "text":"123456zjs",
          }
        }
        let parm={
          flag:"0" // 发送普通文字消息
        }
        rtcroomCom.sendTextMsg(JSON.stringify(data),parm);
        rtcroom.getRoomList({
          data:{
            index: 0,
            cnt: 20
          },
          success: function(ret) {
            console.log(ret)
            // self.setData({
            //   roomList: ret.rooms
            // });
            // console.log(this.roomList);
            console.log('拉取房间列表成功',ret);
            // callback && callback();
          },
          fail: function(ret) {
            console.log(ret);
            wx.showModal({
              title: '提示',
              content: ret.errMsg,
              showCancel: false
            });
            // callback && callback();
          }
        });
      }
      // this.data.beauty = (this.data.beauty == 0 ? 5 : 0);
      // this.setData({
      //   beauty: this.data.beauty
      // });
    },
    changeMute: function () {
      this.data.muted = !this.data.muted;
      this.setData({
        muted: this.data.muted
      });
    },
    showLog: function () {
      this.data.debug = !this.data.debug;
      this.setData({
        debug: this.data.debug
      });
    },
    //修改视频顾问的在线状态 1忙碌  0空闲
    updateDynatown:function(status){
        var self = this;
        var advisterId = self.data.dynatownId;//视频顾问id
        var houseId = config.houseId;
        console.log("***updateDynatown***",status,advisterId,houseId,util.url())
        wx.request({
            url:util.newUrl()+'elab-marketing-authentication/worker/adviser/switchStatus',
            method:'POST',
            data:{
                // "evaluateCustomerId":id,  //评价客户id
                "adviserId":advisterId, //视频顾问id
                "houseId":houseId,
                "userRole":2,
                "onlineStatus":status,
            },
            success:function(res){
              console.log("***updateDynatown_res***",res)
            },
            fail:function(re){

            }
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      pvCurPageParams=JSON.stringify(options)
      console.log("********------",options)
      if(options && options.isSuc){
        this.setData({
          flag:true
        });
      }
      else{
        this.setData({
          flag:false
        });
      }
      var self = this;
      wx.getSetting({
          success: (response) => {
            console.log("=======rtcroomCom.onLoad***getSetting",response)
            // 没有授权
            if (!response.authSetting['scope.record'] || !response.authSetting['scope.camera']){
              wx.openSetting({
                success: (res) => {
                    if(res.authSetting['scope.record'] && res.authSetting['scope.camera']){
                      self.init(options)
                    }
                    else{
                      console.log("******openSetting——success-other&&&&&&&",res)
                      if(self.data.flag){
                        wx.redirectTo({
                          url:'../../chat/chat'
                        })
                      }
                      else{
                        wx.navigateBack({ delta: 1 });
                      }
                    }
                },
                fail:(res)=>{
                  console.log("******openSetting错误&&&&&&&",res)
                  wx.showModal({
                    title: '提示',
                    content: '操作太快,请稍后再试',
                    success: function(res) {
                      if (res.confirm) {
                        if(self.data.flag){
                          wx.redirectTo({
                            url:'../../chat/chat'
                          })
                        }
                        else{
                          wx.navigateBack({ delta: 1 });
                        }
                      } else if (res.cancel) {
                        if(self.data.flag){
                          wx.redirectTo({
                            url:'../../chat/chat'
                          })
                        }
                        else{
                          wx.navigateBack({ delta: 1 });
                        }
                      }
                    }
                  })
                  
                }

              })
            }
            else{
              self.init(options)
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
      // var aideData = app.globalData.aideData;
      // this.setData({
      //   aideData: aideData
      // });
      
    },
    callConsultant:function (options){

    },
    // 页面初始化
    init:function(options){
      var self =this;
      console.log('room.js onLoad');
      var time = new Date();
      time = time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
      console.log('*************开始视频看房：' + time + '**************');
      console.log(options)
      self.data.role = options.type;
      self.data.roomID = options.roomID || '';
      self.data.roomname = options.roomName;
      self.data.username = options.userName;
      // self.data.consultantName = options.consultantName;
      self.setData({
        roomID: self.data.roomID,
        roomname: self.data.roomname,
        username: self.data.username
      }, function() {
        var rtcroomCom = self.selectComponent('#rtcroom');
        if (rtcroomCom) {
          console.log("rtcroomCom")
          let accountInfo = rtcroom.getAccountInfo();
          console.log("accountInfo.opt:",accountInfo.opt)
          self.setData({
            assistant:accountInfo.opt||{},
            dynatownId:accountInfo.opt?accountInfo.opt.id:"",
            selToID:accountInfo.selToID||""
          })
          rtcroomCom.start(function(roomID){
            self.setData({
              roomID:roomID,
            })
            self.updateDynatown("1");
            self.videoInsert(10,10);//开始创建房间
          });
        }
      });
    },
    chuli:function(){

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      wx.setStorageSync('loadTime',new Date().getTime())
      var self = this;
      console.log('room.js onShow');
      // 保持屏幕常亮
      wx.setKeepScreenOn({
        keepScreenOn: true
      });
      let param = {
        ip:app.globalData.ip,
        type:'PV',
        adviserId:app.globalData.videoCustomer.id,//顾问id
        // imTalkId:app.globalData.single.id+'_'+app.globalData.videoCustomer.id+'_'+config.houseId,//对话编号
        imTalkType:'2',//对话类型
        pvId:'P_2cMINA_6',
        pvCurPageName:'ekanfangjietongye',//当前页面名称
        pvCurPageParams:'',//当前页面参数
        pvLastPageName:getCurrentPages()[getCurrentPages().length-2]?getCurrentPages()[getCurrentPages().length-2].data.despage:'',//上一页页面名称
        pvLastPageParams:'',//上一页页面参数
        pvPageLoadTime:(new Date().getTime() - wx.getStorageSync('loadTime')),//加载时间
      }
      console.log(param,'视频通话埋点pv');
      util.trackRequest(param,app);
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
      var self = this;
      console.log('room.js onHide');
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
      console.log('***onUnload***room.js onUnload',this.data.flagStatus);
      // this.setData({
      //   flagStatus: 3,
      //   endTime:Date.now()
      // });
      if(this.data.flagStatus==1) // 未接通
      {
        console.log("=====this.data.flagStatus======",this.data.flagStatus)
        // this.updateDynatown("0"); //修改置业顾问当前空闲状态
      }
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        
    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function () {
    //   return {
    //     // title: '多人音视频',
    //     // path: '/pages/multiroom/roomlist/roomlist',
    //     path: '/pages/main/main',
    //     imageUrl: 'https://mc.qcloudimg.com/static/img/dacf9205fe088ec2fef6f0b781c92510/share.png'
    //   }
    // }
})